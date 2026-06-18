import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getUserById } from '@/lib/queries'
import UserForm from '../../UserForm'

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)
  if (!user) notFound()

  return (
    <div>
      <PageHeader title="編輯帳號" description={`正在編輯「${user.name}」。`} />
      <UserForm user={{ id: user.id, name: user.name, email: user.email }} />
    </div>
  )
}
