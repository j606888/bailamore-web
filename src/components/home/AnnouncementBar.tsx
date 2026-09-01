import Link from 'next/link';
import { UPCOMING_TRACKS } from '@/components/courses/schedule/data';

// 首頁 Hero 下方的公告條：跟著頁面捲動，不是固定在最上面的全站 banner。
// 文字來源是課表的 UPCOMING_TRACKS，清空該陣列這條就會自動消失。
export default function AnnouncementBar() {
  const upcoming = UPCOMING_TRACKS[0];
  if (!upcoming) return null;

  return (
    <div className="px-5 pb-8 md:mx-auto md:max-w-7xl md:px-5">
      <Link
        href={`/courses?tab=schedule#${upcoming.id}`}
        className="flex flex-col gap-2 rounded-xl border-l-4 border-l-[#5b8dd9] bg-[#eef4fc] px-4 py-3 transition-colors hover:bg-[#e3edfa] sm:flex-row sm:items-center sm:gap-3"
      >
        <span className="w-fit flex-shrink-0 rounded-full bg-[#5b8dd9] px-2.5 py-1 font-poppins text-[10px] font-bold tracking-widest text-white md:text-xs">
          COMING SOON
        </span>
        <span className="text-sm text-[#2d3a5e] md:text-base">
          {upcoming.bannerText}
          <span className="ml-1 whitespace-nowrap font-medium text-[#4d7fc4]">
            看詳情 →
          </span>
        </span>
      </Link>
    </div>
  );
}
