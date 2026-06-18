import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getFaqById } from '@/lib/queries'
import FaqForm from '../../FaqForm'

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const faq = await getFaqById(id)
  if (!faq) notFound()

  return (
    <div>
      <PageHeader title="編輯問答" description={`正在編輯「${faq.question}」。`} />
      <FaqForm
        faq={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          published: faq.published,
        }}
      />
    </div>
  )
}
