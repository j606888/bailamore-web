'use client';

import Link from 'next/link';
import { UPCOMING_TRACKS } from '@/components/courses/schedule/data';
import { LINKS } from '@/constants/links';
import { useFeaturedEvent } from './useFeaturedEvent';

// 首頁 Hero 下方的公告條：跟著頁面捲動，不是固定在最上面的全站 banner。
// 有主打活動（EVENTS 裡填了 bannerText 的場次）時推活動，辦完後自動換回
// UPCOMING_TRACKS 的預告；兩邊都沒有這條就消失。
export default function AnnouncementBar() {
  const featured = useFeaturedEvent();

  if (featured) {
    return (
      <Bar
        href={`${LINKS.ENROLL}#${featured.id}`}
        tag="報名中"
        text={featured.bannerText}
        cta="立即報名"
        className="border-l-teal-600 bg-teal-50 hover:bg-teal-100/70"
        tagClassName="bg-teal-600"
        textClassName="text-[#2d3a5e]"
        ctaClassName="text-teal-700"
      />
    );
  }

  const upcoming = UPCOMING_TRACKS[0];
  if (!upcoming) return null;

  return (
    <Bar
      href={`/courses?tab=schedule#${upcoming.id}`}
      tag="COMING SOON"
      text={upcoming.bannerText}
      cta="看詳情"
      className="border-l-[#5b8dd9] bg-[#eef4fc] hover:bg-[#e3edfa]"
      tagClassName="bg-[#5b8dd9]"
      textClassName="text-[#2d3a5e]"
      ctaClassName="text-[#4d7fc4]"
    />
  );
}

function Bar({
  href,
  tag,
  text,
  cta,
  className,
  tagClassName,
  textClassName,
  ctaClassName,
}: {
  href: string;
  tag: string;
  text?: string;
  cta: string;
  className: string;
  tagClassName: string;
  textClassName: string;
  ctaClassName: string;
}) {
  return (
    <div className="px-5 pb-8 md:mx-auto md:max-w-7xl md:px-5">
      <Link
        href={href}
        className={`flex flex-col gap-2 rounded-xl border-l-4 px-4 py-3 transition-colors sm:flex-row sm:items-center sm:gap-3 ${className}`}
      >
        <span
          className={`w-fit flex-shrink-0 rounded-full px-2.5 py-1 font-poppins text-[10px] font-bold tracking-widest text-white md:text-xs ${tagClassName}`}
        >
          {tag}
        </span>
        <span className={`text-sm md:text-base ${textClassName}`}>
          {text}
          <span className={`ml-1 whitespace-nowrap font-medium ${ctaClassName}`}>
            {cta} →
          </span>
        </span>
      </Link>
    </div>
  );
}
