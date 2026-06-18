import { PageHeader } from '@/components/admin/form'
import FaqForm from '../FaqForm'

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader title="新增問答" description="填寫問題與答案（Markdown），儲存後即可在首頁顯示。" />
      <FaqForm />
    </div>
  )
}
