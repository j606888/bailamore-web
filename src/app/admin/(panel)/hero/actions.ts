'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export type HeroFormState = { error?: string; ok?: boolean } | undefined

const heroSchema = z.object({
  // 允許相對路徑或絕對網址，故只做非空檢查
  videoUrl: z.string().trim().min(1, '請上傳影片或填寫影片網址'),
})

export async function saveHeroVideo(
  _prevState: HeroFormState,
  formData: FormData,
): Promise<HeroFormState> {
  const parsed = heroSchema.safeParse({ videoUrl: formData.get('videoUrl') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  try {
    await prisma.siteSetting.upsert({
      where: { key: 'hero_video_url' },
      update: { value: parsed.data.videoUrl },
      create: { key: 'hero_video_url', value: parsed.data.videoUrl },
    })
  } catch (e) {
    console.error('saveHeroVideo failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/')
  return { ok: true }
}

// 影片上傳 → Vercel Blob，回傳公開網址
export async function uploadHeroVideo(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: '請選擇檔案' }

  const allowed = ['video/mp4']
  if (!allowed.includes(file.type)) {
    return { error: '僅支援 MP4 影片' }
  }
  if (file.size > 200 * 1024 * 1024) {
    return { error: '影片需小於 200MB' }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: '尚未設定 BLOB_READ_WRITE_TOKEN，無法上傳。可先直接填寫影片網址。' }
  }

  try {
    const ext = file.name.split('.').pop() || 'mp4'
    const blob = await put(`hero/${Date.now()}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })
    return { url: blob.url }
  } catch (e) {
    console.error('uploadHeroVideo failed', e)
    return { error: '上傳失敗，請稍後再試' }
  }
}
