import { PageHeader } from '@/components/admin/form'
import { getHeroVideoUrl } from '@/lib/queries'
import HeroForm from './HeroForm'

export default async function AdminHeroPage() {
  const videoUrl = (await getHeroVideoUrl()) ?? ''

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="首頁影片"
        description="管理首頁 Hero 區塊的影片。儲存後首頁即時更新。"
      />
      <HeroForm videoUrl={videoUrl} />
    </div>
  )
}
