// /journey「兩年回顧」的單一資料來源：從 2024/10/6 第一堂課到二週年，一場活動一筆。
//
// 素材放在 Vercel Blob 的 journey/<slug>/ 底下：
//   cover.jpg  封面，每場都有（清單縮圖、影片載入前的底圖、電腦版模糊背景都用它）
//   01.jpg、02.mp4…  依原始資料夾的檔名排序轉出：照片長邊 1600px，影片 720p／30fps、保留原聲
// media 依播放順序列出這一場要播的檔案；一場可以有多則，手機像 IG 限動一則一則點，
// 電腦版自動輪播並在左側列出縮圖。
// 換素材時用同一個路徑覆寫上傳即可；新增或刪除檔案則要同步改 media。
//
// 說明文字（desc）是依資料夾名稱寫的草稿，標 [待補] 的要請工作室補上。

const MEDIA_BASE =
  'https://ikhr8fc3iglih52q.public.blob.vercel-storage.com/journey';

export type JourneyPlace = 'tainan' | 'anping' | 'kaohsiung' | 'liuqiu' | 'hengchun';

export interface JourneyEvent {
  slug: string; // '2024-10-06-first-class'，同時是 Blob 路徑與網址 hash（/journey#2024-10-06-first-class）
  date: string; // '2024-10-06'
  title: string;
  desc: string;
  place?: JourneyPlace; // 不確定就不要填，畫面上不顯示地點
  media: string[]; // journey/<slug>/ 底下的檔名，依播放順序；空陣列 = 純文字卡（例如二週年）
  finale?: boolean; // 二週年：最後一張，附報名按鈕
}

export const PLACE_LABEL: Record<JourneyPlace, string> = {
  tainan: '台南',
  anping: '台南・安平',
  kaohsiung: '高雄',
  liuqiu: '小琉球',
  hengchun: '恆春',
};

// 每一年一個章節，顏色用在沒有封面的文字卡與章節標籤
export const CHAPTERS: Record<number, { title: string; color: string }> = {
  2024: { title: '起步', color: '#00786f' },
  2025: { title: '走出去', color: '#b8574c' },
  2026: { title: '兩座城市', color: '#2d3a5e' },
};

