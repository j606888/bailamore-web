'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import MonthOverview from './MonthOverview';
import TrackCard from './TrackCard';
import UpcomingTrackCard from './UpcomingTrackCard';
import { THEMES, TRACKS, UPCOMING_TRACKS } from './data';

export default function ScheduleBoard() {
  // 三張課表卡改成 tab，一次只顯示一張（手機要滑很久才看得到最後一張）。
  // 非 active 的卡片是用 CSS 藏起來、不是 unmount，HTML 裡三張都在，爬蟲讀得到。
  const [activeTrackId, setActiveTrackId] = useState(TRACKS[0].id);
  // 要捲過去的卡片。切 tab 的當下卡片還是 hidden，scrollIntoView 會沒作用，
  // 所以先記下來，等 React commit（下面的 effect）之後再捲。
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const selectTrack = useCallback((trackId: string, scroll = false) => {
    setActiveTrackId(trackId);
    if (scroll) setPendingScrollId(trackId);
  }, []);

  useEffect(() => {
    if (!pendingScrollId) return;
    document
      .getElementById(pendingScrollId)
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
    setPendingScrollId(null);
  }, [pendingScrollId]);

  // 深連結 /courses?tab=schedule#<id>（首頁公告條、月曆錨點）：
  // 掛載後才讀 hash，避免 SSR/hydration 不一致。
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    if (TRACKS.some((t) => t.id === hash)) {
      selectTrack(hash, true);
    } else if (UPCOMING_TRACKS.some((t) => t.id === hash)) {
      // 預告卡永遠可見，不用切 tab
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [selectTrack]);

  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <MonthOverview onSelectTrack={(trackId) => selectTrack(trackId, true)} />

        <div className="flex flex-col gap-4">
          {/* 課表 tab：顏色沿用各 track 的主題色，跟下方卡片對得起來 */}
          <div role="tablist" aria-label="課表" className="flex flex-wrap gap-2">
            {TRACKS.map((track) => {
              const isActive = track.id === activeTrackId;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  id={`tab-${track.id}`}
                  aria-selected={isActive}
                  aria-controls={track.id}
                  onClick={() => selectTrack(track.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-bold transition-colors md:text-base',
                    isActive
                      ? cn('text-white shadow-sm', THEMES[track.theme].accentBg)
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                  )}
                >
                  {track.tabLabel}
                </button>
              );
            })}
          </div>

          {TRACKS.map((track) => (
            <div
              key={track.id}
              role="tabpanel"
              aria-labelledby={`tab-${track.id}`}
              className={cn(track.id !== activeTrackId && 'hidden')}
            >
              <TrackCard track={track} />
            </div>
          ))}
        </div>

        {/* 預告卡不進 tab，固定留在最下面 */}
        {UPCOMING_TRACKS.map((track) => (
          <UpcomingTrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
