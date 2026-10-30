import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVenue, venuePath } from '@/data/venues';
import { LINKS } from '@/constants/links';
import { THEMES, type EnrollEvent } from '@/components/courses/schedule/data';

// 報名頁的配色規則（跟課表卡刻意不同）：卡片一律白底，THEMES 的顏色只出現在
// 日期章上緣與舞種 chip 這種小面積，CTA 統一用品牌色 teal。
// 不要拿 theme.accentText 當正文色 —— #d4796e 壓白底只有約 3.3:1，小字看不清楚。

const KIND_LABEL: Record<EnrollEvent['kind'], string> = {
  trial: '體驗課',
  course: '新開課程',
  workshop: 'Workshop',
};

// anchorId：同一場活動也會出現在課表的課卡裡，那邊要換一個 id，避免整頁出現兩個 #<event.id>
// compact：放在課表課卡裡的版本，不重複印地點（課卡底部已經有）
export default function EventCard({
  event,
  anchorId = event.id,
  compact = false,
}: {
  event: EnrollEvent;
  anchorId?: string;
  compact?: boolean;
}) {
  // 表單還沒開、但先曝光的場次：按鈕改成私訊粉專
  const pending = !event.enrollUrl && Boolean(event.enrollPending);
  const theme = THEMES[event.theme];
  const venue = event.venueSlug ? getVenue(event.venueSlug) : null;

  // 地點・時間・費用用「・」串起來，沒填的欄位不留空位，全都沒填就整行不出現。
  const meta: ReactNode[] = [];
  if (compact) {
    // 不放地點
  } else if (venue) {
    meta.push(
      <Link
        key="venue"
        href={venuePath(venue)}
        className="font-medium text-teal-600 underline-offset-2 hover:underline"
      >
        {venue.city}
        {venue.district}・{venue.shortName}
      </Link>
    );
  } else if (event.externalVenue) {
    meta.push(
      <a
        key="venue"
        href={event.externalVenue.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-teal-600 underline-offset-2 hover:underline"
      >
        {event.externalVenue.name}
      </a>
    );
  }
  if (event.startTime) {
    meta.push(
      <span key="time">
        {event.startTime}
        {event.endTime ? `–${event.endTime}` : ' 開始'}
      </span>
    );
  }
  if (event.priceNote) meta.push(<span key="price">{event.priceNote}</span>);

  return (
    <article
      id={anchorId}
      className="flex scroll-mt-20 flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
    >
      {/* 手機：日期章與文字並排、按鈕自己一列。sm:contents 讓這層在桌機消失，變成三欄。 */}
      <div className="flex items-start gap-4 sm:contents">
        {/* 日期章：卡片上唯一帶舞種色的區塊 */}
        <div className="flex w-16 flex-shrink-0 flex-col overflow-hidden rounded-xl text-center shadow-sm ring-1 ring-gray-100">
          <div
            className={cn(
              'py-0.5 font-poppins text-[10px] font-bold tracking-widest text-white',
              theme.accentBg
            )}
          >
            {event.weekdayEn}
          </div>
          <div className="bg-gray-50 px-1 py-1.5">
            <div className="font-poppins text-lg font-bold leading-tight text-[#2d3a5e]">
              {event.dateLabel}
            </div>
            {event.endDateLabel && (
              <div className="font-poppins text-xs font-bold leading-tight text-gray-500">
                –{event.endDateLabel}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-grow flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {event.kindLabel ?? KIND_LABEL[event.kind]}
            </span>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold text-white',
                theme.accentBg
              )}
            >
              {event.danceStyle}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#2d3a5e] md:text-lg">
            {event.title}
          </h3>
          {meta.length > 0 && (
            <p className="text-sm text-gray-600">
              {meta.map((item, index) => (
                <Fragment key={index}>
                  {index > 0 && '・'}
                  {item}
                </Fragment>
              ))}
            </p>
          )}
          {event.alert && (
            <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-bold text-amber-900 ring-1 ring-amber-200">
              <CircleAlert className="mt-0.5 size-4 flex-shrink-0" aria-hidden />
              {event.alert}
            </p>
          )}
          {event.note && (
            <p className="text-sm leading-relaxed text-gray-500">{event.note}</p>
          )}
          {pending && (
            <p className="text-sm font-medium text-[#2d3a5e]">{event.enrollPending}</p>
          )}
        </div>
      </div>

      {/* 體驗課是這頁最想推的入口，用實心；新開課程與 Workshop 是次要選項，用描邊。 */}
      <Button
        asChild
        variant={event.kind === 'trial' ? 'default' : 'outline'}
        className="h-11 w-full flex-shrink-0 px-5 sm:w-auto"
      >
        <a
          href={pending ? LINKS.INSTAGRAM_DM : event.enrollUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pending ? '私訊預約' : '報名'}
          <ArrowRight className="size-4" />
        </a>
      </Button>
    </article>
  );
}
