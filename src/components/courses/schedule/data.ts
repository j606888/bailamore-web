// 課表的單一資料來源。新增/編輯 track、場次、月曆 highlight 只要改這裡。
// 目前完全寫死、未接後台；樣式確定後再接回 Prisma（見 src/lib/queries.ts）。
//
// 地址不寫在這裡：據點資料集中於 src/data/venues.ts，track 只存 venueSlug。

import { getVenue, type CitySlug, type VenueSlug } from '@/data/venues';

export type ThemeKey =
  | 'tainanSun'
  | 'tainanTue'
  | 'tainanThu'
  | 'kaohsiungTue'
  | 'kaohsiungThu'
  | 'party';

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

/**
 * '9/24' + 年份 → 這一天是否已經過去。
 * 當天仍算進行中，隔天才算過期（課表場次與報名頁活動共用同一套判斷）。
 * 無法解析的 label 一律當成「還沒過」，寧可多顯示也不要誤藏。
 */
export function isPast(label: string, year: number, now: Date): boolean {
  const [month, day] = label.split('/').map(Number);
  if (!month || !day) return false;

  const target = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return target < today;
}

// 場次是否已結束由「真實日期」決定，不寫死。
// label 只有月/日，年份一律取 MONTH.year（目前課表不跨年；跨年時要改成場次自帶年份）。
export function getSessionStatus(
  date: SessionDate,
  now: Date = new Date()
): SessionStatus {
  if (date.upcoming) return 'upcoming';

  return isPast(date.label, MONTH.year, now) ? 'done' : 'active';
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
  tainanThu: {
    pageFrom: 'bg-[#dcefd9]',
    accentText: 'text-[#3f8a4f]',
    accentBg: 'bg-[#4f9d5f]',
    highlightCell: 'bg-[#5aa86a]',
    legendDot: 'bg-[#5aa86a]',
    blob: 'bg-[#f2c6a0]',
  },
  kaohsiungTue: {
    pageFrom: 'bg-[#d3eeee]',
    accentText: 'text-[#22858a]',
    accentBg: 'bg-[#2f9da2]',
    highlightCell: 'bg-[#2f9da2]',
    legendDot: 'bg-[#2f9da2]',
    blob: 'bg-[#f5b8c8]',
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

// 陣列順序就是月曆在 /courses 課表 tab 的顯示順序（由近到遠），左右滑動切換。
// 新的月份 push 到後面，過期的月份從前面拿掉。
// 同一天台南、高雄都有課時，一格只能放一個顏色／連結：標「台南\n高雄」（\n 是刻意的斷行）、連到高雄課卡。
export const MONTHS: MonthConfig[] = [
  {
    year: 2026,
    month: 10,
    titleEn: 'OCTOBER',
    titleZh: '十月',
    // 台南週日十月沒有開班；恢復時從 git 歷史把 tainan-sun track 加回 TRACKS
    highlights: {
      1: { theme: 'kaohsiungThu', label: '台南\n高雄', trackId: 'kaohsiung-thu' },
      3: { theme: 'party', label: 'PARTY' },
      6: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
      8: { theme: 'tainanThu', label: '台南', trackId: 'tainan-thu' },
      13: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
      15: { theme: 'kaohsiungThu', label: '台南\n高雄', trackId: 'kaohsiung-thu' },
      20: { theme: 'tainanTue', label: '台南', trackId: 'tainan-tue' },
      // ★ 對應 footnote：這天高雄的課改在 24steps
      22: { theme: 'kaohsiungThu', label: '台南\n高雄★', trackId: 'kaohsiung-thu' },
      27: { theme: 'kaohsiungTue', label: '台南\n高雄', trackId: 'kaohsiung-tue' },
      // 高雄 10/29 停課（老師還在國外），Bachata LV1 延到 11/5 開課；台南週四照常
      29: { theme: 'tainanThu', label: '台南', trackId: 'tainan-thu' },
    },
    legend: [
      {
        theme: 'tainanTue',
        title: '週二・台南教室',
        desc: 'Bachata 1-3 / 1-2 · 19:30–22:30（10/6–11/3 共五堂）',
      },
      {
        theme: 'tainanThu',
        title: '週四・台南教室',
        desc: 'Salsa 1-1 · 19:15–21:45（10/1–10/29 共五堂）',
      },
      {
        theme: 'kaohsiungTue',
        title: '週二・高雄 24steps',
        desc: '10/27 起 · 19:30 Salsa LV1（新開）・20:30 Kizomba 體驗課',
      },
      {
        theme: 'kaohsiungThu',
        title: '週四・高雄 Social hub',
        desc: '10/22 Bachata 體驗課★・10/29 停課・11/5 Bachata LV1 新開 · 19:30–20:30・20:30–21:30 Bachata training・mini social 至 23:00',
      },
      {
        theme: 'party',
        title: "10/3（六）Baila'more 二週年 Workshop / Party",
        desc: 'Workshop 14:00–17:30・Party 19:30–23:00，地點在台南文化創意產業園區',
      },
    ],
    footnote:
      '★ 10/22（四）高雄的課改在 24steps（新興區仁智街），不是 Social hub；其他週四都在 Social hub。',
  },
  {
    year: 2026,
    month: 11,
    titleEn: 'NOVEMBER',
    titleZh: '十一月',
    // 台南十一月的新一期還沒定，先只放 11/3 週二 Bachata 第五堂（本期最後一堂）
    highlights: {
      3: { theme: 'kaohsiungTue', label: '台南\n高雄', trackId: 'kaohsiung-tue' },
      5: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
      10: { theme: 'kaohsiungTue', label: '高雄', trackId: 'kaohsiung-tue' },
      12: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
      17: { theme: 'kaohsiungTue', label: '高雄', trackId: 'kaohsiung-tue' },
      19: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
      24: { theme: 'kaohsiungTue', label: '高雄', trackId: 'kaohsiung-tue' },
      26: { theme: 'kaohsiungThu', label: '高雄', trackId: 'kaohsiung-thu' },
    },
    legend: [
      {
        theme: 'kaohsiungTue',
        title: '每週二・高雄 24steps',
        desc: '19:30–20:30 Salsa LV1・20:30–21:30 Kizomba LV1',
      },
      {
        theme: 'kaohsiungThu',
        title: '每週四・高雄 Social hub',
        desc: '19:30–20:30 Bachata LV1・20:30–21:30 Bachata training・mini social 至 23:00',
      },
      {
        theme: 'tainanTue',
        title: '週二・台南教室',
        desc: '11/3 Bachata 1-3 / 1-2 第五堂（本期最後一堂）',
      },
    ],
    // TODO: 台南十一月課程確定後補上
    footnote: '台南十一月的課程還在安排中；實際場次以 Instagram 公告為準。',
  },
];

/** 目前月份（getSessionStatus 用它補上場次 label 缺少的年份）。 */
export const MONTH: MonthConfig = MONTHS[0];

export const TRACKS: Track[] = [
  {
    id: 'tainan-tue',
    theme: 'tainanTue',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'Bachata 1-3・1-2 新一期 10/6 開課',
    badgeNote: '本期 10/6–11/3 連續五週，每堂課後接練習時間',
    tabLabel: '週二・台南',
    slots: [
      { time: '19:30–20:30', title: 'Bachata 1-3' },
      { time: '20:30–21:00', title: '練習時間' },
      { time: '21:00–22:00', title: 'Bachata 1-2' },
      { time: '22:00–22:30', title: '練習時間' },
    ],
    datesTitle: '本期場次',
    dates: [
      { label: '10/6', note: '第一堂' },
      { label: '10/13', note: '第二堂' },
      { label: '10/20', note: '第三堂' },
      { label: '10/27', note: '第四堂' },
      { label: '11/3', note: '第五堂' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'tuesday-plan',
    priceSummary: '整期五堂 $1600・單堂 $400',
  },
  {
    id: 'tainan-thu',
    theme: 'tainanThu',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    badge: 'NEW Salsa 1-1 開課',
    badgeNote: '本期 10/1–10/29 連續五週，課後接練習時間',
    tabLabel: '週四・台南',
    slots: [
      { time: '19:15–20:30', title: 'Salsa 1-1' },
      { time: '20:30–21:45', title: '練習時間' },
    ],
    datesTitle: '本期場次',
    dates: [
      { label: '10/1', note: '第一堂' },
      { label: '10/8', note: '第二堂' },
      { label: '10/15', note: '第三堂' },
      { label: '10/22', note: '第四堂' },
      { label: '10/29', note: '第五堂' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'thursday-salsa-plan',
    priceSummary: '整期五堂 $2000・單堂 $450',
  },
  {
    id: 'kaohsiung-tue',
    theme: 'kaohsiungTue',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'NEW 10/27 開課',
    badgeNote: '10/27 Salsa LV1 新開＋Kizomba 體驗課，11 月起每週二 Salsa LV1・Kizomba LV1',
    tabLabel: '週二・高雄',
    slots: [
      { time: '19:30–20:30', title: 'Salsa LV1' },
      { time: '20:30–21:30', title: 'Kizomba LV1' },
    ],
    datesTitle: '場次',
    datesNote: '10/27 的 Kizomba 是體驗課',
    dates: [
      { label: '10/27', note: '開課・Kizomba 體驗' },
      { label: '11/3' },
      { label: '11/10' },
      { label: '11/17' },
      { label: '11/24' },
    ],
    venueSlug: 'kaohsiung-24steps',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・6 堂 $2000・單堂 $400',
  },
  {
    id: 'kaohsiung-thu',
    theme: 'kaohsiungThu',
    cityEn: 'KAOHSIUNG',
    cityZh: '高雄教室',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    badge: 'NEW Bachata LV1 11/5 開課',
    badgeNote: '10/22 先上 Bachata 體驗課，10/29 停課一次，11/5 起每週四 Bachata LV1，課後接 Bachata training 與 mini social',
    tabLabel: '週四・高雄',
    slots: [
      { time: '19:30–20:30', title: 'Bachata LV1' },
      { time: '20:30–21:30', title: 'Bachata training' },
      { time: '21:30–23:00', title: 'mini social' },
    ],
    datesTitle: '場次',
    // 10/22 這一場不在 Social hub，卡片下方的地址只顯示 track 的固定場地，所以這裡一定要寫
    datesNote: '★ 10/22 改在 24steps 上課（當晚沒有 mini social）・10/29 停課',
    dates: [
      { label: '10/22', note: '體驗課★24steps' },
      { label: '11/5', note: 'LV1 開課' },
      { label: '11/12' },
      { label: '11/19' },
      { label: '11/26' },
    ],
    venueSlug: 'kaohsiung-social-hub',
    pricePlanId: 'card-plan',
    priceSummary: '課卡制・6 堂 $2000・單堂 $400',
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

// 高雄週二已於 10/27 正式開課（見 TRACKS 的 kaohsiung-tue），目前沒有籌備中的課程。
export const UPCOMING_TRACKS: UpcomingTrack[] = [];

/** 取得某間教室的所有課程 track。 */
export function getTracksByVenue(slug: VenueSlug): Track[] {
  return TRACKS.filter((t) => t.venueSlug === slug);
}

/** 取得某個城市（可能有好幾間教室）的所有課程 track（據點頁用來列出該城市的課表）。 */
export function getTracksByCity(citySlug: CitySlug): Track[] {
  return TRACKS.filter((t) => getVenue(t.venueSlug).citySlug === citySlug);
}

// ---- 報名活動（報名頁 /enroll 的三個區塊）----
//
// 一場活動一筆。體驗課、新開的課程、客座 Workshop／Party 都放這裡，
// 跟課表共用同一份 THEMES 與 MONTH.year，兩邊的顏色與年份不會走鐘。
//
// 維護規則：
// - 表單還沒開放就把 enrollUrl 留成空字串 ''，那一場整張卡不會顯示（日期可以先寫進去佔位）。
// - 辦完的活動不用手動刪，程式會用今天的日期自動隱藏（跨天活動要等最後一天過完）。
// - venueSlug 不確定就不要填，卡片上就不顯示地點；亂填地址會跟據點頁的地址打架。
// - 跨年的場次一定要填 year，否則排序會把一月排到十月前面。

export type EventKind = 'trial' | 'course' | 'workshop';

/** 外借場地。不是我們自己的據點，所以刻意不進 src/data/venues.ts（那裡是 NAP 單一來源）。 */
export interface ExternalVenue {
  name: string;
  addressFull: string;
  mapLink: string;
}

export interface EnrollEvent {
  id: string; // 錨點 id 與 JSON-LD @id，例如 'tainan-salsa-trial-0924'
  kind: EventKind;
  theme: ThemeKey; // 只用來上小面積的舞種／活動色（日期章上緣與 chip）
  danceStyle: string; // 'Salsa'
  title: string;
  note?: string; // 卡片上的補充說明
  year?: number; // 預設 MONTH.year；跨年場次才要填
  dateLabel: string; // '9/24'
  endDateLabel?: string; // 跨天活動的最後一天
  weekdayEn: string; // 'THU'（日期章上緣）
  startTime?: string; // '19:30'
  endTime?: string; // '21:00'
  venueSlug?: VenueSlug; // 我們自己的據點
  externalVenue?: ExternalVenue; // 外借場地（與 venueSlug 二擇一）
  price?: number; // 有數字才輸出 JSON-LD 的 offers
  priceNote?: string; // 卡片上顯示的費用文字，例如 '單堂 $400'
  enrollUrl: string; // 空字串 = 報名未開放 → 整張卡不顯示
  bannerText?: string; // 有填就是「主打活動」：辦完之前首頁公告條與 Hero 會改推這一場
}

const KAOHSIUNG_TRIAL_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSegflVSfuc2llsPhdfoWaKh57dSTafoa1WwLG-PyivXiyXXQg/viewform';

export const EVENTS: EnrollEvent[] = [
  {
    id: 'tainan-salsa-trial-0924',
    kind: 'trial',
    theme: 'tainanSun',
    danceStyle: 'Salsa',
    title: '台南 Salsa 體驗課',
    note: '零基礎、沒有舞伴都可以來，單堂就能參加。',
    dateLabel: '9/24',
    weekdayEn: 'THU',
    venueSlug: 'tainan',
    // TODO: 上課時間與費用確定後補 startTime / endTime / priceNote
    enrollUrl: 'https://forms.gle/icAqBNGFgdR62k7X7',
  },
  {
    id: 'tainan-salsa-lv1-1001',
    kind: 'course',
    theme: 'tainanThu',
    danceStyle: 'Salsa',
    title: '台南週四 Salsa 1-1',
    note: '10/1–10/29 連續五週，19:15–20:30 上課，20:30–21:45 練習時間。',
    dateLabel: '10/1',
    endDateLabel: '10/29',
    weekdayEn: 'THU',
    startTime: '19:15',
    endTime: '21:45',
    venueSlug: 'tainan',
    price: 2000,
    priceNote: '整期五堂 $2000・單堂 $450',
    enrollUrl: 'https://forms.gle/Yf1afY8bg8qaAfJ28',
  },
  {
    id: 'tainan-bachata-tue-1006',
    kind: 'course',
    theme: 'tainanTue',
    danceStyle: 'Bachata',
    title: '台南週二 Bachata 1-3・1-2',
    note: '10/6–11/3 連續五週，19:30 Bachata 1-3、21:00 Bachata 1-2，每堂課後接練習時間。',
    dateLabel: '10/6',
    endDateLabel: '11/3',
    weekdayEn: 'TUE',
    startTime: '19:30',
    endTime: '22:30',
    venueSlug: 'tainan',
    price: 1600,
    priceNote: '整期五堂 $1600・單堂 $400',
    enrollUrl: 'https://forms.gle/LYF74guiYbcggBCD9',
  },
  {
    id: 'kaohsiung-kizomba-trial-1001',
    kind: 'trial',
    theme: 'kaohsiungThu',
    danceStyle: 'Kizomba',
    title: '高雄 Kizomba 百元體驗課',
    note: '零基礎、沒有舞伴都可以來，課後接 Bachata training 與 mini social。',
    dateLabel: '10/1',
    weekdayEn: 'THU',
    startTime: '19:30',
    endTime: '20:30',
    venueSlug: 'kaohsiung-social-hub',
    price: 100,
    priceNote: '體驗價 $100',
    // 高雄體驗課共用同一張表單，填表時再選場次
    enrollUrl: KAOHSIUNG_TRIAL_FORM,
  },
  {
    id: 'kaohsiung-salsa-trial-1015',
    kind: 'trial',
    theme: 'kaohsiungThu',
    danceStyle: 'Salsa',
    title: '高雄 Salsa 百元體驗課',
    note: '零基礎、沒有舞伴都可以來，課後接 Bachata training 與 mini social。',
    dateLabel: '10/15',
    weekdayEn: 'THU',
    startTime: '19:30',
    endTime: '20:30',
    venueSlug: 'kaohsiung-social-hub',
    price: 100,
    priceNote: '體驗價 $100',
    // 三場共用同一張表單，填表時再選場次
    enrollUrl: KAOHSIUNG_TRIAL_FORM,
  },
  {
    id: 'kaohsiung-bachata-trial-1022',
    kind: 'trial',
    theme: 'kaohsiungThu',
    danceStyle: 'Bachata',
    title: '高雄 Bachata 百元體驗課',
    note: '⚠️ 這一場改在 24steps（新興區），不是 Social hub。零基礎、沒有舞伴都可以來，課後接 Bachata training；10/29 停課，11/5 起每週四 Bachata LV1 在 Social hub 開課。',
    dateLabel: '10/22',
    weekdayEn: 'THU',
    startTime: '19:30',
    endTime: '20:30',
    venueSlug: 'kaohsiung-24steps',
    price: 100,
    priceNote: '體驗價 $100',
    // 高雄體驗課共用同一張表單，填表時再選場次
    enrollUrl: KAOHSIUNG_TRIAL_FORM,
    bannerText: '10/22（四）高雄 Bachata 體驗課開放報名（本場改在 24steps），零基礎、沒有舞伴都可以來',
  },
  {
    id: 'kaohsiung-kizomba-trial-1027',
    kind: 'trial',
    theme: 'kaohsiungTue',
    danceStyle: 'Kizomba',
    title: '高雄 Kizomba 百元體驗課',
    note: '零基礎、沒有舞伴都可以來。同一晚 19:30 Salsa LV1 新開，可以連著上；11 月起每週二 Kizomba LV1。',
    dateLabel: '10/27',
    weekdayEn: 'TUE',
    startTime: '20:30',
    endTime: '21:30',
    venueSlug: 'kaohsiung-24steps',
    price: 100,
    priceNote: '體驗價 $100',
    // 高雄體驗課共用同一張表單，填表時再選場次
    enrollUrl: KAOHSIUNG_TRIAL_FORM,
    bannerText: '10/27（二）高雄 24steps Kizomba 體驗課開放報名，同晚 Salsa LV1 新開',
  },
  {
    id: 'anniversary-1003',
    kind: 'workshop',
    theme: 'party',
    danceStyle: 'Bachata',
    title: "Baila'more 二週年 Workshop / Party",
    note: 'Workshop 14:00–17:30（Body Movement／Partner Work），Party 19:30–23:00 有表演環節；10/4 專題課程另行公告。詳細票種與價格以活動頁為準。',
    dateLabel: '10/3',
    weekdayEn: 'SAT',
    startTime: '14:00',
    endTime: '23:00',
    // 場地是外借的文創園區，不是我們的教室。全站一律寫「台南」不寫「臺南」。
    externalVenue: {
      name: '台南文化創意產業園區',
      addressFull: '701 台南市東區北門路二段 16 號 2F',
      mapLink: 'https://maps.app.goo.gl/WbUDUafaSmBdhyUo8',
    },
    price: 1500,
    priceNote: 'Workshop 單堂 $750・Full Pass $1500 起',
    enrollUrl: 'https://sd-event.vercel.app/e/c3gsydpy',
  },
];

/** 活動的年份。沒特別填就跟著課表的年份走。 */
export function getEventYear(event: EnrollEvent): number {
  return event.year ?? MONTH.year;
}

/** 排序用的數字鍵：20261003。跨年場次靠 year 才不會排錯。 */
function eventSortKey(event: EnrollEvent): number {
  const [month, day] = event.dateLabel.split('/').map(Number);
  return getEventYear(event) * 10000 + (month ?? 0) * 100 + (day ?? 0);
}

/**
 * 某一類還能報名的活動，依日期排序。
 * 排除兩種：報名還沒開放（enrollUrl 空的，點不下去的卡沒有意義）、已經辦完的。
 */
export function getUpcomingEvents(
  kind: EventKind,
  now: Date = new Date()
): EnrollEvent[] {
  return EVENTS.filter((event) => event.kind === kind && isOpen(event, now)).sort(
    (a, b) => eventSortKey(a) - eventSortKey(b)
  );
}

/**
 * 現在要主打的活動（有填 bannerText、還能報名、日期最近的那一場）。
 * 沒有的話回傳 null，首頁就退回 UPCOMING_TRACKS 的預告。
 */
export function getFeaturedEvent(now: Date = new Date()): EnrollEvent | null {
  const featured = EVENTS.filter(
    (event) => event.bannerText && isOpen(event, now)
  ).sort((a, b) => eventSortKey(a) - eventSortKey(b));
  return featured[0] ?? null;
}

/** 報名表已開放、而且還沒辦完（跨天活動要等最後一天過完）。 */
function isOpen(event: EnrollEvent, now: Date): boolean {
  if (!event.enrollUrl) return false;
  const lastDay = event.endDateLabel ?? event.dateLabel;
  return !isPast(lastDay, getEventYear(event), now);
}

/**
 * 結構化資料用的開始時間：'10/3' + 2026 + '14:00' → '2026-10-03T14:00:00+08:00'。
 * 沒有時間就只到日期。放在這裡而不是 jsonLd.ts，因為它處理的是本檔特有的 dateLabel 格式。
 */
export function eventDateIso(
  label: string,
  year: number,
  time?: string
): string | null {
  const [month, day] = label.split('/').map(Number);
  if (!month || !day) return null;

  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return time ? `${date}T${time}:00+08:00` : date;
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
      { label: '週二・高雄', theme: 'kaohsiungTue' },
      { label: '週四・高雄', theme: 'kaohsiungThu' },
    ],
    tiers: [
      {
        title: '統一課卡',
        subtitle: '單一課卡，Lv1、Lv2 同價，適用所有課卡課程',
        courses: [
          { name: 'Body movement', theme: 'tainanSun' },
          { name: 'Bachata Lv2', theme: 'tainanSun' },
          { name: '單人 Salsa', theme: 'tainanSun' },
          { name: 'Salsa LV1', theme: 'kaohsiungTue' },
          { name: 'Kizomba LV1', theme: 'kaohsiungTue' },
          { name: 'Bachata LV1', theme: 'kaohsiungThu' },
          { name: 'Bachata training', theme: 'kaohsiungThu' },
        ],
        options: [
          { name: '6 堂課程', price: 2000 },
          { name: '單堂', price: 400 },
        ],
      },
    ],
    note: '*課卡不分 Lv1、Lv2 一律統一價，可插班，未使用完畢可用於下一期；週日台南與高雄週二、週四共用同一張課卡。正式課不用填表，直接到教室上課即可。',
  },
  {
    id: 'tuesday-plan',
    name: '週二・Bachata 1-2、1-3（台南）',
    chips: [{ label: '週二・台南', theme: 'tainanTue' }],
    tiers: [
      {
        title: 'Bachata 1-2、1-3 5 堂',
        subtitle: '10/6–11/3 連續五週，含課後練習時間',
        courses: [
          { name: 'Bachata 1-2', theme: 'tainanTue' },
          { name: 'Bachata 1-3', theme: 'tainanTue' },
        ],
        options: [
          { name: '整期五堂', price: 1600 },
          { name: '單堂報名', price: 400 },
        ],
      },
    ],
    note: '*週二 Bachata 為獨立方案，與課卡不通用。',
  },
  {
    id: 'thursday-salsa-plan',
    name: '週四・Salsa 1-1（台南）',
    chips: [{ label: '週四・台南', theme: 'tainanThu' }],
    tiers: [
      {
        title: 'Salsa 1-1 5 堂',
        subtitle: '10/1–10/29 連續五週，含課後練習時間',
        courses: [{ name: 'Salsa 1-1', theme: 'tainanThu' }],
        options: [
          { name: '整期五堂', price: 2000 },
          { name: '單堂報名', price: 450 },
        ],
      },
    ],
    note: '*Salsa 1-1 為獨立方案，與課卡、週二 Bachata 不通用。',
  },
];
