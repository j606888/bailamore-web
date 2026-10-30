'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getVenue, getVenuesByCity, type CitySlug } from '@/data/venues';
import MonthCarousel from './MonthCarousel';
import TrackCard from './TrackCard';
import UpcomingTrackCard from './UpcomingTrackCard';
import {
  getMonthForCity,
  getTracksByCity,
  MONTHS,
  THEMES,
  TRACKS,
  UPCOMING_TRACKS,
} from './data';

const CITIES: { slug: CitySlug; label: string }[] = [
  { slug: 'tainan', label: '台南教室' },
  { slug: 'kaohsiung', label: '高雄教室' },
];

function isCitySlug(value: string | null): value is CitySlug {
  return CITIES.some((c) => c.slug === value);
}

export default function ScheduleBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 課表先選城市（網址 ?city=tainan|kaohsiung），月曆、圖例、課卡 tab 都只顯示該城市。
  // 兩個城市的課卡都在 HTML 裡（非 active 的只是 CSS 藏起來），爬蟲讀得到。
  const cityFromUrl = searchParams.get('city');
  const [city, setCity] = useState<CitySlug>(
    isCitySlug(cityFromUrl) ? cityFromUrl : CITIES[0].slug
  );
  const cityTracks = useMemo(() => getTracksByCity(city), [city]);
  const cityMonths = useMemo(
    () => MONTHS.map((m) => getMonthForCity(m, city)),
    [city]
  );
  const cityVenues = getVenuesByCity(city);

  // 一個城市記一個目前展開的課卡：切回來時還停在剛剛看的那一張。
  const [activeByCity, setActiveByCity] = useState<Record<CitySlug, string>>({
    tainan: getTracksByCity('tainan')[0]?.id ?? '',
    kaohsiung: getTracksByCity('kaohsiung')[0]?.id ?? '',
  });
  const activeTrackId = activeByCity[city];

  // 要捲過去的卡片。切 tab 的當下卡片還是 hidden，scrollIntoView 會沒作用，
  // 所以先記下來，等 React commit（下面的 effect）之後再捲。
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const selectCity = useCallback(
    (next: CitySlug) => {
      setCity(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', 'schedule');
      params.set('city', next);
      router.replace(`/courses?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const selectTrack = useCallback((trackId: string, scroll = false) => {
    const track = TRACKS.find((t) => t.id === trackId);
    if (!track) return;
    const trackCity = getVenue(track.venueSlug).citySlug;
    setCity(trackCity);
    setActiveByCity((prev) => ({ ...prev, [trackCity]: trackId }));
    if (scroll) setPendingScrollId(trackId);
  }, []);

  useEffect(() => {
    if (!pendingScrollId) return;
    document
      .getElementById(pendingScrollId)
      ?.scrollIntoView({ behavior: 'auto', block: 'start' });
    setPendingScrollId(null);
  }, [pendingScrollId]);

  // 深連結 /courses?tab=schedule#<id>（首頁公告條、據點頁）：
  // 掛載後才讀 hash，避免 SSR/hydration 不一致；課卡在哪個城市就切到哪個城市。
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
        {/* 城市切換 */}
        <div className="flex flex-col gap-3">
          <div
            role="tablist"
            aria-label="城市"
            className="grid grid-cols-2 gap-1 rounded-full bg-gray-100 p-1"
          >
            {CITIES.map((c) => {
              const isActive = c.slug === city;
              return (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectCity(c.slug)}
                  className={cn(
                    'h-11 cursor-pointer rounded-full text-sm font-bold transition-colors md:text-base',
                    isActive
                      ? 'bg-[#2d3a5e] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 md:text-sm">
            <span aria-hidden>📍</span>
            <span>
              {cityVenues.map((v) => `${v.district}・${v.shortName}`).join('、')}
            </span>
            <span className="text-gray-300">·</span>
            <span>{cityTracks.map((t) => t.dayZh).join('・')}</span>
          </p>
        </div>

        <MonthCarousel
          months={cityMonths}
          onSelectTrack={(trackId) => selectTrack(trackId, true)}
        />

        <div className="flex flex-col gap-4">
          {/* 課表 tab：已經選了城市，tab 只標星期；顏色沿用各 track 的主題色，跟下方卡片對得起來 */}
          <div role="tablist" aria-label="課表" className="flex flex-wrap gap-2">
            {cityTracks.map((track) => {
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
                    'cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors md:text-base',
                    isActive
                      ? cn('text-white shadow-sm', THEMES[track.theme].accentBg)
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                  )}
                >
                  {track.dayZh}
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
