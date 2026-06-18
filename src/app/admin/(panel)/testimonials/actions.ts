'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export type TestimonialFormState = { error?: string } | undefined

// 段落以空行分隔
const splitParagraphs = (v: string) =>
  v
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)

const testimonialSchema = z.object({
  name: z.string().trim().min(1, '請填寫姓名'),
  title: z.string().trim().min(1, '請填寫稱號（例：核心沒力的跳舞小白）'),
  imageUrl: z.string().trim().min(1, '請上傳或填寫頭像圖片網址'),
  danceStyle: z.string().trim().min(1, '請填寫舞風（例：Bachata & Salsa）'),
  published: z.boolean(),
})

export async function saveTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const id = (formData.get('id') as string) || null

  const parsed = testimonialSchema.safeParse({
    name: formData.get('name'),
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    danceStyle: formData.get('danceStyle'),
    published: formData.get('published') === 'on',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  const content = splitParagraphs((formData.get('content') as string) ?? '')
  if (content.length === 0) {
    return { error: '請填寫推薦內容' }
  }

  const data = {
    name: parsed.data.name,
    title: parsed.data.title,
    imageUrl: parsed.data.imageUrl,
    danceStyle: parsed.data.danceStyle,
    content,
    published: parsed.data.published,
  }

  try {
    if (id) {
      await prisma.testimonial.update({ where: { id }, data })
    } else {
      const max = await prisma.testimonial.aggregate({ _max: { sortOrder: true } })
      await prisma.testimonial.create({
        data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      })
    }
  } catch (e) {
    console.error('saveTestimonial failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  redirect('/admin/testimonials')
}

export async function deleteTestimonial(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}

// 與相鄰者交換 sortOrder
export async function moveTestimonial(formData: FormData) {
  const id = formData.get('id') as string
  const direction = formData.get('direction') as 'up' | 'down'
  if (!id || !direction) return

  const all = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
  const idx = all.findIndex((t) => t.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]
  await prisma.$transaction([
    prisma.testimonial.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.testimonial.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ])

  revalidatePath('/')
  revalidatePath('/admin/testimonials')
}

// 圖片上傳 → Vercel Blob，回傳公開網址
export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: '請選擇檔案' }

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return { error: '僅支援 JPG / PNG / WebP 圖片' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: '圖片需小於 5MB' }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: '尚未設定 BLOB_READ_WRITE_TOKEN，無法上傳。可先直接填寫圖片網址。' }
  }

  try {
    const ext = file.name.split('.').pop() || 'jpg'
    const blob = await put(`testimonials/${Date.now()}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    return { url: blob.url }
  } catch (e) {
    console.error('uploadImage failed', e)
    return { error: '上傳失敗，請稍後再試' }
  }
}
