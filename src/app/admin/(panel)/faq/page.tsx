import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/admin/form'
import { getAllFaqs } from '@/lib/queries'
import FaqRowActions from './FaqRowActions'

export default async function AdminFaqPage() {
  const faqs = await getAllFaqs()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="FAQ 管理"
        description="新增、編輯、排序與刪除常見問答。排序會反映在首頁。答案支援 Markdown。"
        action={
          <Button asChild>
            <Link href="/admin/faq/new">
              <Plus size={16} />
              新增問答
            </Link>
          </Button>
        }
      />

      {faqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
          目前沒有問答，點右上角「新增問答」開始建立。
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={f.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{f.question}</p>
                  {!f.published && (
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">未發佈</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{f.answer}</p>
              </div>
              <FaqRowActions
                id={f.id}
                question={f.question}
                isFirst={i === 0}
                isLast={i === faqs.length - 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
