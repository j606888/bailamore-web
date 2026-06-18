'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { parseDateInput } from '@/lib/date'

export type ScheduleFormState = { error?: string } | undefined

const slotSchema = z.object({
  startTime: z.string().trim().min(1),
  endTime: z.string().trim().min(1),
  name: z.string().trim().min(1),
  cardType: z.string().trim().nullable(),
})

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '請選擇有效日期')

function revalidateAll() {
  revalidatePath('/courses')
  revalidatePath('/admin/schedule')
}

// 新增上課日期，可選擇複製「上一期」（日期最接近且早於新日期，否則取最新一期）的課程
export async function createPeriod(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const dateParsed = dateSchema.safeParse(formData.get('date'))
  if (!dateParsed.success) {
    return { error: dateParsed.error.issues[0]?.message ?? '日期格式有誤' }
  }
  const copyPrevious = formData.get('copyPrevious') === 'on'
  const date = parseDateInput(dateParsed.data)

  let slotsToCopy: { startTime: string; endTime: string; name: string; cardType: string | null; sortOrder: number }[] = []
  if (copyPrevious) {
    const prev =
      (await prisma.schedulePeriod.findFirst({
        where: { date: { lt: date } },
        orderBy: { date: 'desc' },
        include: { courses: { orderBy: { sortOrder: 'asc' } } },
      })) ??
      (await prisma.schedulePeriod.findFirst({
        orderBy: { date: 'desc' },
        include: { courses: { orderBy: { sortOrder: 'asc' } } },
      }))
    if (prev) {
      slotsToCopy = prev.courses.map((c, i) => ({
        startTime: c.startTime,
        endTime: c.endTime,
        name: c.name,
        cardType: c.cardType,
        sortOrder: i,
      }))
    }
  }

  const created = await prisma.schedulePeriod.create({
    data: {
      date,
      courses: slotsToCopy.length ? { create: slotsToCopy } : undefined,
    },
  })

  revalidateAll()
  redirect(`/admin/schedule/${created.id}`)
}

// 儲存單一期：更新日期 + 整批替換課程
export async function savePeriod(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const id = formData.get('id') as string
  if (!id) return { error: '缺少期別 id' }

  const dateParsed = dateSchema.safeParse(formData.get('date'))
  if (!dateParsed.success) {
    return { error: dateParsed.error.issues[0]?.message ?? '日期格式有誤' }
  }

  let rawSlots: unknown
  try {
    rawSlots = JSON.parse((formData.get('slots') as string) || '[]')
  } catch {
    return { error: '課程資料格式有誤' }
  }
  const slotsParsed = z.array(slotSchema).safeParse(rawSlots)
  if (!slotsParsed.success) {
    return { error: '請確認每堂課都有填寫時間與名稱' }
  }

  const date = parseDateInput(dateParsed.data)

  await prisma.$transaction([
    prisma.courseSlot.deleteMany({ where: { periodId: id } }),
    prisma.schedulePeriod.update({
      where: { id },
      data: {
        date,
        courses: {
          create: slotsParsed.data.map((s, i) => ({
            startTime: s.startTime,
            endTime: s.endTime,
            name: s.name,
            cardType: s.cardType || null,
            sortOrder: i,
          })),
        },
      },
    }),
  ])

  revalidateAll()
  redirect('/admin/schedule')
}

export async function deletePeriod(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await prisma.schedulePeriod.delete({ where: { id } }) // CourseSlot 連帶刪除 (onDelete: Cascade)
  revalidateAll()
}
