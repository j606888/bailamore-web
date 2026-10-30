'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MonthOverview from './MonthOverview';
import type { MonthView } from './data';

/**
 * 月曆輪播：一次看一個月，用上方的月份分頁或手指滑動切換。
 *
 * 兩個月都留在 DOM（不是只 render 當前月份），這樣兩個月的課程資訊都會進
 * SSR 出來的靜態 HTML，搜尋引擎抓得到；切換只是把 scroll 位置移過去。
 * 移植自 hustlehustlekhs 的同名元件。刻意不做自動輪播 —— 課表要停在使用者正在看的那個月。
 */
export default function MonthCarousel({
  months,
  onSelectTrack,
}: {
  months: MonthView[];
  onSelectTrack?: (trackId: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 一頁的捲動距離直接從 DOM 量（第二頁的左緣減第一頁的左緣），
  // 不假設它等於 clientWidth，之後 track 若加上內距也不會算錯。
  const getStep = () => {
    const scroller = scrollerRef.current;
    const first = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !first) return 0;
    const second = first.nextElementSibling as HTMLElement | null;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  };

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = getStep();
    if (step <= 0) return;
    const index = Math.min(
      Math.round(scroller.scrollLeft / step),
      months.length - 1
    );
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, [months.length]);

  // 捲動事件用 rAF 節流，避免每一幀都 setState
  const handleScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      syncScrollState();
    });
  };

  useEffect(() => {
    window.addEventListener('resize', syncScrollState);
    return () => {
      window.removeEventListener('resize', syncScrollState);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [syncScrollState]);

  // 寬度變了（轉向、網址列收合、字型載入後重排）就把捲動位置對回目前的月份。
  // scrollLeft 是 px，寬度一變舊的 px 會落在兩個月中間；Safari 不一定會自己重新 snap。
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === 'undefined') return;
    let lastWidth = scroller.clientWidth;
    const observer = new ResizeObserver(() => {
      if (scroller.clientWidth === lastWidth) return;
      lastWidth = scroller.clientWidth;
      scroller.scrollTo({ left: activeIndexRef.current * getStep(), behavior: 'instant' });
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  // 預設停在「今天之後第一個還有課的月份」：10/30 時十月已經沒課了，就直接看十一月。
  // 預渲染的 HTML 一律從第一個月開始（build 當下的日期會過期，不能寫進 HTML，
  // 跟 TrackCard 用 useEffect 重算「已結束」場次是同一個理由），掛載後才用瀏覽器當下日期跳過去。
  // 依賴用「有哪幾個月」的字串而不是 months 陣列本身：切換城市會換一份新陣列，
  // 但使用者正在看的月份要留著，不能跳回預設月。
  const monthKeys = months.map((m) => `${m.year}-${m.month}`).join(',');
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = firstUpcomingMonth(months, new Date());
    if (index <= 0) return;
    scroller.scrollTo({ left: index * getStep(), behavior: 'instant' });
    setActiveIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeys]);

  // 按月份分頁時：先關掉 scroll-snap 再平滑捲動，捲完才打開。
  // iOS Safari 在 snap-mandatory 容器上做程式捲動，常常停在兩個月中間（畫面被截成兩半）。
  const snapTimerRef = useRef<number | null>(null);
  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = index * getStep();
    scroller.style.scrollSnapType = 'none';
    scroller.scrollTo({ left, behavior: 'smooth' });
    setActiveIndex(index);

    const restore = () => {
      if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
      scroller.removeEventListener('scrollend', restore);
      // 平滑捲動被打斷時直接落到正確位置，再把 snap 交回 CSS
      if (Math.abs(scroller.scrollLeft - left) > 1) {
        scroller.scrollTo({ left, behavior: 'instant' });
      }
      scroller.style.scrollSnapType = '';
    };
    scroller.addEventListener('scrollend', restore, { once: true });
    // 不支援 scrollend 的瀏覽器（Safari 18.2 以前）靠計時器收尾
    if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current);
    snapTimerRef.current = window.setTimeout(restore, 700);
  };

  const showControls = months.length > 1;

  return (
    <section className="w-full">
      {/* 品牌抬頭與月份分頁同一列：抬頭靠左、分頁靠右，省一截高度；塞不下時分頁換到下一行 */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex flex-col">
          <p className="font-poppins text-sm font-bold tracking-[0.2em] text-[#c47b5a] md:text-base">
            BAILA&apos;MORE
          </p>
          <p className="font-poppins text-xs font-medium tracking-[0.3em] text-gray-500 md:text-sm">
            {months[0]?.year} SCHEDULE
          </p>
        </div>

        {/* 月份分頁：把有哪幾個月直接攤開來，不用點也知道還有下個月可以看
            （之前只有兩顆箭頭，掃過去看不出來那是切換月份用的）。
            月份多到四、五個時這一列會塞不下，那時要改成可橫捲的月份列。 */}
        {showControls && (
          <div className="flex w-fit gap-1 rounded-full bg-gray-100 p-1">
            {months.map((month, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${month.year}-${month.month}`}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`看${month.titleZh}課表`}
                aria-current={active}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm transition ${
                  active
                    ? 'bg-[#2d3a5e] font-semibold text-white'
                    : 'font-medium text-gray-500 hover:text-gray-700'
                }`}
              >
                {month.titleZh}
              </button>
            );
          })}
          </div>
        )}
      </div>

      {/* 一頁一個月：原生 scroll-snap，手機用手指滑、桌機用月份分頁或觸控板。
          slide 寬度剛好等於捲動容器寬度，所以畫在元素框「外面」的外框會被 overflow 裁掉 ——
          月曆卡片因此用 ring-inset（見 MonthOverview），把外框畫進框內。
          這裡不留左右內距，否則內距那一段會透出隔壁月份的內容。 */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="mt-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {months.map((month) => (
          <div
            key={`${month.year}-${month.month}`}
            className="w-full min-w-0 shrink-0 snap-start snap-always"
          >
            <MonthOverview config={month} onSelectTrack={onSelectTrack} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** 今天（含）之後第一個還有課的月份；都沒有就回最後一個月。 */
function firstUpcomingMonth(months: MonthView[], now: Date): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const index = months.findIndex((m) =>
    Object.keys(m.highlights).some(
      (day) => new Date(m.year, m.month - 1, Number(day)) >= today
    )
  );
  return index === -1 ? months.length - 1 : index;
}
