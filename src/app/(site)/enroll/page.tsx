import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import SectionHeading from '@/components/SectionHeading';
import EnrollBoard from '@/components/enroll/EnrollBoard';
import { EVENTS } from '@/components/courses/schedule/data';
import {
  breadcrumbJsonLd,
  eventJsonLd,
  type JsonLd as JsonLdData,
} from '@/lib/jsonLd';

// 報名頁。這一頁取代 Instagram bio 的連結面板，IG bio 請指向這裡。
// 資料全部來自 src/components/courses/schedule/data.ts 的 EVENTS。
// 這頁刻意「只做報名」—— 課表、費用、風格介紹留在 /courses，不要在這裡重複。

const DESCRIPTION =
  "Baila'more 台南與高雄的拉丁舞課程報名：Bachata、Salsa、Kizomba 體驗課與常態課程，另有客座 Workshop 與派對活動。零基礎、沒有舞伴都可以報名，線上填表即可。";

export const metadata: Metadata = {
  title: '課程報名・台南與高雄體驗課與課程表單',
  description: DESCRIPTION,
  alternates: { canonical: '/enroll' },
  openGraph: {
    title: "課程報名・台南與高雄體驗課與課程表單 | Baila'more",
    description: DESCRIPTION,
    url: '/enroll',
  },
};

export default function EnrollPage() {
  // 沒有地點或還沒開放報名的活動不會產生 Event 結構化資料（eventJsonLd 回傳 null）
  const events = EVENTS.map(eventJsonLd).filter(
    (data): data is JsonLdData => data !== null
  );

  return (
    <>
      <JsonLd
        data={[
          ...events,
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '課程報名', path: '/enroll' },
          ]),
        ]}
      />
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 md:px-6">
        <SectionHeading
          as="h1"
          size="lg"
          eyebrow="體驗課・課程・活動"
          title="課程報名"
          subtitle="現在開放報名的場次都在這裡，選一個直接填表就好。"
        />
      </div>
      <EnrollBoard />
    </>
  );
}
