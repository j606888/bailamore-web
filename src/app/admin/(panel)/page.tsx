import { auth } from '@/auth'

export default async function AdminDashboardPage() {
  const session = await auth()

  return (
    <div className="max-w-3xl">
      <h1 className="font-poppins text-2xl font-bold mb-1">儀表板</h1>
      <p className="text-gray-500 mb-8">
        歡迎回來{session?.user?.name ? `，${session.user.name}` : ''}。從左側選單管理網站內容。
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-2">建置進度</h2>
        <p className="text-sm text-gray-500 mb-4">
          後台正分階段建置中，詳見{' '}
          <code className="text-teal-700">docs/admin-cms-plan.md</code>。
        </p>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>✅ Phase 0：登入、資料庫骨架、後台框架</li>
          <li>⬜ Phase 1：課程表、師資</li>
          <li>⬜ Phase 2：學生推薦、價格</li>
          <li>⬜ Phase 3：首頁影片、FAQ</li>
          <li>⬜ Phase 4：帳號管理、收尾</li>
        </ul>
      </div>
    </div>
  )
}
