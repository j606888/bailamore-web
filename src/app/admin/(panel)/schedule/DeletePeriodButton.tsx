'use client'

import { Trash2 } from 'lucide-react'
import { deletePeriod } from './actions'

export default function DeletePeriodButton({ id, label }: { id: string; label: string }) {
  return (
    <form
      action={deletePeriod}
      onSubmit={(e) => {
        if (!window.confirm(`確定要刪除「${label}」這一期的課表嗎？此動作無法復原。`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        title="刪除這一期"
        aria-label="刪除這一期"
      >
        <Trash2 size={16} />
      </button>
    </form>
  )
}
