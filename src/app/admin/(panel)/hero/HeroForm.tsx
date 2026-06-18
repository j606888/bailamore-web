'use client'

import { useActionState, useState, useRef, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { saveHeroVideo, uploadHeroVideo, type HeroFormState } from './actions'

export default function HeroForm({ videoUrl: initial }: { videoUrl: string }) {
  const [state, formAction, pending] = useActionState<HeroFormState, FormData>(
    saveHeroVideo,
    undefined,
  )

  const [videoUrl, setVideoUrl] = useState(initial)
  const [uploadError, setUploadError] = useState<string>()
  const [uploading, startUpload] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setUploadError(undefined)
    const fd = new FormData()
    fd.set('file', file)
    startUpload(async () => {
      const res = await uploadHeroVideo(fd)
      if (res.url) setVideoUrl(res.url)
      else setUploadError(res.error)
    })
  }

  return (
    <form action={formAction} className="max-w-2xl flex flex-col gap-5">
      <Field
        label="影片網址"
        required
        hint="可上傳 MP4 影片（<200MB）或直接貼上影片網址。"
      >
        <input type="hidden" name="videoUrl" value={videoUrl} />
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://… .mp4"
          className={inputClass}
        />
        <div className="flex items-center gap-2 mt-2">
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4"
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
            {uploading ? '上傳中…' : '上傳影片'}
          </Button>
          {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
        </div>
      </Field>

      {videoUrl && (
        <div className="w-full max-w-md">
          <p className="text-sm font-medium text-gray-700 mb-1.5">預覽</p>
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            muted
            playsInline
            className="w-full rounded-md border border-gray-200 bg-black"
          />
        </div>
      )}

      <FormError message={state?.error} />
      {state?.ok && (
        <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
          已儲存，首頁影片已更新。
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
      </div>
    </form>
  )
}
