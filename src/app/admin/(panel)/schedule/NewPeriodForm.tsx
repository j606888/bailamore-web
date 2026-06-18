'use client'

import { useActionState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { inputClass, FormError } from '@/components/admin/form'
import { createPeriod, type ScheduleFormState } from './actions'

export default function NewPeriodForm({ hasExisting }: { hasExisting: boolean }) {
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    createPeriod,
    undefined,
  )

  return (
    <form action={formAction} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">新增上課日期</p>
      <div className="flex flex-wrap items-end gap-3">
        <input name="date" type="date" required className={`${inputClass} max-w-[200px]`} aria-label="上課日期" />
        {hasExisting && (
          <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
            <input type="checkbox" name="copyPrevious" defaultChecked className="w-4 h-4 accent-teal-600" />
            複製上一期課程
          </label>
        )}
        <Button type="submit" disabled={pending}>
          <Plus size={16} />
          {pending ? '建立中…' : '新增'}
        </Button>
      </div>
      <FormError message={state?.error} />
    </form>
  )
}
