import type { Metadata } from 'next';
import { Suspense } from 'react';
import CoursesContent from './CoursesContent';

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
