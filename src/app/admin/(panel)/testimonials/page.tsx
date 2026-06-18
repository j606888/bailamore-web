import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/form'
import { getAllTestimonials } from '@/lib/queries'
import TestimonialRowActions from './TestimonialRowActions'

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="學生推薦管理"
        description="新增、編輯、排序與刪除學生推薦。排序會反映在首頁輪播。"
        action={
          <Button asChild>
            <Link href="/admin/testimonials/new">
              <Plus size={16} />
              新增推薦
            </Link>
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          目前沒有學生推薦，點右上角「新增推薦」開始建立。
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {testimonials.map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 px-4 py-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {t.imageUrl && (
                  <Image src={t.imageUrl} alt={t.name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{t.name}</p>
                  {!t.published && (
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">未發佈</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {t.title} · {t.danceStyle}
                </p>
              </div>
              <TestimonialRowActions
                id={t.id}
                name={t.name}
                isFirst={i === 0}
                isLast={i === testimonials.length - 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
