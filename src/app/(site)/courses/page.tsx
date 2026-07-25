import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';

// 課表與費用目前皆改用寫死資料（src/components/courses/schedule/data.ts），暫不接 DB。
// getSchedulePeriods() / getPublishedPricingTiers() 仍保留在 src/lib/queries.ts，日後可重新接回。

const DESCRIPTION =
  "查看 Baila'more 的課表、舞蹈風格介紹與課程費用。台南（每週日、週二）與高雄（每週四）定期開設 Bachata、Salsa、Kizomba 課程，兩地共用同一張課卡。";

export const metadata: Metadata = {
  title: '課程資訊・台南與高雄課表',
  description: DESCRIPTION,
  alternates: { canonical: '/courses' },
  openGraph: {
    title: "課程資訊・台南與高雄課表 | Baila'more",
    description: DESCRIPTION,
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