export const JOURNEY_EVENTS: JourneyEvent[] = [
  { slug: '2024-10-06-first-class', date: '2024-10-06', title: '第一堂課', place: 'tainan', desc: "Baila'more 的第一堂課。教室裡人還不多，音樂一下就熱起來了。", media: ['01.mp4'] },
  { slug: '2024-10-10-first-practice', date: '2024-10-10', title: '第一次練習會', place: 'tainan', desc: '下課捨不得走，乾脆留下來多跳一會兒，練習會就這樣開始了。', media: ['01.mp4', '02.mp4', '03.jpg', '04.jpg', '05.jpg'] },
  { slug: '2024-10-20-party-youko', date: '2024-10-20', title: '台南 Party with Youko', place: 'tainan', desc: '我們辦的第一場派對，邀請 Youko 一起來跳。', media: ['01.mp4', '02.mp4'] },
  { slug: '2024-12-22-first-term', date: '2024-12-22', title: '第一期課程結束・成果拍攝', place: 'tainan', desc: '第一期結業，拍了一支成果影片留作紀念。', media: ['01.mp4'] },
  { slug: '2025-03-30-hustle-bachata', date: '2025-03-30', title: 'Hustle × Bachata Party', place: 'tainan', desc: 'Hustle 和 Bachata 同一晚，兩邊的舞友玩在一起。', media: ['01.jpg'] },
  { slug: '2025-04-19-jane-workshop', date: '2025-04-19', title: 'Jane Workshop', desc: '邀請 Jane 老師來開 Workshop。', media: ['01.jpg'] },
  { slug: '2025-04-19-anping-shanghai', date: '2025-04-19', title: '安平老上海派對', place: 'anping', desc: '換上老上海造型，在安平跳了一整晚。', media: ['01.jpg', '02.jpg', '03.jpg'] },
  { slug: '2025-05-16-bachazouk', date: '2025-05-16', title: 'Bachazouk with Adrian & Sheri', desc: 'Adrian & Sheri 帶來 Bachazouk，Bachata 加上 Zouk 的流動感。', media: ['01.jpg', '02.mp4', '03.jpg'] },
  { slug: '2025-07-26-shaye', date: '2025-07-26', title: '沙野多語跳舞', desc: '在沙野用好幾種語言一起跳舞。', media: ['01.jpg'] },
  { slug: '2025-09-13-salsa-workshop', date: '2025-09-13', title: 'Salsa Workshop with Pin & 天佑', desc: 'Pin 與天佑的 Salsa Workshop。', media: ['01.mp4', '02.mp4'] },
  { slug: '2025-09-30-liuqiu', date: '2025-09-30', title: '小琉球跳舞', place: 'liuqiu', desc: '第一次把舞跳到小琉球。', media: ['01.mp4', '02.mp4'] },
  { slug: '2025-11-23-tsc', date: '2025-11-23', title: 'TSC', desc: '[待補：TSC 這趟的故事]', media: ['01.jpg', '02.jpg', '03.jpg'] },
  { slug: '2026-01-17-taco-market', date: '2026-01-17', title: '塔可市集', desc: '把拉丁舞帶進塔可市集。', media: ['01.jpg', '02.jpg', '03.jpg', '04.jpg'] },
  { slug: '2026-02-28-liuqiu-again', date: '2026-02-28', title: '更多人的小琉球', place: 'liuqiu', desc: '再訪小琉球，這次一起去的人更多了。', media: ['01.jpg', '02.jpg'] },
  { slug: '2026-03-14-pisces-birthday', date: '2026-03-14', title: '雙魚生日會：老墨 × 丁宅', place: 'tainan', desc: '老墨和丁宅一起辦的雙魚座生日會。', media: ['01.jpg', '02.jpg', '03.jpg', '04.jpg'] },
  { slug: '2026-04-03-warship', date: '2026-04-03', title: '軍艦趴', desc: '把派對開上軍艦甲板。', media: ['01.jpg', '02.jpg', '03.jpg', '04.mp4', '05.mp4'] },
  { slug: '2026-04-04-after-warship', date: '2026-04-04', title: 'After 軍艦趴', desc: '軍艦趴隔天的續攤。', media: ['01.jpg', '02.jpg'] },
  { slug: '2026-04-18-hengchun', date: '2026-04-18', title: '恆春趴', place: 'hengchun', desc: '一路跳到恆春。', media: ['01.mp4', '02.mp4', '03.mp4', '04.mp4', '05.jpg'] },
  { slug: '2026-05-16-bachata-day-jenny-chris', date: '2026-05-16', title: 'Bachata Day・Musicality Workshop（Jenny & Chris）', desc: 'Bachata Day 第一天，Jenny & Chris 的音樂性 Workshop。', media: ['01.jpg', '02.mp4'] },
  { slug: '2026-05-17-bachata-day-pin', date: '2026-05-17', title: 'Bachata Day・Musicality Workshop（Pin & 天佑）', desc: 'Bachata Day 第二天，換 Pin & 天佑上場。', media: ['01.mp4', '02.mp4', '03.mp4', '04.mp4', '05.jpg'] },
  { slug: '2026-06-08-kaohsiung-weekday', date: '2026-06-08', title: '高雄平日班開課', place: 'kaohsiung', desc: '高雄教室開張，平日班的第一堂課。', media: ['01.jpg', '02.mp4', '03.jpg'] },
  { slug: '2026-06-20-dol', date: '2026-06-20', title: '跟著 Sean 去 DOL 週年慶', desc: '跟著 Sean 老師去參加 DOL 週年慶。', media: ['01.jpg', '02.mp4', '03.mp4', '04.jpg', '05.jpg'] },
  { slug: '2026-07-18-legends', date: '2026-07-18', title: 'Legends 體驗課邀約', desc: '受邀到 Legends 開體驗課。', media: ['01.mp4', '02.mp4', '03.jpg', '04.jpg'] },
  { slug: '2026-07-21-tainan-baby-class', date: '2026-07-21', title: '台南寶寶班開班', place: 'tainan', desc: '台南的新手寶寶班開班。', media: ['01.mp4'] },
  { slug: '2026-08-15-amores-danza', date: '2026-08-15', title: '跟著 Sean 去 Amores Danza 開課', desc: '跟著 Sean 老師去 Amores Danza 開課。', media: ['01.mp4', '02.mp4', '03.jpg', '04.jpg', '05.jpg', '06.jpg'] },
  { slug: '2026-08-30-me-generation', date: '2026-08-30', title: '受邀 Me Generation 西文文化體驗課', desc: '受邀到 Me Generation 帶西語文化體驗課。', media: ['01.jpg', '02.jpg', '03.mp4', '04.mp4'] },
  { slug: '2026-10-03-anniversary', date: '2026-10-03', title: "Baila'more 二週年 Workshop / Party", place: 'tainan', desc: '兩年了，謝謝每一位一起跳過的人。下一場，等你一起來。', media: [], finale: true },
];

export interface JourneyMedia {
  kind: 'photo' | 'video';
  url: string;
}

export function journeyMedia(event: JourneyEvent): JourneyMedia[] {
  return event.media.map((file) => ({
    kind: file.endsWith('.mp4') ? 'video' : 'photo',
    url: `${MEDIA_BASE}/${event.slug}/${file}`,
  }));
}

/** 每場都有 cover.jpg（二週年這種純文字卡除外） */
export function journeyCoverUrl(event: JourneyEvent): string | undefined {
  return event.media.length ? `${MEDIA_BASE}/${event.slug}/cover.jpg` : undefined;
}

export function journeyYear(event: JourneyEvent): number {
  return Number(event.date.slice(0, 4));
}

/** '2024-10-06' → '2024/10/6'（與工作室的活動清單寫法一致） */
export function journeyDateLabel(event: JourneyEvent): string {
  const [y, m, d] = event.date.split('-').map(Number);
  return `${y}/${m}/${d}`;
}

/** '5 張照片・1 支影片'：網站上實際播得到的數量；沒有素材時回傳空字串 */
export function journeyMediaLabel(event: JourneyEvent): string {
  const videos = event.media.filter((f) => f.endsWith('.mp4')).length;
  const photos = event.media.length - videos;
  const parts: string[] = [];
  if (photos) parts.push(`${photos} 張照片`);
  if (videos) parts.push(`${videos} 支影片`);
  return parts.join('・');
}
