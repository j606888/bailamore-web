import { PageHeader } from '@/components/admin/form'
import TeacherForm from '../TeacherForm'

export default function NewTeacherPage() {
  return (
    <div>
      <PageHeader title="新增師資" description="填寫師資資料，儲存後即可在前台顯示。" />
      <TeacherForm />
    </div>
  )
}
