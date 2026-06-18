'use client'

import { ChevronUp, ChevronDown, Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'
import { deleteTeacher, moveTeacher } from './actions'

export default function TeacherRowActions({
  id,
  name,
  isFirst,
  isLast,
}: {
  id: string
  name: string
  isFirst: boolean
  isLast: boolean
}) {
  const iconBtn =
    'p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'

  return (
    <div className="flex items-center gap-1">
      <form action={moveTeacher}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" className={iconBtn} disabled={isFirst} title="上移" aria-label="上移">
          <ChevronUp size={16} />
        </button>
      </form>
      <form action={moveTeacher}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" className={iconBtn} disabled={isLast} title="下移" aria-label="下移">
          <ChevronDown size={16} />
        </button>
      </form>
      <Link href={`/admin/teachers/${id}/edit`} className={iconBtn} title="編輯" aria-label="編輯">
        <Pencil size={16} />
      </Link>
      <form
        action={deleteTeacher}
        onSubmit={(e) => {
          if (!window.confirm(`確定要刪除師資「${name}」嗎？此動作無法復原。`)) {
            e.preventDefault()
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="刪除"
          aria-label="刪除"
        >
          <Trash2 size={16} />
        </button>
      </form>
    </div>
  )
}
