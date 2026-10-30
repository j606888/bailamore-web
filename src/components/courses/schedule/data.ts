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
  notes?: string[]; // 場次下方的補充說明（一行一點），用在一期裡有不同安排的 track
  // 課卡裡要拆成獨立小卡的報名活動（EVENTS 的 id）：時間、價格、報名連結都從 EVENTS 讀，不重複寫。
  // 活動辦完就自動不顯示。
  eventIds?: string[];
  // 不用填表、直接來上的課（台南週日、高雄）：「線上報名 →」改成「直接到現場，或私訊粉專詢問」。
  // 台南週二 Lv1 雖然也用課卡，但要先填報名表，不要設這個。
  walkIn?: boolean;
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

export interface Highlight {
  theme: ThemeKey; // 決定方塊顏色
  trackId?: string; // 有課卡的場次：格子連到它，屬於哪個城市由它的據點決定
  citySlug?: CitySlug; // 沒有 trackId 的活動（派對）屬於哪個城市；不填就兩個城市都顯示
  label?: string; // 格子裡的小字，只有活動類或特殊場次用（'PARTY'、'★'）
  cellBg?: string; // 特殊場次可覆寫方塊底色，例如體驗課要比常態課深一階
}

export interface LegendItem {
  theme: ThemeKey;
  title: string; // '週二'（城市已經選了，不用再標）
  desc: string; // 只寫教什麼課，時間與備註都放課卡，這裡字一多就沒人看
  citySlug?: CitySlug; // 沒有對應 track 的 theme（party）要自己標城市；有 track 的由 theme 推
}

export interface MonthConfig {
  year: number;
  month: number; // 1-12
  titleEn: string;
  titleZh: string;
  // 日 -> 當天的場次。台南、高雄同一天都有課就放兩筆；課表依城市切換後一格只會剩一筆。
  highlights: Record<number, Highlight[]>;
  legend: LegendItem[];
}

/** 某一個城市看到的月曆：一天最多一個 highlight，圖例與註腳也只剩該城市的。 */
export interface MonthView {
  year: number;
  month: number;
  titleEn: string;
  titleZh: string;
  highlights: Record<number, Highlight>;
  legend: LegendItem[];
}

