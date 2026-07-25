// 站台層級的識別資訊。metadata、sitemap、robots、JSON-LD 都從這裡取值，
// 避免同一個網址／名稱散落在多處而互相不一致。

export const SITE_URL = 'https://www.bailamore-studio.com';

export const SITE_NAME = "Baila'more 拉丁舞教室";

/** 全站預設描述（root layout 用）。台南、高雄並列。 */
export const SITE_DESCRIPTION =
  '台南・高雄 Bachata & Salsa 社交舞教室。台南週日／週二、高雄週四定期開課，零基礎歡迎，不需舞伴即可報名。';

/** 服務範圍，供 Organization 結構化資料的 areaServed 使用。 */
export const SERVICE_AREAS = ['台南市', '高雄市'] as const;
