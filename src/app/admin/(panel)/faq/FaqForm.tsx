'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { saveFaq, type FaqFormState } from './actions'

type FaqInput = {
  id: string
  question: string
  answer: string
  published: boolean
}

export default function FaqForm({ faq }: { faq?: FaqInput }) {
  const [state, formAction, pending] = useActionState<FaqFormState, FormData>(
    saveFaq,
    undefined,
  )

  return (
    <form action={formAction} className="max-w-2xl flex flex-col gap-5">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <Field label="問題" htmlFor="question" required>
        <input
          id="question"
          name="question"
          defaultValue={faq?.question}
          required
          className={inputClass}
          placeholder="如何報名課程"
        />
      </Field>

      <Field
        label="答案"
        htmlFor="answer"
        required
        hint="支援 Markdown。連結寫法：[顯示文字](網址)，例：[Line 官方帳號](https://lin.ee/2dtDvpO)、[課程資訊](/courses)。段落之間空一行。"
      >
        <textarea
          id="answer"
          name="answer"
          defaultValue={faq?.answer}
          rows={6}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={faq?.published ?? true}
          className="w-4 h-4 accent-teal-600"
        />
        發佈（顯示於前台）
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/faq" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