// 陣列順序就是月曆在 /courses 課表 tab 的顯示順序（由近到遠），左右滑動切換。
// 新的月份 push 到後面，過期的月份從前面拿掉。
export const MONTHS: MonthConfig[] = [
  {
    year: 2026,
    month: 10,
    titleEn: 'OCTOBER',
    titleZh: '十月',
    // 台南週日十月沒有開班，十一月起恢復（見 tainan-sun track）
    highlights: {
      1: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' },
      ],
      // 二週年派對在台南文創園區，只在台南的月曆出現
      3: [{ theme: 'party', label: 'PARTY', citySlug: 'tainan' }],
      6: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
      8: [{ theme: 'tainanThu', trackId: 'tainan-thu' }],
      13: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
      15: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' },
      ],
      20: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
      // ★ 這天高雄的課改在 24steps（說明在 kaohsiung-thu 課卡的 datesNote）
      22: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu', label: '★' },
      ],
      27: [
        { theme: 'tainanTue', trackId: 'tainan-tue' },
        { theme: 'kaohsiungTue', trackId: 'kaohsiung-tue' },
      ],
      // 高雄 10/29 停課（老師還在國外），Bachata LV1 延到 11/5 開課；台南週四照常
      29: [{ theme: 'tainanThu', trackId: 'tainan-thu' }],
    },
    legend: [
      { theme: 'tainanTue', title: '週二', desc: 'Bachata 1-3・1-2' },
      { theme: 'tainanThu', title: '週四', desc: 'Salsa 1-1' },
      { theme: 'kaohsiungTue', title: '週二・24steps', desc: 'Salsa LV1・Kizomba 體驗課' },
      {
        theme: 'kaohsiungThu',
        title: '週四・Social hub',
        desc: 'Bachata 體驗課★・Bachata training・mini social',
      },
      {
        theme: 'party',
        title: '10/3（六）',
        desc: '二週年 Workshop / Party',
        citySlug: 'tainan',
      },
    ],
  },
  {
    year: 2026,
    month: 11,
    titleEn: 'NOVEMBER',
    titleZh: '十一月',
    highlights: {
      3: [
        { theme: 'tainanTue', trackId: 'tainan-tue' },
        { theme: 'kaohsiungTue', trackId: 'kaohsiung-tue' },
      ],
      5: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' },
      ],
      // 亡靈節 Party 在台南；地點、時間、報名確定後再加進 EVENTS
      7: [{ theme: 'party', label: 'PARTY', citySlug: 'tainan' }],
      8: [{ theme: 'tainanSun', trackId: 'tainan-sun' }],
      10: [
        { theme: 'tainanTue', trackId: 'tainan-tue' },
        { theme: 'kaohsiungTue', trackId: 'kaohsiung-tue' },
      ],
      12: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' },
      ],
      15: [{ theme: 'tainanSun', trackId: 'tainan-sun' }],
      17: [
        { theme: 'tainanTue', trackId: 'tainan-tue' },
        { theme: 'kaohsiungTue', trackId: 'kaohsiung-tue' },
      ],
      // 11/19 台南週四停課（TSC festival），只有高雄
      19: [{ theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' }],
      24: [
        { theme: 'tainanTue', trackId: 'tainan-tue' },
        { theme: 'kaohsiungTue', trackId: 'kaohsiung-tue' },
      ],
      26: [
        { theme: 'tainanThu', trackId: 'tainan-thu' },
        { theme: 'kaohsiungThu', trackId: 'kaohsiung-thu' },
      ],
      29: [{ theme: 'tainanSun', trackId: 'tainan-sun' }],
    },
    legend: [
      {
        theme: 'tainanTue',
        title: '週二',
        desc: '11/3 1-3／1-2 最後一堂・體驗課・Lv2・Lv1 新手班',
      },
      { theme: 'tainanThu', title: '週四', desc: 'Salsa 1-2' },
      { theme: 'tainanSun', title: '週日', desc: 'Body Movement・單人 Salsa' },
      { theme: 'party', title: '11/7（六）', desc: '亡靈節 Party', citySlug: 'tainan' },
      { theme: 'kaohsiungTue', title: '週二・24steps', desc: 'Salsa LV1・Kizomba LV1' },
      {
        theme: 'kaohsiungThu',
        title: '週四・Social hub',
        desc: 'Bachata LV1・Bachata training・mini social',
      },
    ],
  },
];

// 十二月月曆先不上線（太早秀會讓人以為十一月的課已經排完），課卡上照樣列到 12 月的場次。
// 十二月初再把這份 push 進 MONTHS，並把高雄、台南週日的日期補上。
export const DECEMBER_2026: MonthConfig = {
  year: 2026,
  month: 12,
  titleEn: 'DECEMBER',
  titleZh: '十二月',
  // 目前只有台南週二、週四的場次確定；高雄與台南週日的十二月安排確定後再補
  highlights: {
    1: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
    3: [{ theme: 'tainanThu', trackId: 'tainan-thu' }],
    8: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
    10: [{ theme: 'tainanThu', trackId: 'tainan-thu' }],
    15: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
    22: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
    29: [{ theme: 'tainanTue', trackId: 'tainan-tue' }],
  },
  legend: [
    { theme: 'tainanTue', title: '週二', desc: 'Bachata Lv2・Lv1 新手班' },
    { theme: 'tainanThu', title: '週四', desc: 'Salsa 1-2' },
  ],
};

/** 目前月份（getSessionStatus 用它補上場次 label 缺少的年份）。 */
export const MONTH: MonthConfig = MONTHS[0];

