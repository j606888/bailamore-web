// 八月課表的單一資料來源。新增/編輯 track、場次、月曆 highlight 只要改這裡。
// 目前完全寫死、未接後台；樣式確定後再接回 Prisma（見 src/lib/queries.ts）。
//
// 地址不寫在這裡：據點資料集中於 src/data/venues.ts，track 只存 venueSlug。

import type { VenueSlug } from '@/data/venues';

export type ThemeKey = 'tainanSun' | 'tainanTue' | 'kaohsiungThu';

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
  badge?: string; // 'NEW 新常態班'
  badgeNote?: string; // '每週二・正式課 7/21 起共五堂'
  slots: TimeSlot[];
  datesTitle: string; // '本期場次' / '場次'
  datesNote: string; // '共 6 堂・7月為最後 3 堂'
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
};

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> { theme（決定顏色）, label（城市/體驗小字）, trackId（錨點目標）}
  highlights: Record<number, { theme: ThemeKey; label: string; trackId: string }>;
  legend: { theme: ThemeKey; title: string; desc: string }[];
  footnote: string;
}

export const MONTH: MonthConfig = {
  year: 2026,
  month: 8,
  titleEn: 'AUGUST',
  titleZh: '八月',
  highlights: {
    4: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    6: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    9: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    11: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    13: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    18: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    20: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    23: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    25: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    27: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    30: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
  },
  legend: [
    {
      theme: 'tainanSun',
      title: '週日・台南教室',
      desc: 'Body movement / Bachata / Salsa · 14:00–18:00',
    },
    {
      theme: 'tainanTue',
      title: '週二・台南教室（新）',
      desc: 'Bachata 1-1 · 19:30–22:00',
    },
    {
      theme: 'kaohsiungThu',
      title: '週四・高雄教室',
      desc: 'Bachata / Kizomba · 19:30–23:00',
    },
  ],
  footnote: '★ 週日台南 9 月續開 9/13、9/20、9/27・週二台南第一期 8/18 結束、第二期 8/25 起',
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
    slots: [
      { time: '14:00–15:00', title: 'Body movement' },
      { time: '15:00–16:00', title: 'Bachata Lv2' },
      { time: '16:00–17:00', title: '單人 Salsa（By Nini）' },
      { time: '17:00–18:00', title: 'Pratica' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 6 堂・橫跨 8–9 月',
    dates: [
      { label: '8/9' },
      { label: '8/23' },
      { label: '8/30' },
      { label: '9/13' },
      { label: '9/20' },
      { label: '9/27' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・單堂 $350・6 堂 $2000',
  },
  {
    id: 'tainan-tue',
    theme: 'tainanTue',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'Bachata 1-2 第二期',
    badgeNote: '8/25 新一期 Bachata 1-1 開班',
    slots: [
      { time: '19:30–20:45', title: 'Bachata 1-1' },
      { time: '20:45–22:00', title: '課後練習 social' },
    ],
    datesTitle: '場次',
    datesNote: '第一期 7/21–8/18・第二期 8/25 起，完整場次近期公布',
    dates: [
      { label: '7/21', note: '第一堂' },
      { label: '7/28', note: '第二堂' },
      { label: '8/4', note: '第三堂' },
      { label: '8/11', note: '第四堂' },
      { label: '8/18', note: '第五堂' },
      { label: '8/25', note: '第二期 第一堂', upcoming: true },
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
    slots: [
      { time: '19:30–20:30', title: 'Kizomba LV1.5' },
      { time: '20:30–21:30', title: 'Bachata training' },
      { time: '21:30–23:00', title: 'mini social' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 4 堂・每週四',
    dates: [
      { label: '8/6' },
      { label: '8/13' },
      { label: '8/20' },
      { label: '8/27' },
    ],
    venueSlug: 'kaohsiung',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・單堂 $350・6 堂 $2000',
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
          { name: 'Kizomba LV1.5', theme: 'kaohsiungThu' },
          { name: 'Bachata training', theme: 'kaohsiungThu' },
        ],
        options: [
          { name: '單堂', price: 350 },
          { name: '6 堂課程', price: 2000 },
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
        subtitle: '7/21 起連續五堂',
        courses: [{ name: 'Bachata 1-1', theme: 'tainanTue' }],
        options: [
          { name: '整期五堂', price: 2000 },
          { name: '單堂報名', price: 450 },
        ],
      },
    ],
    note: '*新常態班為獨立方案，與課卡不通用。',
  },
];
