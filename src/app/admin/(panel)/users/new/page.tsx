import { PageHeader } from '@/components/admin/form'
import UserForm from '../UserForm'

export default function NewUserPage() {
  return (
    <div>
      <PageHeader title="新增帳號" description="建立一個新的後台帳號（與既有帳號同權限）。" />
      <UserForm />
    </div>
  )
}
