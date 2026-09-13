'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import IGIcon from '@/components/icons/IGIcon';
import EventCard from './EventCard';
import { LINKS } from '@/constants/links';
import {
  getUpcomingEvents,
  type EventKind,
} from '@/components/courses/schedule/data';

// 這個元件是 'use client' 唯一的理由：頁面是預先產生的靜態 HTML，build 當下的日期會過期，
// 所以掛載後才用瀏覽器當下時間把辦完的場次藏起來。
// SSR 時一律印出全部場次（now 傳 epoch），靜態 HTML 因此是完整的 —— 不跑 JS 的爬蟲讀得到每一場活動。
// 也因此這裡不能用 useSearchParams（會讓整頁放棄預渲染）。

const EPOCH = new Date(0);

export default function EnrollBoard() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const upcoming = (kind: EventKind) => getUpcomingEvents(kind, now ?? EPOCH);
  const trials = upcoming('trial');
  const courses = upcoming('course');
  const workshops = upcoming('workshop');

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
      <p className="text-base text-gray-600 md:text-lg">
        第一次跳舞就從體驗課開始，想固定上課再選常態課程。表單都是線上填寫，
        零基礎、沒有舞伴都可以報名。
      </p>

      {/* 1. 體驗課：新朋友的入口，放最上面 */}
      <Section title="體驗課" hint="零基礎・不用舞伴・單堂就能來">
        {trials.length > 0 ? (
          trials.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <EmptyNote>
            下一期體驗課還在安排，追蹤{' '}
            <a
              href={LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-600 underline-offset-2 hover:underline"
            >
              Instagram
            </a>{' '}
            看最新公告。
          </EmptyNote>
        )}
      </Section>

      {/* 2. 常態課程：只列開放線上報名的期數，其他一律走私訊插班 */}
      <Section title="常態課程" hint="課卡制・隨時可插班">
        {courses.length > 0 ? (
          courses.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <EmptyNote>
            目前沒有開放線上報名的新一期課程。台南與高雄的常態課都可以隨時插班，
            直接私訊我們安排就好。
          </EmptyNote>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={LINKS.INSTAGRAM_DM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-hover md:text-base"
          >
            <IGIcon className="h-5 w-5" color="#ffffff" />
            IG 私訊詢問插班
          </a>
          <a
            href={LINKS.LINE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-teal-600 underline-offset-2 hover:underline md:text-base"
          >
            或用 LINE 詢問 →
          </a>
        </div>
      </Section>

      {/* 3. Workshop／派對：沒有排定的場次就整區不出現 */}
      {workshops.length > 0 && (
        <Section title="Workshop・Party" hint="客座與週年活動">
          {workshops.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Section>
      )}

      {/* 收尾提示 */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
        <MessageCircle className="mt-0.5 size-5 flex-shrink-0 text-teal-600" />
        <p className="text-sm leading-relaxed text-gray-600">
          Google 表單送出後會收到一封回覆信。其他問題（要不要帶舞伴、穿什麼鞋、課卡怎麼算）
          直接{' '}
          <a
            href={LINKS.INSTAGRAM_DM}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-600 underline-offset-2 hover:underline"
          >
            IG 私訊我們
          </a>
          ，或先看{' '}
          <Link
            href={LINKS.PRICING}
            className="font-medium text-teal-600 underline-offset-2 hover:underline"
          >
            課程費用
          </Link>
          。
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className="font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
          {title}
        </h2>
        {hint && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm leading-relaxed text-gray-500">
      {children}
    </p>
  );
}
