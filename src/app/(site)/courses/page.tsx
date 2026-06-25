import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';

// 課表與費用目前皆改用寫死資料（src/components/courses/schedule/data.ts），暫不接 DB。
// getSchedulePeriods() / getPublishedPricingTiers() 仍保留在 src/lib/queries.ts，日後可重新接回。

export const metadata: Metadata = {
  title: '課程資訊',
  description: '查看 Baila\'more 的課表、舞蹈風格介紹與課程費用。Bachata、Salsa 定期開課，歡迎報名。',
  openGraph: {
    title: "課程資訊 | Baila'more",
    description: "查看 Baila'more 的課表、舞蹈風格介紹與課程費用。Bachata、Salsa 定期開課，歡迎報名。",
    url: '/courses',
  },
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
