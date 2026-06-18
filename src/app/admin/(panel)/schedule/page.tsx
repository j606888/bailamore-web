import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { PageHeader } from '@/components/admin/form'
import { getSchedulePeriods } from '@/lib/queries'
import { formatDateDisplay } from '@/lib/date'
import NewPeriodForm from './NewPeriodForm'
import DeletePeriodButton from './DeletePeriodButton'

export default async function AdminSchedulePage() {
  const periods = await getSchedulePeriods()

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="課程表管理"
        description="新增上課日期、編輯每日課程。新增時可一鍵複製上一期。"
      />

      <div className="mb-6">
        <NewPeriodForm hasExisting={periods.length > 0} />
      </div>

      {periods.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          目前沒有任何上課日期，請於上方新增。
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {periods.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{formatDateDisplay(p.date)}</p>
                <p className="text-xs text-gray-400 truncate">
                  {p.courses.length === 0
                    ? '尚無課程'
                    : `${p.courses.length} 堂 · ${p.courses.map((c) => c.name).join('、')}`}
                </p>
              </div>
              <Link
                href={`/admin/schedule/${p.id}`}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                title="編輯"
                aria-label="編輯"
              >
                <Pencil size={16} />
              </Link>
              <DeletePeriodButton id={p.id} label={formatDateDisplay(p.date)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
