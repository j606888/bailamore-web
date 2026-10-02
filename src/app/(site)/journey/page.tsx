import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import JourneyPlayer from '@/components/journey/JourneyPlayer';
import {
  CHAPTERS,
  JOURNEY_EVENTS,
  journeyDateLabel,
  journeyYear,
} from '@/data/journey';
import { breadcrumbJsonLd } from '@/lib/jsonLd';

// 兩年回顧：上半是播放器（手機限動／電腦投影模式），下半是伺服器端輸出的完整活動清單，
// 不跑 JS 的爬蟲也讀得到每一場；清單用 #slug 連回播放器跳到該場。

const DESCRIPTION =
  "Baila'more 從 2024 年 10 月台南的第一堂課，到 2026 年 10 月的二週年派對：練習會、派對、Workshop、小琉球與恆春的旅行，還有高雄教室開課，一場一場看我們一起跳過的兩年。";

export const metadata: Metadata = {
  title: '兩年回顧・從第一堂課到二週年',
  description: DESCRIPTION,
  alternates: { canonical: '/journey' },
  openGraph: {
    title: "兩年回顧・從第一堂課到二週年 | Baila'more",
    description: DESCRIPTION,
    url: '/journey',
  },
};

const YEARS = [...new Set(JOURNEY_EVENTS.map(journeyYear))];

export default function JourneyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '首頁', path: '/' },
          { name: '兩年回顧', path: '/journey' },
        ])}
      />
      <h1 className="sr-only">Baila&apos;more 兩年回顧</h1>
      <JourneyPlayer />

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="text-2xl font-black text-[#2d3a5e] md:text-3xl">
          全部 {JOURNEY_EVENTS.length} 場活動
        </h2>
        <p className="mt-2 text-gray-600">點任何一場，上面的播放器就從那裡開始播。</p>
        {YEARS.map((year) => (
          <div key={year} className="mt-8">
            <h3 className="flex items-baseline gap-3 border-b border-gray-200 pb-2">
              <span className="font-poppins text-xl font-extrabold text-[#2d3a5e]">{year}</span>
              <span className="text-sm font-bold text-[#d4796e]">{CHAPTERS[year].title}</span>
            </h3>
            <ol className="divide-y divide-gray-100">
              {JOURNEY_EVENTS.filter((e) => journeyYear(e) === year).map((e) => (
                <li key={e.slug}>
                  <a
                    href={`#${e.slug}`}
                    className="flex min-h-12 items-center gap-4 py-3 text-[#2d3a5e] hover:text-teal-700"
                  >
                    <span className="w-24 flex-shrink-0 font-poppins text-sm text-gray-500">
                      {journeyDateLabel(e)}
                    </span>
                    <span className="font-medium">{e.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </>
  );
}
