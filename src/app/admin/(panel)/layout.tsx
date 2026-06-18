import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { logout } from '../actions'

// 後台導覽列。ready=false 的項目尚未實作（依 docs/admin-cms-plan.md 分階段開放）。
const NAV_ITEMS: { href: string; label: string; ready: boolean }[] = [
  { href: '/admin', label: '儀表板', ready: true },
  { href: '/admin/schedule', label: '課程表', ready: true },
  { href: '/admin/teachers', label: '師資', ready: true },
  { href: '/admin/testimonials', label: '學生推薦', ready: false },
  { href: '/admin/pricing', label: '價格', ready: false },
  { href: '/admin/hero', label: '首頁影片', ready: false },
  { href: '/admin/faq', label: 'FAQ', ready: false },
  { href: '/admin/users', label: '帳號管理', ready: false },
]

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-poppins font-bold text-lg leading-tight">Baila&apos;more</p>
          <p className="text-xs text-gray-400">管理後台</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="px-3 py-2 rounded-md text-sm text-gray-300 cursor-not-allowed flex items-center justify-between"
                title="尚未開放"
              >
                {item.label}
                <span className="text-[10px] text-gray-300">即將推出</span>
              </span>
            ),
          )}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <p className="px-3 text-xs text-gray-400 mb-2 truncate">
            {session.user.name ?? session.user.email}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              登出
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  )
}
