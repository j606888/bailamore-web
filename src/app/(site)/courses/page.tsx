import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';
// 課表（schedule）目前改用寫死資料（src/components/courses/schedule/data.ts），暫不接 DB。
// getSchedulePeriods() 仍保留在 src/lib/queries.ts，日後可重新接回。
import { getPublishedPricingTiers } from '@/lib/queries';
import type { PricingTierView } from '@/components/courses/Pricing';

// 課表內容由 DB 提供，存檔後以 revalidatePath('/courses') 即時更新。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: '課程資訊',
  description: '查看 Baila\'more 的課表、舞蹈風格介紹與課程費用。Bachata、Salsa 定期開課，歡迎報名。',
  openGraph: {
    title: "課程資訊 | Baila'more",
    description: "查看 Baila'more 的課表、舞蹈風格介紹與課程費用。Bachata、Salsa 定期開課，歡迎報名。",
    url: '/courses',
  },
};

export default async function CoursesPage() {
  const tiers = await getPublishedPricingTiers();

  const pricingData: PricingTierView[] = tiers.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    note: t.note,
    applicableCourses: t.applicableCourses as PricingTierView['applicableCourses'],
    options: t.options as PricingTierView['options'],
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesContent tiers={pricingData} />
    </Suspense>
  );
}
