import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getTestimonialById } from '@/lib/queries'
import TestimonialForm from '../../TestimonialForm'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)
  if (!testimonial) notFound()

  return (
    <div>
      <PageHeader title="編輯學生推薦" description={`正在編輯「${testimonial.name}」。`} />
      <TestimonialForm
        testimonial={{
          id: testimonial.id,
          name: testimonial.name,
          title: testimonial.title,
          imageUrl: testimonial.imageUrl,
          danceStyle: testimonial.danceStyle,
          content: testimonial.content,
          published: testimonial.published,
        }}
      />
    </div>
  )
}
