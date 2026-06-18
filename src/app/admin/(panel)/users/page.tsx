import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/form'
import { getAllUsers } from '@/lib/queries'
import { auth } from '@/auth'
import { toDateInputValue } from '@/lib/date'
import UserRowActions from './UserRowActions'

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getAllUsers(), auth()])
  const myEmail = session?.user?.email ?? null

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="帳號管理"
        description="新增、編輯與刪除後台帳號。所有帳號權限相同，皆可編輯全部內容。"
        action={
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus size={16} />
              新增帳號
            </Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
        {users.map((u) => {
          const isSelf = !!myEmail && u.email === myEmail
          return (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{u.name}</p>
                  {isSelf && (
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">你</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {u.email} · 建立於 {toDateInputValue(u.createdAt)}
                </p>
              </div>
              <UserRowActions id={u.id} name={u.name} isSelf={isSelf} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
