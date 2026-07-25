// 上課據點的單一資料來源。
//
// 地址原本散落在三個地方（Footer、/location 頁、schedule/data.ts）且互相衝突，
// 對本地 SEO（Google 需要一致的 NAP：名稱／地址／電話）是直接扣分項，故集中於此。
// 全站一律使用「台南市」而非「臺南市」——Google 會把兩者視為不同字串。

export type VenueSlug = 'tainan' | 'kaohsiung';

export interface Venue {
  slug: VenueSlug;
  /** 城市，同時作為 PostalAddress.addressRegion */
  city: string; // '台南市'
  /** 行政區，同時作為 PostalAddress.addressLocality */
  district: string; // '中西區'
  /** 課表卡上的裝飾字 */
  cityEn: string; // 'TAINAN'
  /** 據點全名，作為 LocalBusiness.name */
  name: string; // "Baila'more 台南教室・丁宅"
  /** 場地暱稱，接在「台南市中西區」後面顯示，例如「台南市中西區・丁宅」 */
  shortName: string; // '丁宅'
  /** 門牌，作為 PostalAddress.streetAddress */
  streetAddress: string; // '民族路二段57巷5號'
  postalCode: string; // '700'
  /** 顯示用完整地址（頁面上直接印出來的那一行） */
  addressFull: string;
  /** 地址下方的補充說明（例如「丁宅為後門入口、沒有獨立門牌」） */
  addressNote?: string;
  /** 已知的座標；不確定時留空，寧可不填也不要填錯（會讓地圖釘錯位置） */
  geo?: { lat: number; lng: number };
  /** Google Maps iframe 的 src */
  mapEmbedSrc: string;
  /** 點擊後在 Google Maps 開啟的連結 */
  mapLink: string;
  /** 導航提示，例如台南要搜尋「萬昌起義」而非地址 */
  navNote?: string;
  /** 這個據點有哪些課程 track（對應 schedule/data.ts 的 Track.id） */
  trackIds: string[];
}

/** 以座標為中心的 Google Maps 內嵌網址，不需 API key，釘選位置精確。 */
function mapEmbed(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=zh-TW&z=17&output=embed`;
}

function mapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const VENUES: Venue[] = [
  {
    slug: 'tainan',
    city: '台南市',
    district: '中西區',
    cityEn: 'TAINAN',
    name: "Baila'more 台南教室・丁宅",
    shortName: '丁宅',
    streetAddress: '民族路二段57巷5號',
    postalCode: '700',
    addressFull: '700 台南市中西區民族路二段 57 巷 5 號',
    addressNote: '丁宅為後門入口、沒有獨立門牌地址，導航請一律搜尋「萬昌起義」。',
    // 座標取自原本 /location 頁面的 Google Maps embed 字串（地標：萬昌起義）
    geo: { lat: 22.994232, lng: 120.21063 },
    // 沿用原本 /location 頁面的 embed（釘在地標「萬昌起義」上）
    mapEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239.85183938333768!2d120.21063370455558!3d22.994232091187936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e768c1cdb6a8b%3A0x63cdd79f783bce5c!2z6JCs5piM6LW3576p!5e0!3m2!1szh-TW!2stw!4v1782357028566!5m2!1szh-TW!2stw',
    mapLink: mapLink('萬昌起義 台南市中西區民族路二段57巷'),
    navNote: '導航請搜尋地標「萬昌起義」（一間酒吧），教室在它對面的住宅區。',
    trackIds: ['tainan-sun', 'tainan-tue'],
  },
  {
    slug: 'kaohsiung',
    city: '高雄市',
    district: '三民區',
    cityEn: 'KAOHSIUNG',
    name: "Baila'more 高雄教室・Social hub",
    shortName: 'Social hub',
    streetAddress: '大昌二路67號3樓之2',
    postalCode: '807',
    // 場地名（Social hub）改由 shortName 表示，addressFull 只留純地址
    addressFull: '807 高雄市三民區大昌二路 67 號 3 樓之 2',
    // 座標與地址取自場地的 Google 商家檔案「Social hub」
    geo: { lat: 22.6402888, lng: 120.332118 },
    mapEmbedSrc: mapEmbed(22.6402888, 120.332118),
    mapLink: 'https://maps.app.goo.gl/1b6UAa2iVqdRhyNS9',
    navNote: '教室在 Social hub 的 3 樓之 2，導航直接搜尋「Social hub」即可。',
    trackIds: ['kaohsiung-thu'],
  },
];

export function getVenue(slug: VenueSlug): Venue {
  const venue = VENUES.find((v) => v.slug === slug);
  if (!venue) throw new Error(`Unknown venue slug: ${slug}`);
  return venue;
}

export function getVenueSlugs(): { slug: VenueSlug }[] {
  return VENUES.map((v) => ({ slug: v.slug }));
}
