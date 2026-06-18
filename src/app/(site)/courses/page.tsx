import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';
import { getSchedulePeriods } from '@/lib/queries';
import type { SchedulePeriodView } from '@/components/courses/Schedule';

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
  const periods = await getSchedulePeriods();
  const scheduleData: SchedulePeriodView[] = periods.map((p) => ({
    id: p.id,
    date: p.date.toISOString(),
    courses: p.courses.map((c) => ({
      startTime: c.startTime,
      endTime: c.endTime,
      name: c.name,
      cardType: c.cardType,
    })),
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesContent periods={scheduleData} />
    </Suspense>
  );
}
