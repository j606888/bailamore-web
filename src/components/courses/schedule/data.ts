// 九月課表的單一資料來源。新增/編輯 track、場次、月曆 highlight 只要改這裡。
// 目前完全寫死、未接後台；樣式確定後再接回 Prisma（見 src/lib/queries.ts）。
//
// 地址不寫在這裡：據點資料集中於 src/data/venues.ts，track 只存 venueSlug。

import type { VenueSlug } from '@/data/venues';

export type ThemeKey = 'tainanSun' | 'tainanTue' | 'kaohsiungThu' | 'party';

export type SessionStatus = 'done' | 'active' | 'upcoming';

export interface TimeSlot {
  time: string; // "14:00–15:00"
  title: string; // "Bachata 進階"
}

export interface SessionDate {
  label: string; // "7/5"
  note?: string; // "體驗課" / "正式 1"
  upcoming?: boolean; // 下一期（尚未開放/預告）場次，顯示為淡色
}

// 場次是否已結束由「真實日期」決定，不寫死。
// label 只有月/日，年份一律取 MONTH.year（目前課表不跨年）。
export function getSessionStatus(
  date: SessionDate,
  now: Date = new Date()
): SessionStatus {
  if (date.upcoming) return 'upcoming';

  const [month, day] = date.label.split('/').map(Number);
  if (!month || !day) return 'active';

  const sessionDay = new Date(MONTH.year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 當天仍算進行中，隔天才標記為已結束
  return sessionDay < today ? 'done' : 'active';
}

export interface Track {
  id: string; // 錨點 id，例如 'tainan-sun'
  theme: ThemeKey;
  cityEn: string; // 'TAINAN'
  cityZh: string; // '台南教室'
  sessionLabelEn: string; // 'SUNDAY' （圓章顯示 SUNDAY / SESSIONS）
  dayZh: string; // '週日'
  tabLabel: string; // 課表 tab 上的短標籤，例如 '週日・台南'（與 PRICE_PLANS 的 chip 用字一致）
  badge?: string; // 'NEW 新常態班'
  badgeNote?: string; // '每週二・正式課 7/21 起共五堂'
  slots: TimeSlot[];
  datesTitle: string; // '本期場次' / '場次'
  datesNote?: string; // '9/15 停課'（沒有補充就不顯示）
  dates: SessionDate[];
  venueSlug: VenueSlug; // 對應 src/data/venues.ts 的據點
  pricePlanId: string; // 對應 PRICE_PLANS 的 id
  priceSummary: string; // 課表卡上顯示的一行費用摘要（各 track 金額不同）
}

// 每個 theme 對應一組完整字面 Tailwind class（讓 v4 JIT 掃得到），集中於此方便調色。
export interface ThemeStyle {
  pageFrom: string; // track 卡背景
  accentText: string; // 時間 / 重點文字色
  accentBg: string; // 圓章 / active chip 底色
  highlightCell: string; // 月曆 highlight 方塊底色
  legendDot: string; // 圖例圓點
  blob: string; // 卡片裝飾色塊
}

export const THEMES: Record<ThemeKey, ThemeStyle> = {
  tainanSun: {
    pageFrom: 'bg-[#f5e7d8]',
    accentText: 'text-[#d4796e]',
    accentBg: 'bg-[#d4796e]',
    highlightCell: 'bg-[#d98b82]',
    legendDot: 'bg-[#d98b82]',
    blob: 'bg-[#c9bfe0]',
  },
  tainanTue: {
    pageFrom: 'bg-[#f7ead4]',
    accentText: 'text-[#d28e2a]',
    accentBg: 'bg-[#e0a23c]',
    highlightCell: 'bg-[#e0a23c]',
    legendDot: 'bg-[#e0a23c]',
    blob: 'bg-[#f0c878]',
  },
  kaohsiungThu: {
    pageFrom: 'bg-[#cfe0f5]',
    accentText: 'text-[#4d7fc4]',
    accentBg: 'bg-[#5b8dd9]',
    highlightCell: 'bg-[#5b8dd9]',
    legendDot: 'bg-[#5b8dd9]',
    blob: 'bg-[#c7e36a]',
  },
  // 活動用（派對／體驗課），目前沒有對應的 track 卡片
  party: {
    pageFrom: 'bg-[#ece0f7]',
    accentText: 'text-[#8b5cd6]',
    accentBg: 'bg-[#8b5cd6]',
    highlightCell: 'bg-[#8b5cd6]',
    legendDot: 'bg-[#8b5cd6]',
    blob: 'bg-[#d6b8f0]',
  },
};

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> { theme（決定顏色）, label（城市/體驗小字）, trackId（錨點目標，活動類沒有卡片可省略）,
  //         cellBg（特殊場次可覆寫方塊底色，例如體驗課要比常態課深一階）}
  highlights: Record<
    number,
    { theme: ThemeKey; label: string; trackId?: string; cellBg?: string }
  >;
  legend: { theme: ThemeKey; title: string; desc: string }[];
  footnote?: string;
}

export const MONTH: MonthConfig = {
  year: 2026,
  month: 9,
  titleEn: 'SEPTEMBER',
  titleZh: '九月',
  highlights: {
    1: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    8: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    10: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    13: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    17: {
      theme: 'kaohsiungThu',
      label: '體驗課',
      trackId: 'kaohsiung-thu',
      cellBg: 'bg-[#3f6cbb]', // 體驗課：比常態的 #5b8dd9 深一階，一眼看得出不一樣
    },
    19: { theme: 'party', label: 'PARTY' },
    20: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    22: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    24: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    27: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    29: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
  },
  legend: [
    {
      theme: 'tainanSun',
      title: '週日・台南教室',
      desc: 'Body movement / Bachata Lv2 / Salsa · 14:00–18:00',
    },
    {
      theme: 'tainanTue',
      title: '週二・台南教室',
      desc: 'Bachata 1-2 / 1-1 · 19:30–23:00',
    },
    {
      theme: 'kaohsiungThu',
      title: '週四・高雄教室',
      desc: 'Kizomba / Bachata · 19:30–23:00（9/17 新手體驗課、9/24 Kizomba Lv1 新一期）',
    },
    {
      theme: 'party',
      title: '9/19（六）LEGENDS PARTY',
      desc: '當天另有 Salsa 體驗課',
    },
  ],
};

export const TRACKS: Track[] = [
  {
    id: 'tainan-sun',
    theme: 'tainanSun',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'SUNDAY',
    dayZh: '週日',
    badge: 'NEW Salsa 老師',
    badgeNote: '單人 Salsa 由 Nini 老師授課',
    tabLabel: '週日・台南',
    slots: [
      { time: '14:00–15:00', title: 'Body movement' },
      { time: '15:00–16:00', title: 'Bachata Lv2' },
      { time: '16:00–17:00', title: '單人 Salsa（By Nini）' },
      { time: '17:00–18:00', title: 'Pratica' },
    ],
    datesTitle: '本期場次',
    dates: [
      { label: '8/9', note: '第一堂' },
      { label: '8/23', note: '第二堂' },
      { label: '8/30', note: '第三堂' },
      { label: '9/13', note: '第四堂' },
      { label: '9/20', note: '第五堂' },
      { label: '9/27', note: '第六堂' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・6 堂 $2000・單堂 $350',
  },
  {
    id: 'tainan-tue',
    theme: 'tainanTue',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'Bachata 1-1・1-2 開課中',
    badgeNote: '本期 8/25–9/29 共五堂，9/29 結束',
    tabLabel: '週二・台南',
    slots: [
      { time: '19:30–20:45', title: 'Bachata 1-2' },
      { time: '21:00–22:15', title: 'Bachata 1-1' },
      { time: '22:15–23:00', title: '練習時間' },
    ],
    datesTitle: '本期場次',
    datesNote: '9/15 停課',
    dates: [
      { label: '8/25', note: '第一堂' },
      { label: '9/1', note: '第二堂' },
      { label: '9/8', note: '第三堂' },
      { label: '9/22', note: '第四堂' },
      { label: '9/29', note: '第五堂' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'tuesday-plan',
    priceSummary: '整期五堂 $2000・單堂 $450',
  },
  {
    id: 'kaohsiung-thu',
    theme: 'kaohsiungThu',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    badge: 'Kizomba Lv1 新一期 9/24 開課',
    badgeNote: '9/17 先開新手體驗課，零基礎、沒有舞伴都可以來',
    tabLabel: '週四・高雄',
    slots: [
      { time: '19:30–20:30', title: 'Kizomba Lv1.5 → Lv1' },
      { time: '20:30–21:30', title: 'Bachata training' },
      { time: '21:30–23:00', title: 'mini social' },
    ],
    datesTitle: '九月場次',
    datesNote: '每週四常態開課・無期數限制，隨時可插班',
    dates: [
      { label: '9/10', note: 'Lv1.5 最後一堂' },
      { label: '9/17', note: '新手體驗課' },
      { label: '9/24', note: 'Lv1 第一堂' },
    ],
    venueSlug: 'kaohsiung',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・6 堂 $2000・單堂 $350',
  },
];

// ---- 籌備中的課程（預告用，還沒有日期／費用）----
// 課表頁尾的 COMING SOON 卡與首頁公告條共用同一份文字，改這裡兩邊會一起變。
// 真的開課後把內容搬進 TRACKS，並把這個陣列清空即可。

export interface UpcomingTrack {
  id: string; // 錨點 id
  theme: ThemeKey;
  cityEn: string;
  cityZh: string;
  sessionLabelEn: string;
  dayZh: string;
  courses: string[]; // 預計開的課程名稱
  note: string; // 卡片上的說明
  venueSlug: VenueSlug;
  bannerText: string; // 首頁公告條的一行字
}

export const UPCOMING_TRACKS: UpcomingTrack[] = [
  {
    id: 'kaohsiung-tue',
    theme: 'kaohsiungThu',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    courses: ['Bachata Lv1', 'Salsa Lv1'],
    note: '高雄週二的 Bachata、Salsa Lv1 新手班籌備中，開課時間與費用即將推出。想上的話先來訊告訴我們，開班時第一時間通知你。另外也正在籌備教師訓練計劃，歡迎一起詢問。',
    venueSlug: 'kaohsiung',
    bannerText: '高雄週二 Bachata・Salsa Lv1 新手班籌備中，教師訓練計劃同步規劃中',
  },
];

/** 取得某個據點的所有課程 track（據點頁用來列出該城市的課表）。 */
export function getTracksByVenue(slug: VenueSlug): Track[] {
  return TRACKS.filter((t) => t.venueSlug === slug);
}

// ---- 費用方案（與課表共用顏色，方便客人對應）----

export interface PriceOption {
  name: string; // '單堂體驗' / '整期五堂'
  price: number;
}

export interface PriceCourse {
  name: string; // 'Bachata Lv1'
  theme: ThemeKey; // 該課程所屬 track，決定 chip 顏色
}

export interface PriceTier {
  title: string; // 'Lv1 課程'
  subtitle?: string;
  courses: PriceCourse[]; // 適用課程（chip，依 track 上色）
  options: PriceOption[];
}

export interface PriceChip {
  label: string; // '週日・台南'
  theme: ThemeKey; // 決定 chip 顏色，與課表一致
}

export interface PricePlan {
  id: string; // 錨點 id，對應 Track.pricePlanId
  name: string; // '課卡方案'
  chips: PriceChip[]; // 適用的「週X・城市」
  tiers: PriceTier[];
  note?: string;
}

export const PRICE_PLANS: PricePlan[] = [
  {
    id: 'card-plan',
    name: '課卡方案',
    chips: [
      { label: '週日・台南', theme: 'tainanSun' },
      { label: '週四・高雄', theme: 'kaohsiungThu' },
    ],
    tiers: [
      {
        title: 'Lv2 統一課卡',
        subtitle: '單一課卡，適用所有課程',
        courses: [
          { name: 'Body movement', theme: 'tainanSun' },
          { name: 'Bachata Lv2', theme: 'tainanSun' },
          { name: '單人 Salsa', theme: 'tainanSun' },
          { name: 'Kizomba', theme: 'kaohsiungThu' },
          { name: 'Bachata training', theme: 'kaohsiungThu' },
        ],
        options: [
          { name: '6 堂課程', price: 2000 },
          { name: '單堂', price: 350 },
        ],
      },
    ],
    note: '*課卡一律 Lv2 統一價，可插班，未使用完畢可用於下一期；週日台南與週四高雄共用同一張課卡。',
  },
  {
    id: 'tuesday-plan',
    name: '週二・新常態班（台南）',
    chips: [{ label: '週二・台南', theme: 'tainanTue' }],
    tiers: [
      {
        title: '新常態班 5 堂',
        subtitle: '第二期 8/25–9/29 共五堂（9/15 停課）',
        courses: [
          { name: 'Bachata 1-2', theme: 'tainanTue' },
          { name: 'Bachata 1-1', theme: 'tainanTue' },
        ],
        options: [
          { name: '整期五堂', price: 2000 },
          { name: '單堂報名', price: 450 },
        ],
      },
    ],
    note: '*新常態班為獨立方案，與課卡不通用。',
  },
];
