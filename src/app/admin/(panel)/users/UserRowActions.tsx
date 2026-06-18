'use client'

import { Trash2, Pencil } from 'lucide-react'
import Link from 'next/link'
import { deleteUser } from './actions'

export default function UserRowActions({
  id,
  name,
  isSelf,
}: {
  id: string
  name: string
  isSelf: boolean
}) {
  const iconBtn =
    'p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/users/${id}/edit`} className={iconBtn} title="編輯" aria-label="編輯">
        <Pencil size={16} />
      </Link>
      {isSelf ? (
        <button
          type="button"
          disabled
          className={iconBtn}
          title="無法刪除目前登入的帳號"
          aria-label="無法刪除自己"
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <form
          action={deleteUser}
          onSubmit={(e) => {
            if (!window.confirm(`確定要刪除帳號「${name}」嗎？此動作無法復原。`)) {
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
      )}
    </div>
  )
}
