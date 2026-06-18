import { PageHeader } from '@/components/admin/form'
import PricingForm from '../PricingForm'

export default function NewPricingPage() {
  return (
    <div>
      <PageHeader title="新增價格方案" description="填寫方案資料，儲存後即可在費用頁顯示。" />
      <PricingForm />
    </div>
  )
}
