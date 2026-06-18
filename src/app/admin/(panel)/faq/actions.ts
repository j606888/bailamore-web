'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export type FaqFormState = { error?: string } | undefined

const faqSchema = z.object({
  question: z.string().trim().min(1, '請填寫問題'),
  answer: z.string().trim().min(1, '請填寫答案'),
  published: z.boolean(),
})

export async function saveFaq(
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  const id = (formData.get('id') as string) || null

  const parsed = faqSchema.safeParse({
    question: formData.get('question'),
    answer: formData.get('answer'),
    published: formData.get('published') === 'on',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  const data = {
    question: parsed.data.question,
    answer: parsed.data.answer,
    published: parsed.data.published,
  }

  try {
    if (id) {
      await prisma.faq.update({ where: { id }, data })
    } else {
      const max = await prisma.faq.aggregate({ _max: { sortOrder: true } })
      await prisma.faq.create({
        data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      })
    }
  } catch (e) {
    console.error('saveFaq failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/')
  revalidatePath('/admin/faq')
  redirect('/admin/faq')
}

export async function deleteFaq(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await prisma.faq.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/faq')
}

// 與相鄰者交換 sortOrder
export async function moveFaq(formData: FormData) {
  const id = formData.get('id') as string
  const direction = formData.get('direction') as 'up' | 'down'
  if (!id || !direction) return

  const all = await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } })
  const idx = all.findIndex((f) => f.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]
  await prisma.$transaction([
    prisma.faq.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.faq.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ])

  revalidatePath('/')
  revalidatePath('/admin/faq')
}
