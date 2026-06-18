import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/form'
import { getAllPricingTiers } from '@/lib/queries'
import PricingRowActions from './PricingRowActions'

export default async function AdminPricingPage() {
  const tiers = await getAllPricingTiers()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="價格管理"
        description="新增、編輯、排序與刪除價格方案。排序會反映在「課程資訊 → 費用」頁。"
        action={
          <Button asChild>
            <Link href="/admin/pricing/new">
              <Plus size={16} />
              新增方案
            </Link>
          </Button>
        }
      />

      {tiers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          目前沒有價格方案，點右上角「新增方案」開始建立。
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {tiers.map((t, i) => {
            const courses = (t.applicableCourses as { name: string }[]) ?? []
            const options = (t.options as { name: string }[]) ?? []
            return (
              <div key={t.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{t.title}</p>
                    {!t.published && (
                      <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">未發佈</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {t.subtitle} · 適用課程 {courses.length} · 方案 {options.length}
                  </p>
                </div>
                <PricingRowActions
                  id={t.id}
                  title={t.title}
                  isFirst={i === 0}
                  isLast={i === tiers.length - 1}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
