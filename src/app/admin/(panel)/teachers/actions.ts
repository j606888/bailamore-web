'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { put } from '@vercel/blob'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type TeacherFormState = { error?: string } | undefined

// "a, b，c" / 換行 → ['a','b','c']
const splitCommas = (v: string) =>
  v
    .split(/[,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean)

// 段落以空行分隔
const splitParagraphs = (v: string) =>
  v
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)

// 一行一個 URL，並把 watch / youtu.be 連結正規化為 embed
const normalizeYoutube = (url: string): string => {
  if (/youtube\.com\/embed\//.test(url)) return url
  const id =
    url.match(/[?&]v=([\w-]+)/)?.[1] ?? url.match(/youtu\.be\/([\w-]+)/)?.[1]
  return id ? `https://www.youtube.com/embed/${id}` : url
}

const teacherSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, '請填寫網址代稱（slug）')
    .regex(/^[a-z0-9-]+$/, 'slug 只能包含小寫英數字與連字號（-）'),
  name: z.string().trim().min(1, '請填寫姓名'),
  title: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, '請上傳或填寫頭像圖片網址'),
  instagram: z.string().trim().optional(),
  published: z.boolean(),
})

export async function saveTeacher(
  _prevState: TeacherFormState,
  formData: FormData,
): Promise<TeacherFormState> {
  const id = (formData.get('id') as string) || null

  const parsed = teacherSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    title: formData.get('title'),
    imageUrl: formData.get('imageUrl'),
    instagram: formData.get('instagram'),
    published: formData.get('published') === 'on',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  const skills = splitCommas((formData.get('skills') as string) ?? '')
  const courses = splitCommas((formData.get('courses') as string) ?? '')
  const description = splitParagraphs((formData.get('description') as string) ?? '')
  const videos = ((formData.get('videos') as string) ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeYoutube)

  const data = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    title: parsed.data.title || null,
    imageUrl: parsed.data.imageUrl,
    instagram: parsed.data.instagram || null,
    skills,
    courses,
    description,
    videos,
    published: parsed.data.published,
  }

  const savedSlug = parsed.data.slug
  try {
    if (id) {
      // 取得舊 slug 以便 revalidate 舊路徑
      const existing = await prisma.teacher.findUnique({ where: { id }, select: { slug: true } })
      await prisma.teacher.update({ where: { id }, data })
      if (existing && existing.slug !== savedSlug) {
        revalidatePath(`/teachers/${existing.slug}`)
      }
    } else {
      const max = await prisma.teacher.aggregate({ _max: { sortOrder: true } })
      await prisma.teacher.create({
        data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      })
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: `網址代稱「${savedSlug}」已被使用，請換一個` }
    }
    console.error('saveTeacher failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/teachers')
  revalidatePath(`/teachers/${savedSlug}`)
  revalidatePath('/admin/teachers')
  redirect('/admin/teachers')
}

export async function deleteTeacher(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return
  const teacher = await prisma.teacher.findUnique({ where: { id }, select: { slug: true } })
  await prisma.teacher.delete({ where: { id } })
  if (teacher) revalidatePath(`/teachers/${teacher.slug}`)
  revalidatePath('/teachers')
  revalidatePath('/admin/teachers')
}

// 與相鄰者交換 sortOrder
export async function moveTeacher(formData: FormData) {
  const id = formData.get('id') as string
  const direction = formData.get('direction') as 'up' | 'down'
  if (!id || !direction) return

  const all = await prisma.teacher.findMany({ orderBy: { sortOrder: 'asc' } })
  const idx = all.findIndex((t) => t.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]
  await prisma.$transaction([
    prisma.teacher.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.teacher.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ])

  revalidatePath('/teachers')
  revalidatePath('/admin/teachers')
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
    const blob = await put(`teachers/${Date.now()}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    return { url: blob.url }
  } catch (e) {
    console.error('uploadImage failed', e)
    return { error: '上傳失敗，請稍後再試' }
  }
}
