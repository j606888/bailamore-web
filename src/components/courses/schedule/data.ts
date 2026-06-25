// 七月課表的單一資料來源。新增/編輯 track、場次、月曆 highlight 只要改這裡。
// 目前完全寫死、未接後台；樣式確定後再接回 Prisma（見 src/lib/queries.ts）。

export type ThemeKey = 'tainanSun' | 'tainanTue' | 'kaohsiungThu';

export type SessionStatus = 'done' | 'active' | 'upcoming';

export interface TimeSlot {
  time: string; // "14:00–15:00"
  title: string; // "Bachata 進階"
}

export interface SessionDate {
  label: string; // "7/5"
  status: SessionStatus;
  note?: string; // "體驗課" / "正式 1" / "已結束"
}

export interface Track {
  id: string; // 錨點 id，例如 'tainan-sun'
  theme: ThemeKey;
  cityEn: string; // 'TAINAN'
  cityZh: string; // '臺南教室'
  sessionLabelEn: string; // 'SUNDAY' （圓章顯示 SUNDAY / SESSIONS）
  dayZh: string; // '週日'
  badge?: string; // 'NEW 新常態班'
  badgeNote?: string; // '每週二・正式課 7/21 起共五堂'
  slots: TimeSlot[];
  datesTitle: string; // '本期場次' / '場次'
  datesNote: string; // '共 6 堂・7月為最後 3 堂'
  dates: SessionDate[];
  location: string;
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

const TAINAN_LOCATION = '臺南市中西區民族路二段57巷5號（萬昌起義對面・丁宅45號）';
const KAOHSIUNG_LOCATION = '高雄市三民區大昌二路67號 3樓之2（social hub）';

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
  month: 7,
  titleEn: 'JULY',
  titleZh: '七月',
  highlights: {
    2: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    5: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    7: { theme: 'tainanTue', label: '體驗', trackId: 'tainan-tue' },
    9: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    16: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    19: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    21: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
    26: { theme: 'tainanSun', label: '台南', trackId: 'tainan-sun' },
    28: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
  },
  legend: [
    {
      theme: 'tainanSun',
      title: '週日・台南教室',
      desc: 'Bachata / Salsa · 14:00–18:00',
    },
    {
      theme: 'tainanTue',
      title: '週二・台南教室（新）',
      desc: 'Bachata LV1 · 19:30–22:00',
    },
    {
      theme: 'kaohsiungThu',
      title: '週四・高雄教室',
      desc: 'Bachata / Kizomba · 19:30–23:00',
    },
  ],
  footnote: '★ 7/7 為 Bachata 體驗課・週二正式課程 7/21 起共五堂（至 8/18）',
};

export const TRACKS: Track[] = [
  {
    id: 'tainan-sun',
    theme: 'tainanSun',
    cityEn: 'TAINAN',
    cityZh: '臺南教室',
    sessionLabelEn: 'SUNDAY',
    dayZh: '週日',
    slots: [
      { time: '14:00–15:00', title: 'Bachata 進階' },
      { time: '15:00–16:00', title: 'Bachata LV1' },
      { time: '16:00–17:00', title: 'Bachata LV2' },
      { time: '17:00–18:00', title: 'Salsa LV1' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 6 堂・7 月為最後 3 堂',
    dates: [
      { label: '6/7', status: 'done', note: '已結束' },
      { label: '6/14', status: 'done', note: '已結束' },
      { label: '6/28', status: 'done', note: '已結束' },
      { label: '7/5', status: 'active' },
      { label: '7/19', status: 'active' },
      { label: '7/26', status: 'active' },
    ],
    location: TAINAN_LOCATION,
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・單堂 $300 起',
  },
  {
    id: 'tainan-tue',
    theme: 'tainanTue',
    cityEn: 'TAINAN',
    cityZh: '臺南教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'NEW 新常態班',
    badgeNote: '每週二・正式課 7/21 起共五堂',
    slots: [
      { time: '19:30–20:45', title: 'Bachata LV1' },
      { time: '20:45–22:00', title: '課後練習 social' },
    ],
    datesTitle: '場次',
    datesNote: '7/7 體驗課・正式課共 5 堂（含 8 月）',
    dates: [
      { label: '7/7', status: 'active', note: '體驗課' },
      { label: '7/21', status: 'active', note: '正式 1' },
      { label: '7/28', status: 'active', note: '正式 2' },
      { label: '8/4', status: 'upcoming', note: '正式 3' },
      { label: '8/11', status: 'upcoming', note: '正式 4' },
      { label: '8/18', status: 'upcoming', note: '正式 5' },
    ],
    location: TAINAN_LOCATION,
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
      { time: '19:30–20:30', title: 'Bachata training' },
      { time: '20:30–21:30', title: 'Kizomba LV1' },
      { time: '21:30–23:00', title: 'mini social' },
    ],
    datesTitle: '本期場次',
    datesNote: '共 6 堂・7 月為最後 3 堂',
    dates: [
      { label: '6/11', status: 'done', note: '已結束' },
      { label: '6/18', status: 'done', note: '已結束' },
      { label: '6/25', status: 'done', note: '已結束' },
      { label: '7/2', status: 'active' },
      { label: '7/9', status: 'active' },
      { label: '7/16', status: 'active' },
    ],
    location: KAOHSIUNG_LOCATION,
    pricePlanId: 'card-plan',
    priceSummary: '進階課卡・單堂 $350 起',
  },
];

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
        title: 'Lv1 課程',
        subtitle: '適合初學者的基礎課程',
        courses: [
          { name: 'Bachata Lv1', theme: 'tainanSun' },
          { name: 'Salsa Lv1', theme: 'tainanSun' },
        ],
        options: [
          { name: '單堂體驗', price: 300 },
          { name: '6 堂課程', price: 1700 },
        ],
      },
      {
        title: 'Lv2・進階課程',
        subtitle: '進階技巧與舞步',
        courses: [
          { name: 'Bachata 進階', theme: 'tainanSun' },
          { name: 'Bachata Lv2', theme: 'tainanSun' },
          { name: 'Bachata training', theme: 'kaohsiungThu' },
          { name: 'Kizomba LV1', theme: 'kaohsiungThu' },
        ],
        options: [
          { name: '單堂體驗', price: 350 },
          { name: '6 堂課程', price: 2000 },
        ],
      },
    ],
    note: '*課卡可插班，未使用完畢可用於下一期。週日台南與週四高雄共用同一張課卡；高雄課程皆屬進階課卡。',
  },
  {
    id: 'tuesday-plan',
    name: '週二・新常態班（台南）',
    chips: [{ label: '週二・台南', theme: 'tainanTue' }],
    tiers: [
      {
        title: '新常態班 5 堂',
        subtitle: '7/21 起連續五堂',
        courses: [{ name: 'Bachata LV1', theme: 'tainanTue' }],
        options: [
          { name: '整期五堂', price: 2000 },
          { name: '單堂報名', price: 450 },
        ],
      },
    ],
    note: '*新常態班為獨立方案，與課卡不通用。',
  },
];