export const TRACKS: Track[] = [
  {
    id: 'tainan-sun',
    theme: 'tainanSun',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'SUNDAY',
    dayZh: '週日',
    tabLabel: '週日・台南',
    slots: [
      { time: '14:00–15:00', title: 'Body Movement' },
      { time: '15:00–16:00', title: '單人 Salsa' },
    ],
    datesTitle: '本期場次',
    datesNote: '11/22 停課',
    dates: [
      { label: '11/8' },
      { label: '11/15' },
      { label: '11/29' },
    ],
    notes: [
      'Body Movement 與單人 Salsa 可以分開上，只上其中一堂也可以；兩堂都能用課卡。',
      '課卡效期半年。',
    ],
    walkIn: true,
    venueSlug: 'tainan',
    pricePlanId: 'card-plan',
    priceSummary: '課卡 6 堂 $2000・單堂 $400',
  },
  {
    id: 'tainan-tue',
    theme: 'tainanTue',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'TUESDAY',
    dayZh: '週二',
    badge: 'Bachata Lv2・Lv1 新手班 11/24 開課',
    badgeNote: '11/10、11/17 先來體驗課',
    tabLabel: '週二・台南',
    // 時段寫 11/24 起的新一期；11/3 與 11/10、11/17 的特殊安排見 notes
    slots: [
      { time: '19:30–20:30', title: 'Bachata Lv2' },
      { time: '20:30–21:00', title: '練習時間' },
      { time: '21:00–22:00', title: 'Bachata Lv1 新手班' },
    ],
    datesTitle: '場次',
    // 十二月的場次先不列（格子太多沒人看）；十二月初再補
    dates: [
      { label: '11/3', note: '舊班最後一堂' },
      { label: '11/10', note: '體驗課' },
      { label: '11/17', note: '體驗課' },
      { label: '11/24', note: '新班開課' },
    ],
    // 11/10、11/17 的體驗課拆成小卡放在課卡裡。
    // 同一時段給舊生的進度班不上官網，只在學生群組公告。
    eventIds: ['tainan-bachata-trial-1110'],
    venueSlug: 'tainan',
    pricePlanId: 'tuesday-plan',
    priceSummary: 'Lv2 整期 6 堂 $2000・Lv1 用課卡',
  },
  {
    id: 'tainan-thu',
    theme: 'tainanThu',
    cityEn: 'TAINAN',
    cityZh: '台南教室',
    sessionLabelEn: 'THURSDAY',
    dayZh: '週四',
    badge: 'Salsa 1-2 11/5 開課',
    badgeNote: '丁丁 & Nora・滿 5 人開班',
    tabLabel: '週四・台南',
    slots: [
      { time: '19:15–20:30', title: 'Salsa 1-2' },
      { time: '20:30–21:30', title: '練習時間' },
    ],
    datesTitle: '本期場次',
    datesNote: '11/19 停課',
    // 十二月的場次（12/3、12/10）先不列；十二月初再補
    dates: [
      { label: '11/5', note: '第一堂' },
      { label: '11/12', note: '第二堂' },
      { label: '11/26', note: '第三堂' },
    ],
    venueSlug: 'tainan',
    pricePlanId: 'thursday-salsa-plan',
    priceSummary: '整期 5 堂 $2000・單堂 $450',
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
    walkIn: true,
    venueSlug: 'kaohsiung-24steps',
    pricePlanId: 'card-plan',
    priceSummary: '課卡 6 堂 $2000・單堂 $400',
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
    walkIn: true,
    venueSlug: 'kaohsiung-social-hub',
    pricePlanId: 'card-plan',
    priceSummary: '課卡 6 堂 $2000・單堂 $400',
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

function trackCity(trackId: string): CitySlug | undefined {
  const track = TRACKS.find((t) => t.id === trackId);
  return track ? getVenue(track.venueSlug).citySlug : undefined;
}

/** 這個 theme 有沒有課在該城市（圖例用 theme 推城市，party 這種沒 track 的要自己標）。 */
function themeInCity(theme: ThemeKey, citySlug: CitySlug): boolean {
  return TRACKS.some(
    (t) => t.theme === theme && getVenue(t.venueSlug).citySlug === citySlug
  );
}

/**
 * 把一個月的資料縮成某個城市看到的樣子：
 * 有 trackId 的場次看課卡的據點在哪個城市；沒有的看 citySlug，兩者都沒有就兩個城市都顯示。
 */
export function getMonthForCity(month: MonthConfig, citySlug: CitySlug): MonthView {
  const highlights: Record<number, Highlight> = {};
  for (const [day, items] of Object.entries(month.highlights)) {
    const hit = items.find((h) =>
      h.trackId ? trackCity(h.trackId) === citySlug : !h.citySlug || h.citySlug === citySlug
    );
    if (hit) highlights[Number(day)] = hit;
  }
  const legend = month.legend.filter((item) =>
    item.citySlug ? item.citySlug === citySlug : themeInCity(item.theme, citySlug)
  );
  return {
    year: month.year,
    month: month.month,
    titleEn: month.titleEn,
    titleZh: month.titleZh,
    highlights,
    legend,
  };
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
  enrollUrl: string; // 空字串 = 報名未開放 → 整張卡不顯示（除非有填 enrollPending）
  // 表單還沒開但要先曝光：有填這行字，卡片照樣顯示，按鈕改成私訊粉專。不會輸出 JSON-LD。
  enrollPending?: string;
  kindLabel?: string; // 覆寫卡片上的「體驗課／新開課程」標籤，例如 '本期 11/3 結束'
  alert?: string; // 卡片上醒目的提醒（截止日之類），一句話就好
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
    priceNote: '整期 5 堂 $2000・單堂 $450',
    enrollUrl: 'https://forms.gle/Yf1afY8bg8qaAfJ28',
  },
  {
    id: 'tainan-bachata-tue-1006',
    kind: 'course',
    theme: 'tainanTue',
    danceStyle: 'Bachata',
    title: '台南週二 Bachata 1-3・1-2',
    kindLabel: '本期 11/3 結束',
    note: '19:30 Bachata 1-3・21:00 Bachata 1-2',
    dateLabel: '10/6',
    endDateLabel: '11/3',
    weekdayEn: 'TUE',
    startTime: '19:30',
    endTime: '22:30',
    venueSlug: 'tainan',
    price: 1600,
    priceNote: '整期 5 堂 $1600・單堂 $400',
    enrollUrl: 'https://forms.gle/LYF74guiYbcggBCD9',
  },
  {
    id: 'tainan-salsa-1-2-1105',
    kind: 'course',
    theme: 'tainanThu',
    danceStyle: 'Salsa',
    title: '台南週四 Salsa 1-2',
    note: '丁丁 & Nora・11/19 停課・滿 5 人開班',
    dateLabel: '11/5',
    endDateLabel: '12/10',
    weekdayEn: 'THU',
    startTime: '19:15',
    endTime: '21:30',
    venueSlug: 'tainan',
    price: 2000,
    priceNote: '整期 5 堂 $2000・單堂 $450',
    enrollUrl: 'https://forms.gle/icBJWwF1UYsgJYZc9',
    bannerText: '11/5（四）台南 Salsa 1-2 開課，丁丁 & Nora 授課',
  },
  {
    id: 'tainan-bachata-trial-1110',
    kind: 'trial',
    theme: 'tainanTue',
    danceStyle: 'Bachata',
    title: '台南 Bachata 新手體驗課',
    kindLabel: '給新朋友',
    note: '兩天擇一・先填表，當天現場繳費',
    dateLabel: '11/10',
    endDateLabel: '11/17',
    weekdayEn: 'TUE',
    startTime: '21:00',
    endTime: '22:30',
    venueSlug: 'tainan',
    price: 200,
    priceNote: '單人 $200・雙人 $300',
    enrollUrl:
      'https://docs.google.com/forms/d/11aLQeYDTDUtxv6li3hOpPSDwRsN1mmf1QQBCN2kNvHs/viewform',
    bannerText: '11/10、11/17（二）台南 Bachata 新手體驗課 $200，零基礎、沒有舞伴都可以來',
  },
  {
    id: 'tainan-bachata-lv2-1124',
    kind: 'course',
    theme: 'tainanTue',
    danceStyle: 'Bachata',
    title: '台南週二 Bachata Lv2',
    note: '19:30 上課・20:30 練習',
    dateLabel: '11/24',
    endDateLabel: '12/29',
    weekdayEn: 'TUE',
    startTime: '19:30',
    endTime: '21:00',
    venueSlug: 'tainan',
    price: 2000,
    priceNote: '整期 6 堂 $2000',
    // TODO: 報名表開放後填入 enrollUrl，並刪掉 enrollPending
    enrollUrl: '',
    enrollPending: '報名表 11 月初開放，先私訊預約',
  },
  {
    id: 'tainan-bachata-lv1-1124',
    kind: 'course',
    theme: 'tainanTue',
    danceStyle: 'Bachata',
    title: '台南週二 Bachata Lv1 新手班',
    note: '零基礎、沒舞伴都可以',
    dateLabel: '11/24',
    weekdayEn: 'TUE',
    startTime: '21:00',
    endTime: '22:00',
    venueSlug: 'tainan',
    // 用課卡，跟台南週日、高雄共用同一張
    price: 400,
    priceNote: '課卡 6 堂 $2000・單堂 $400',
    // TODO: 報名表開放後填入 enrollUrl，並刪掉 enrollPending
    enrollUrl: '',
    enrollPending: '報名表 11 月初開放，先私訊預約',
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
 * 現在要主打的活動（有填 bannerText、表單已開、還沒辦完），依日期排序。
 * 空陣列時首頁退回 UPCOMING_TRACKS 的預告。
 */
export function getFeaturedEvents(now: Date = new Date()): EnrollEvent[] {
  return EVENTS.filter(
    (event) => event.bannerText && event.enrollUrl && isOpen(event, now)
  ).sort((a, b) => eventSortKey(a) - eventSortKey(b));
}

/** 用 id 找活動（課卡裡的小卡用）；已經辦完或不存在就回 null。 */
export function getOpenEvent(id: string, now: Date = new Date()): EnrollEvent | null {
  const event = EVENTS.find((e) => e.id === id);
  return event && isOpen(event, now) ? event : null;
}

/** 卡片要不要顯示：表單已開或有填 enrollPending，而且還沒辦完（跨天活動要等最後一天過完）。 */
function isOpen(event: EnrollEvent, now: Date): boolean {
  if (!event.enrollUrl && !event.enrollPending) return false;
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
  name: string; // '整期 5 堂' / '課卡 6 堂' / '單堂'
  price: number;
}

export interface PriceCourse {
  name: string; // 'Bachata Lv1'
  theme: ThemeKey; // 該課程所屬 track，決定 chip 顏色
}

export interface PriceTier {
  title: string; // 'Lv1 課程'
  subtitle?: string;
  courses?: PriceCourse[]; // 適用課程（chip，依 track 上色）；標題已經講清楚是哪堂課就不用放
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
    name: '課卡',
    chips: [
      { label: '週二・台南', theme: 'tainanTue' },
      { label: '週日・台南', theme: 'tainanSun' },
      { label: '週二・高雄', theme: 'kaohsiungTue' },
      { label: '週四・高雄', theme: 'kaohsiungThu' },
    ],
    tiers: [
      {
        title: '一張課卡，以下都能上',
        courses: [
          { name: 'Bachata Lv1 新手班', theme: 'tainanTue' },
          { name: 'Body Movement', theme: 'tainanSun' },
          { name: '單人 Salsa', theme: 'tainanSun' },
          { name: 'Salsa LV1', theme: 'kaohsiungTue' },
          { name: 'Kizomba LV1', theme: 'kaohsiungTue' },
          { name: 'Bachata LV1', theme: 'kaohsiungThu' },
          { name: 'Bachata training', theme: 'kaohsiungThu' },
        ],
        options: [
          { name: '課卡 6 堂', price: 2000 },
          { name: '單堂', price: 400 },
        ],
      },
    ],
    // 「直接來」只限台南週日與高雄；台南週二 Lv1 要先填報名表
    note: '效期半年・台南高雄共用・可插班｜台南週日、高雄直接來上；台南週二 Lv1 要先填報名表',
  },
  {
    id: 'tuesday-plan',
    name: '週二 Bachata Lv2・體驗課（台南）',
    chips: [{ label: '週二・台南', theme: 'tainanTue' }],
    tiers: [
      {
        title: '新手體驗課',
        subtitle: '給新朋友・11/10、11/17 擇一・現場繳費',
        options: [
          { name: '單人', price: 200 },
          { name: '雙人', price: 300 },
        ],
      },
      {
        title: 'Lv2',
        subtitle: '11/24 起・報名表 11 月初開放',
        options: [{ name: '整期 6 堂', price: 2000 }],
      },
    ],
    note: '不能用課卡・Lv1 新手班用課卡（見上方）',
  },
  {
    id: 'thursday-salsa-plan',
    name: '週四 Salsa 1-2（台南）',
    chips: [{ label: '週四・台南', theme: 'tainanThu' }],
    tiers: [
      {
        title: 'Salsa 1-2',
        subtitle: '11/5 起・滿 5 人開班',
        options: [
          { name: '整期 5 堂', price: 2000 },
          { name: '單堂', price: 450 },
        ],
      },
    ],
    note: '不能用課卡',
  },
];
