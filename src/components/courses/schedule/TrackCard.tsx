import { cn } from '@/lib/utils';
import { THEMES, type Track } from './data';

export default function TrackCard({ track }: { track: Track }) {
  const theme = THEMES[track.theme];
  const weekdayEn = track.sessionLabelEn.slice(0, 3);

  return (
    <section
      id={track.id}
      className={cn(
        'relative w-full scroll-mt-20 overflow-hidden rounded-3xl p-5 shadow-sm md:p-8',
        theme.pageFrom
      )}
    >
      {/* 裝飾色塊 */}
      <span
        className={cn(
          'pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-[40%] opacity-30',
          theme.blob
        )}
        aria-hidden
      />

      {/* 標頭：城市 + 圓章 */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-col leading-none">
          <span
            className={cn('font-poppins text-4xl font-bold md:text-6xl', theme.accentText)}
            style={{ textShadow: '3px 3px 0 rgba(45,58,94,0.18)' }}
          >
            {track.cityEn}
          </span>
          <span className="mt-2 font-poppins text-2xl font-bold text-[#2d3a5e] md:text-3xl">
            {track.cityZh}
          </span>
        </div>
        <div
          className={cn(
            'flex aspect-square w-20 flex-col items-center justify-center rounded-full text-center text-white md:w-28',
            theme.accentBg
          )}
        >
          <span className="font-poppins text-xs font-bold italic leading-tight md:text-base">
            {track.sessionLabelEn}
          </span>
          <span className="font-poppins text-[10px] font-semibold italic leading-tight opacity-90 md:text-xs">
            SESSIONS
          </span>
        </div>
      </div>

      {/* NEW badge */}
      {track.badge && (
        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm',
              theme.accentBg
            )}
          >
            {track.badge}
          </span>
          {track.badgeNote && (
            <span className="text-xs font-medium text-gray-600 md:text-sm">
              {track.badgeNote}
            </span>
          )}
        </div>
      )}

      {/* 時段 */}
      <div className="relative mt-5 flex flex-col gap-2.5 md:gap-3">
        {track.slots.map((slot) => (
          <div
            key={slot.time}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm md:gap-5 md:px-6 md:py-4"
          >
            <span
              className={cn(
                'font-poppins text-base font-bold tabular-nums md:text-xl',
                theme.accentText
              )}
            >
              {slot.time}
            </span>
            <span className="text-base font-medium text-[#2d3a5e] md:text-xl">
              {slot.title}
            </span>
          </div>
        ))}
      </div>

      {/* 場次 strip */}
      <div className="relative mt-6">
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-[#2d3a5e]">{track.datesTitle}</p>
          <p className="text-xs text-gray-500 md:text-sm">{track.datesNote}</p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {track.dates.map((d) => (
            <DateChip
              key={d.label}
              date={d}
              weekdayEn={weekdayEn}
              accentBg={theme.accentBg}
            />
          ))}
        </div>
      </div>

      {/* 費用摘要 */}
      <div className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/70 px-4 py-3">
        <span className={cn('font-bold', theme.accentText)}>
          💲 {track.priceSummary}
        </span>
        <a
          href={`/courses?tab=pricing#${track.pricePlanId}`}
          className={cn(
            'text-sm font-medium underline-offset-2 hover:underline',
            theme.accentText
          )}
        >
          查看費用 →
        </a>
      </div>

      {/* 地點 */}
      <div className="relative mt-4 flex items-start gap-1.5 text-sm text-[#2d3a5e] md:text-base">
        <span aria-hidden>📍</span>
        <span className="font-medium">{track.location}</span>
      </div>
    </section>
  );
}

function DateChip({
  date,
  weekdayEn,
  accentBg,
}: {
  date: Track['dates'][number];
  weekdayEn: string;
  accentBg: string;
}) {
  const isDone = date.status === 'done';
  const isUpcoming = date.status === 'upcoming';
  const bar = isDone || isUpcoming ? 'bg-gray-300' : accentBg;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl text-center shadow-sm',
        (isDone || isUpcoming) && 'opacity-70'
      )}
    >
      <div
        className={cn(
          'py-0.5 font-poppins text-[10px] font-bold tracking-widest text-white md:text-xs',
          bar
        )}
      >
        {weekdayEn}
      </div>
      <div className="flex flex-col bg-white px-1 py-2">
        <span
          className={cn(
            'font-poppins text-base font-bold leading-tight text-[#2d3a5e] md:text-lg',
            isDone && 'text-gray-400 line-through'
          )}
        >
          {date.label}
        </span>
        {date.note && (
          <span className="mt-0.5 text-[10px] leading-tight text-gray-500 md:text-xs">
            {date.note}
          </span>
        )}
      </div>
    </div>
  );
}
