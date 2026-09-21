'use client';

import Link from 'next/link';
import { LINKS } from '@/constants/links';
import { useFeaturedEvent } from './useFeaturedEvent';

// Hero 標題上方的小膠囊：手機上公告條被影片推到很下面，這裡確保第一屏就看得到主打活動。
export default function FeaturedEventPill() {
  const featured = useFeaturedEvent();
  if (!featured) return null;

  return (
    <Link
      href={`${LINKS.ENROLL}#${featured.id}`}
      className="inline-flex items-center gap-2 rounded-full bg-teal-50 py-1 pl-1 pr-3 text-sm font-medium text-teal-700 ring-1 ring-teal-600/20 transition-colors hover:bg-teal-100/70"
    >
      <span className="rounded-full bg-teal-600 px-2 py-0.5 font-poppins text-xs font-bold text-white">
        {featured.dateLabel}
      </span>
      {featured.title}報名中 →
    </Link>
  );
}
