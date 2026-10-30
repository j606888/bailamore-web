'use client';

import { THEMES, type MonthView } from './data';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// 品牌抬頭（BAILA'MORE / 2026 SCHEDULE）不在這裡，它固定在 MonthCarousel 上方、不隨月份切換。
// config 是已經依城市過濾過的 MonthView（見 data.ts 的 getMonthForCity），一天最多一個 highlight。
// onSelectTrack：由 ScheduleBoard 傳入，讓月曆格子改成「切到該課表 tab 再捲過去」。
// 沒帶這個 prop 時（或 JS 還沒載入）維持原本的 #anchor 連結行為。
export default function MonthOverview({
  config,
  onSelectTrack,
}: {
  config: MonthView;
  onSelectTrack?: (trackId: string) => void;
}) {
  const { year, month, titleEn, titleZh, highlights, legend } = config;

  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = 週日
  const daysInMonth = new Date(year, month, 0).getDate();

  // 前置空白 + 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="w-full">
      {/* 頁首 */}
      <h2 className="flex items-end gap-2 font-poppins font-bold leading-none text-[#2d3a5e]">
        {/* clamp：NOVEMBER / SEPTEMBER 用固定 60px 在 390px 寬的手機會撐出水平捲動 */}
        <span
          className="text-[clamp(2.25rem,11.5vw,3.75rem)] md:text-7xl"
          style={{ textShadow: '3px 3px 0 rgba(212,121,110,0.45)' }}
        >
          {titleEn}
        </span>
        <span className="pb-1 text-2xl md:text-3xl">{titleZh}</span>
      </h2>

      {/* 月曆 */}
      {/* ring-inset：這張卡在輪播裡的寬度等於捲動容器寬度，
          外擴的 ring 會被 overflow 裁掉（左右兩側的線會不見），所以畫在框內。 */}
      <div className="mt-5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-inset ring-gray-200 md:p-5">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`pb-1 text-center text-sm font-semibold md:text-base ${
                i === 0 ? 'text-[#d4796e]' : 'text-gray-400'
              }`}
            >
              {w}
            </div>
          ))}

          {cells.map((day, idx) => {
            if (day === null) return <div key={`b-${idx}`} />;
            const hl = highlights[day];
            if (!hl) {
              return (
                <div
                  key={day}
                  className="flex aspect-square items-center justify-center text-sm text-gray-400 md:text-base"
                >
                  {day}
                </div>
              );
            }
            const theme = THEMES[hl.theme];
            const cellClass = `flex aspect-square flex-col items-center justify-center rounded-xl text-white shadow-sm ${hl.cellBg ?? theme.highlightCell}`;
            const content = (
              <>
                <span className="text-base font-bold leading-tight md:text-xl">
                  {day}
                </span>
                {/* 課表已依城市切換，常態課不用再標城市；只有活動類（PARTY）或特殊場次（★）才有小字 */}
                {hl.label && (
                  <span className="text-center text-[10px] leading-tight md:text-xs">
                    {hl.label}
                  </span>
                )}
              </>
            );
            // 活動（派對等）沒有對應的 track 卡片，就不做成錨點連結
            if (!hl.trackId) {
              return (
                <div key={day} className={cellClass}>
                  {content}
                </div>
              );
            }
            const trackId = hl.trackId;
            return (
              <a
                key={day}
                href={`#${trackId}`}
                className={`${cellClass} transition-transform hover:scale-[1.04]`}
                onClick={
                  onSelectTrack
                    ? (e) => {
                        e.preventDefault();
                        onSelectTrack(trackId);
                      }
                    : undefined
                }
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>

      {/* 圖例 */}
      <div className="mt-5 flex flex-col gap-2.5">
        {legend.map((item) => {
          const theme = THEMES[item.theme];
          return (
            <div key={item.title} className="flex items-center gap-2.5">
              <span
                className={`h-3.5 w-3.5 flex-shrink-0 rounded-full ${theme.legendDot}`}
              />
              <p className="text-sm md:text-base">
                <span className="font-bold text-gray-800">{item.title}</span>
                <span className="ml-2 text-gray-500">{item.desc}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
