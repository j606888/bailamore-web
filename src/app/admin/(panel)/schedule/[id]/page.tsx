import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/form'
import { getSchedulePeriod } from '@/lib/queries'
import { toDateInputValue, formatDateDisplay } from '@/lib/date'
import PeriodEditor from '../PeriodEditor'

export default async function EditPeriodPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const period = await getSchedulePeriod(id)
  if (!period) notFound()

  return (
    <div>
      <PageHeader title="編輯課表" description={formatDateDisplay(period.date)} />
      <PeriodEditor
        id={period.id}
        date={toDateInputValue(period.date)}
        slots={period.courses.map((c) => ({
          startTime: c.startTime,
          endTime: c.endTime,
          name: c.name,
          cardType: c.cardType ?? '',
        }))}
      />
    </div>
  )
}
