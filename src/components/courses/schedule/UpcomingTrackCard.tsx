import Link from 'next/link';
import IGIcon from '@/components/icons/IGIcon';
import { cn } from '@/lib/utils';
import { getVenue } from '@/data/venues';
import { LINKS } from '@/constants/links';
import { THEMES, type UpcomingTrack } from './data';

// 籌備中課程的預告卡。刻意跟正式的 TrackCard 長得不一樣（虛線框、白底、沒有場次與費用），
// 讓客人一眼看出「這個還沒開始」。
export default function UpcomingTrackCard({ track }: { track: UpcomingTrack }) {
  const theme = THEMES[track.theme];
  const venue = getVenue(track.venueSlug);

  return (
    <section
      id={track.id}
      className={cn(
        'w-full scroll-mt-20 rounded-3xl border-2 border-dashed border-current bg-white p-5 md:p-8',
        theme.accentText
      )}
    >
      {/* 標頭：城市 + COMING SOON 圓章 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col leading-none">
          <span className="font-poppins text-3xl font-bold md:text-5xl">
            {track.cityEn}
          </span>
          <span className="mt-2 font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
            {track.cityZh}・{track.dayZh}
          </span>
        </div>
        <div
          className={cn(
            'flex aspect-square w-20 flex-col items-center justify-center rounded-full text-center text-white md:w-24',
            theme.accentBg
          )}
        >
          <span className="font-poppins text-xs font-bold italic leading-tight md:text-sm">
            COMING
          </span>
          <span className="font-poppins text-xs font-bold italic leading-tight md:text-sm">
            SOON
          </span>
        </div>
      </div>

      {/* 預計開的課 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {track.courses.map((course) => (
          <span
            key={course}
            className="rounded-full border border-current px-3 py-1 text-sm font-medium md:text-base"
          >
            {course}
          </span>
        ))}
      </div>

      {/* 說明 */}
      <p className="mt-4 text-sm leading-relaxed text-[#2d3a5e] md:text-base">
        {track.note}
      </p>

      {/* 詢問 CTA */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={LINKS.INSTAGRAM_DM}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white md:text-base',
            theme.accentBg
          )}
        >
          <IGIcon className="h-5 w-5" color="#ffffff" />
          IG 私訊詢問
        </a>
        <a
          href={LINKS.LINE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline-offset-2 hover:underline md:text-base"
        >
          或用 LINE 詢問 →
        </a>
      </div>

      {/* 地點 */}
      <div className="mt-4 flex items-start gap-1.5 text-sm text-[#2d3a5e] md:text-base">
        <span aria-hidden>📍</span>
        <Link
          href={`/location/${venue.slug}`}
          className="font-medium underline-offset-2 hover:underline"
        >
          {venue.addressFull}（{venue.shortName}）
          <span className={cn('ml-1 whitespace-nowrap', theme.accentText)}>
            看地圖 →
          </span>
        </Link>
      </div>
    </section>
  );
}
