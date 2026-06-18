'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export type PricingFormState = { error?: string } | undefined

const tierSchema = z.object({
  title: z.string().trim().min(1, '請填寫方案標題'),
  subtitle: z.string().trim().min(1, '請填寫方案副標'),
  note: z.string().trim().min(1, '請填寫備註'),
  published: z.boolean(),
})

const applicableCoursesSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1),
      colorScheme: z.enum(['sky', 'orange']),
    }),
  )

const optionsSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1),
      price: z.coerce.number().min(0),
    }),
  )

// 解析表單中以 JSON 提交的巢狀陣列，過濾空白項目
function parseJsonArray(raw: FormDataEntryValue | null): unknown[] {
  if (typeof raw !== 'string' || !raw.trim()) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function savePricingTier(
  _prevState: PricingFormState,
  formData: FormData,
): Promise<PricingFormState> {
  const id = (formData.get('id') as string) || null

  const parsed = tierSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    note: formData.get('note'),
    published: formData.get('published') === 'on',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  // 適用課程：過濾未填名稱者
  const coursesParsed = applicableCoursesSchema.safeParse(
    parseJsonArray(formData.get('applicableCourses')).filter(
      (c): c is { name: string; colorScheme: string } =>
        typeof c === 'object' && c !== null && 'name' in c && typeof (c as { name: unknown }).name === 'string' && (c as { name: string }).name.trim() !== '',
    ),
  )
  if (!coursesParsed.success) {
    return { error: '適用課程格式有誤，請確認每個標籤都已選顏色' }
  }

  // 方案：過濾未填名稱者
  const optionsParsed = optionsSchema.safeParse(
    parseJsonArray(formData.get('options')).filter(
      (o): o is { name: string; price: unknown } =>
        typeof o === 'object' && o !== null && 'name' in o && typeof (o as { name: unknown }).name === 'string' && (o as { name: string }).name.trim() !== '',
    ),
  )
  if (!optionsParsed.success) {
    return { error: '方案格式有誤，請確認每個方案都有名稱與正確的價格' }
  }
  if (optionsParsed.data.length === 0) {
    return { error: '請至少新增一個方案（名稱 + 價格）' }
  }

  const data = {
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    note: parsed.data.note,
    published: parsed.data.published,
    applicableCourses: coursesParsed.data,
    options: optionsParsed.data,
  }

  try {
    if (id) {
      await prisma.pricingTier.update({ where: { id }, data })
    } else {
      const max = await prisma.pricingTier.aggregate({ _max: { sortOrder: true } })
      await prisma.pricingTier.create({
        data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      })
    }
  } catch (e) {
    console.error('savePricingTier failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/courses')
  revalidatePath('/admin/pricing')
  redirect('/admin/pricing')
}

export async function deletePricingTier(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await prisma.pricingTier.delete({ where: { id } })
  revalidatePath('/courses')
  revalidatePath('/admin/pricing')
}

// 與相鄰者交換 sortOrder
export async function movePricingTier(formData: FormData) {
  const id = formData.get('id') as string
  const direction = formData.get('direction') as 'up' | 'down'
  if (!id || !direction) return

  const all = await prisma.pricingTier.findMany({ orderBy: { sortOrder: 'asc' } })
  const idx = all.findIndex((t) => t.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]
  await prisma.$transaction([
    prisma.pricingTier.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.pricingTier.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ])

  revalidatePath('/courses')
  revalidatePath('/admin/pricing')
}
