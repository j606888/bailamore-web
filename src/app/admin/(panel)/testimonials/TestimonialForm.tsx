'use client'

import { useActionState, useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { saveTestimonial, uploadImage, type TestimonialFormState } from './actions'

type TestimonialInput = {
  id: string
  name: string
  title: string
  imageUrl: string
  danceStyle: string
  content: string[]
  published: boolean
}

export default function TestimonialForm({
  testimonial,
}: {
  testimonial?: TestimonialInput
}) {
  const [state, formAction, pending] = useActionState<TestimonialFormState, FormData>(
    saveTestimonial,
    undefined,
  )

  const [imageUrl, setImageUrl] = useState(testimonial?.imageUrl ?? '')
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
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="姓名" htmlFor="name" required>
          <input id="name" name="name" defaultValue={testimonial?.name} required className={inputClass} placeholder="Dora" />
        </Field>
        <Field label="舞風" htmlFor="danceStyle" required hint="例：Bachata 或 Bachata & Salsa">
          <input id="danceStyle" name="danceStyle" defaultValue={testimonial?.danceStyle} required className={inputClass} />
        </Field>
      </div>

      <Field label="稱號" htmlFor="title" required hint="顯示於姓名下方，例：核心沒力的跳舞小白">
        <input id="title" name="title" defaultValue={testimonial?.title} required className={inputClass} />
      </Field>

      {/* 頭像 */}
      <Field label="頭像" required hint="可上傳圖片（JPG/PNG/WebP，<5MB）或直接貼上圖片網址">
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
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
              placeholder="https://… 或 /testimonials/dora.png"
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

      <Field label="推薦內容" htmlFor="content" required hint="段落之間以「空一行」分隔">
        <textarea
          id="content"
          name="content"
          defaultValue={testimonial?.content.join('\n\n')}
          rows={8}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published ?? true} className="w-4 h-4 accent-teal-600" />
        發佈（顯示於前台）
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/testimonials" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
