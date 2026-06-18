'use client'

import { useActionState, useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { saveTeacher, uploadImage, type TeacherFormState } from './actions'

type TeacherInput = {
  id: string
  slug: string
  name: string
  title: string | null
  imageUrl: string
  instagram: string | null
  skills: string[]
  courses: string[]
  description: string[]
  videos: string[]
  published: boolean
}

export default function TeacherForm({ teacher }: { teacher?: TeacherInput }) {
  const [state, formAction, pending] = useActionState<TeacherFormState, FormData>(
    saveTeacher,
    undefined,
  )

  const [imageUrl, setImageUrl] = useState(teacher?.imageUrl ?? '')
  const [uploadError, setUploadError] = useState<string>()
  const [uploading, startUpload] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setUploadError(undefined)
    const fd = new FormData()
    fd.set('file', file)
    startUpload(async () => {
      const res = await uploadImage(fd)
      if (res.url) setImageUrl(res.url)
      else setUploadError(res.error)
    })
  }

  return (
    <form action={formAction} className="max-w-2xl flex flex-col gap-5">
      {teacher && <input type="hidden" name="id" value={teacher.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="姓名" htmlFor="name" required>
          <input id="name" name="name" defaultValue={teacher?.name} required className={inputClass} />
        </Field>
        <Field label="網址代稱 (slug)" htmlFor="slug" required hint="顯示於 /teachers/<slug>，僅小寫英數與 -">
          <input id="slug" name="slug" defaultValue={teacher?.slug} required className={inputClass} placeholder="sean" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="頭銜" htmlFor="title" hint="例：Baila'more創辦人（可留空）">
          <input id="title" name="title" defaultValue={teacher?.title ?? ''} className={inputClass} />
        </Field>
        <Field label="Instagram 帳號" htmlFor="instagram" hint="只填帳號，不含 @ 與網址（可留空）">
          <input id="instagram" name="instagram" defaultValue={teacher?.instagram ?? ''} className={inputClass} placeholder="baila_moredancestudio" />
        </Field>
      </div>

      {/* 頭像 */}
      <Field label="頭像" required hint="可上傳圖片（JPG/PNG/WebP，<5MB）或直接貼上圖片網址">
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            {imageUrl ? (
              <Image src={imageUrl} alt="預覽" fill className="object-cover" sizes="96px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">無圖片</div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://… 或 /teachers/Sean.jpg"
              className={inputClass}
            />
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? '上傳中…' : '上傳圖片'}
              </Button>
              {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
            </div>
          </div>
        </div>
      </Field>

      <Field label="專長 / 舞風標籤" htmlFor="skills" hint="以逗號分隔，例：Bachata, Salsa, Zouk">
        <input id="skills" name="skills" defaultValue={teacher?.skills.join(', ')} className={inputClass} />
      </Field>

      <Field label="授課項目" htmlFor="courses" hint="以逗號分隔，例：Bachata Lv1, Bachata Lv2">
        <input id="courses" name="courses" defaultValue={teacher?.courses.join(', ')} className={inputClass} />
      </Field>

      <Field label="簡介" htmlFor="description" hint="段落之間以「空一行」分隔">
        <textarea
          id="description"
          name="description"
          defaultValue={teacher?.description.join('\n\n')}
          rows={8}
          className={inputClass}
        />
      </Field>

      <Field label="舞蹈展示 (YouTube)" htmlFor="videos" hint="一行一個連結，watch / youtu.be 連結會自動轉成 embed">
        <textarea
          id="videos"
          name="videos"
          defaultValue={teacher?.videos.join('\n')}
          rows={3}
          className={inputClass}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="published" defaultChecked={teacher?.published ?? true} className="w-4 h-4 accent-teal-600" />
        發佈（顯示於前台）
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/teachers" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
