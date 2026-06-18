import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getTeacherById } from '@/lib/queries'
import TeacherForm from '../../TeacherForm'

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const teacher = await getTeacherById(id)
  if (!teacher) notFound()

  return (
    <div>
      <PageHeader title="編輯師資" description={`正在編輯「${teacher.name}」。`} />
      <TeacherForm
        teacher={{
          id: teacher.id,
          slug: teacher.slug,
          name: teacher.name,
          title: teacher.title,
          imageUrl: teacher.imageUrl,
          instagram: teacher.instagram,
          skills: teacher.skills,
          courses: teacher.courses,
          description: teacher.description,
          videos: teacher.videos,
          published: teacher.published,
        }}
      />
    </div>
  )
}
