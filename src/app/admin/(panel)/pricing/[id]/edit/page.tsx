import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getPricingTierById } from '@/lib/queries'
import PricingForm, {
  type CourseTag,
  type PricingOption,
} from '../../PricingForm'

export default async function EditPricingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tier = await getPricingTierById(id)
  if (!tier) notFound()

  return (
    <div>
      <PageHeader title="編輯價格方案" description={`正在編輯「${tier.title}」。`} />
      <PricingForm
        tier={{
          id: tier.id,
          title: tier.title,
          subtitle: tier.subtitle,
          note: tier.note,
          applicableCourses: (tier.applicableCourses as CourseTag[]) ?? [],
          options: (tier.options as PricingOption[]) ?? [],
          published: tier.published,
        }}
      />
    </div>
  )
}
