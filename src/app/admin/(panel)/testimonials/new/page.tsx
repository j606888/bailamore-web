import { PageHeader } from '@/components/admin/form'
import TestimonialForm from '../TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader title="新增學生推薦" description="填寫推薦資料，儲存後即可在首頁顯示。" />
      <TestimonialForm />
    </div>
  )
}
