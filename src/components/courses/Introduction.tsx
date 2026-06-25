'use client'

import React from 'react';

interface DanceTheme {
  pageBg: string;   // 卡片背景
  accentText: string; // 重點文字色（主題色）
  accentBg: string;   // badge / pill 底色
  chipText: string;   // chip 文字色
}

interface DanceStyle {
  id: string;
  nameEn: string;
  nameZh: string;
  origin: string;
  youtubeId: string;
  tagline: string;
  description: string[];
  traits: string[];
  beginnerFriendly?: boolean;
  theme: DanceTheme;
}

// 沿用課表/費用頁配色，讓整個課程區視覺一致。
// class 都寫成完整字面字串，讓 Tailwind v4 JIT 掃得到。
const THEMES: Record<'coral' | 'gold' | 'blue', DanceTheme> = {
  coral: {
    pageBg: 'bg-[#f5e7d8]',
    accentText: 'text-[#d4796e]',
    accentBg: 'bg-[#d4796e]',
    chipText: 'text-[#d4796e]',
  },
  gold: {
    pageBg: 'bg-[#f7ead4]',
    accentText: 'text-[#d28e2a]',
    accentBg: 'bg-[#e0a23c]',
    chipText: 'text-[#d28e2a]',
  },
  blue: {
    pageBg: 'bg-[#cfe0f5]',
    accentText: 'text-[#4d7fc4]',
    accentBg: 'bg-[#5b8dd9]',
    chipText: 'text-[#4d7fc4]',
  },
};

const DANCE_STYLES: DanceStyle[] = [
  {
    id: 'bachata',
    nameEn: 'BACHATA',
    nameZh: '巴恰塔',
    origin: '源自多明尼加共和國',
    youtubeId: 'j4CmXKDCMzI',
    tagline: '浪漫、感性，最容易上手的入門舞種',
    description: [
      'Bachata 以四拍節奏與細膩的臀部律動為特色，動作流暢、貼近音樂裡的浪漫情緒。最迷人的是兩人之間自然的牽引與連接——不需要華麗技巧，光是跟著音樂擺動就很有味道。',
      '因為節奏慢、步伐直覺，Bachata 是公認最好入門的拉丁社交舞。完全沒有舞蹈經驗也能在第一堂課就跳起來，這也是我們最推薦新手從這裡開始的原因。',
    ],
    traits: ['浪漫感性', '四拍節奏', '臀部律動', '親密牽引'],
    beginnerFriendly: true,
    theme: THEMES.coral,
  },
  {
    id: 'salsa',
    nameEn: 'SALSA',
    nameZh: '騷莎',
    origin: '源自古巴、波多黎各與紐約',
    youtubeId: 'Rybg4nkJa5Y',
    tagline: '熱情中帶著浪漫，紐約 On2 的細膩律動',
    description: [
      'Salsa 以八拍節奏為基礎，充滿旋轉、轉身與雙人花式，是最有活力、最受歡迎的拉丁社交舞之一。我們主跳 On2（紐約曼波）風格，節奏踩在第二拍上，律動更綿密、更有層次，熱情之中也能跳得很浪漫。',
      '除了雙人配合，Salsa 也有 Shine（個人秀步）的空間，讓你盡情展現節奏感與個人風格。學會之後，走到世界各地的舞會都能隨時邀舞。',
    ],
    traits: ['On2 紐約風', '熱情奔放', '大量旋轉', 'Shine 個人秀步'],
    theme: THEMES.gold,
  },
  {
    id: 'kizomba',
    nameEn: 'KIZOMBA',
    nameZh: '吉佐姆巴',
    origin: '源自非洲安哥拉',
    youtubeId: 'dm_TzKprOls',
    tagline: '緩慢、貼近，最講究雙人連接的療癒系舞蹈',
    description: [
      'Kizomba 節奏緩慢綿長，強調重心轉移與兩人之間細膩的身體溝通。沒有炫技的大動作，靠的是帶領與跟隨之間那份恰到好處的默契。',
      '它的氛圍浪漫而放鬆，跳起來像在音樂裡漫步。對想深入「連接」與「帶領跟隨」的舞者來說，Kizomba 是最耐人尋味的一種。',
    ],
    traits: ['緩慢綿長', '重心轉移', '細膩連接', '帶領跟隨'],
    theme: THEMES.blue,
  },
];

export default function Introduction() {
  return (
    <div className="bg-[#faf0e1]">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <div className="flex flex-col gap-3">
          <h2 className="font-poppins text-2xl font-bold text-[#2d3a5e] md:text-3xl">
            舞蹈風格介紹
          </h2>
          <p className="text-sm text-gray-600 md:text-base">
            我們開設 Bachata、Salsa、Kizomba 三種拉丁社交舞。先看看示範影片，感受一下每種舞在跳什麼，再挑一個最讓你心動的開始吧。
          </p>
          <div className="flex items-start gap-3 rounded-2xl border border-[#e8c9c3] bg-[#fbeae6] px-4 py-3.5">
            <span className="text-xl leading-none" aria-hidden>✨</span>
            <p className="text-sm text-[#2d3a5e] md:text-base">
              <strong>沒有任何舞蹈經驗？</strong>從 <strong className="text-[#d4796e]">Bachata</strong> 開始最容易上手——節奏慢、動作直覺，第一堂課就能跳起來。
            </p>
          </div>
        </div>

        {DANCE_STYLES.map((dance) => (
          <DanceCard key={dance.id} dance={dance} />
        ))}
      </div>
    </div>
  );
}

function DanceCard({ dance }: { dance: DanceStyle }) {
  const { theme } = dance;

  return (
    <section
      id={dance.id}
      className={`scroll-mt-20 overflow-hidden rounded-3xl p-5 shadow-sm md:p-8 ${theme.pageBg}`}
    >
      {/* 標頭 */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-poppins text-4xl font-bold md:text-6xl ${theme.accentText}`}
          style={{ textShadow: '3px 3px 0 rgba(45,58,94,0.18)' }}
        >
          {dance.nameEn}
        </span>
        <span className="mt-2 font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
          {dance.nameZh}
        </span>
        <span className="mt-1 text-sm text-gray-600">{dance.origin}</span>
      </div>

      {/* 新手入門 badge */}
      {dance.beginnerFriendly && (
        <div className="mt-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold text-white md:text-sm ${theme.accentBg}`}
          >
            ✨ 最適合新手入門
          </span>
        </div>
      )}

      {/* 影片 */}
      <div
        className="relative mt-5 w-full overflow-hidden rounded-2xl shadow-sm"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={`https://www.youtube.com/embed/${dance.youtubeId}`}
          title={`${dance.nameEn} demo`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* tagline + 介紹 */}
      <p className={`mt-5 font-poppins text-lg font-bold md:text-xl ${theme.accentText}`}>
        {dance.tagline}
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {dance.description.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-[#2d3a5e] md:text-base">
            {para}
          </p>
        ))}
      </div>

      {/* 風格特色 chips */}
      <div className="mt-5 flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500">風格特色</p>
        <div className="flex flex-wrap gap-1.5">
          {dance.traits.map((trait) => (
            <span
              key={trait}
              className={`rounded-full border border-current bg-white px-3 py-1 text-xs font-medium md:text-sm ${theme.chipText}`}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
