# Baila'more 管理後台（CMS）建置計劃書

> 目的：把目前「寫死在程式碼、改了要 push 才更新」的網站內容，改成「有帳號密碼登入的後台，直接線上編輯」。
>
> 本文件是跨 session 的執行藍圖。每個階段（Phase）可在獨立 session 執行，互不依賴前一個 session 的對話記憶 —— 只要讀本文件即可接手。

---

## 0. 已確認的決策（與業主討論結果）

| 項目 | 決定 | 備註 |
|------|------|------|
| 登入帳號 | **多個帳號、同權限** | 不做角色系統。每個帳號都能編輯全部內容 |
| 資料庫 | **PostgreSQL + Prisma**，託管於 **Supabase**（線上免費方案） | 開發與正式站共用 Supabase；不使用本地 Docker（避免各機器版本不一致）。可開兩個專案分 dev/prod，或先共用一個 |
| 正式站資料來源 | **動態渲染 + ISR** | 頁面改 server component 讀 DB，存檔後用 `revalidatePath` 即時更新 |
| 優先範圍 | **變動最頻繁的先做** | Phase 1 = 課程表 + 師資；其餘分階段 |
| 媒體儲存 | **Vercel Blob**（建議，沿用現有方案） | 影片已在 Blob；圖片新上傳走 Blob |
| 後台位置 | **同一個 Next.js app 的 `/admin` 路由**（建議） | 不另開專案，共用元件與部署 |

---

## 1. 現況盤點（內容來源）

| 內容 | 現在位置 | 資料型態 | Phase |
|------|----------|----------|-------|
| 課程表 | `src/data/schedule.ts`（`COURSE_PERIODS` + `COURSES`） | 日期陣列 + 時段課程 | **1** |
| 師資 | `src/data/teachers.ts`（`TEACHERS`） + `/public/teachers/*` | 物件 + 圖片 + YouTube | **1** |
| 學生推薦 | `src/components/home/Testimonials.tsx` 內陣列 + `/public/testimonials/*` | 文字 + 頭像 | 2 |
| 價格 | `src/data/pricing.ts`（`PRICING_TIERS`） | 結構化 | 2 |
| 首頁影片 | `src/components/home/Hero.tsx` 寫死 Blob 網址 | 單一網址 | 3 |
| FAQ | `src/components/home/FAQ.tsx` 內陣列 | 文字 + **JSX 連結** ⚠️ | 3 |

現況特性：全站 `'use client'`、內容寫死、無後端 / API / DB，部署於 Vercel。

### 待處理的兩個資料模型問題
1. **FAQ 答案含 JSX 連結**（`<a>`、`<Link>`）。DB 無法存 JSX。
   → 解法：答案改存 **Markdown 字串**，前台用 `react-markdown` 渲染，連結樣式用 `components` prop 套上 teal 底線。
2. **課程表目前每個日期共用同一份 `COURSES`**。
   → 建議資料模型支援「每個日期可有自己的課表」（多數情況仍沿用上一期，提供「複製上一期」按鈕）。先做成 per-period，預設沿用即可。

---

## 2. 目標架構

```
Next.js 15 app（單一專案）
├── 前台（/、/courses、/teachers、/teachers/[slug]、/location）
│     └── 改為 server component，從 DB 讀資料 + ISR（revalidate）
├── 後台（/admin/*）
│     ├── /admin/login            登入頁
│     ├── /admin                  儀表板
│     ├── /admin/schedule         課程表管理
│     ├── /admin/teachers         師資管理
│     ├── /admin/testimonials     學生推薦管理
│     ├── /admin/pricing          價格管理
│     ├── /admin/hero             首頁影片管理
│     ├── /admin/faq              FAQ 管理
│     └── /admin/users            帳號管理（新增同權限帳號）
├── middleware.ts                 保護 /admin/*（未登入轉 /admin/login）
├── Server Actions / API routes   寫入 DB + revalidatePath
└── Prisma + PostgreSQL           資料層
```

資料流：
```
後台表單 → Server Action → Prisma 寫入 Postgres → revalidatePath('/...') → 前台 ISR 更新
媒體上傳 → Server Action → Vercel Blob → 取得 URL 存進 DB
```

---

## 3. 技術選型（需新增的套件）

| 用途 | 套件 | 說明 |
|------|------|------|
| ORM / migration | `prisma`, `@prisma/client` | type-safe，CLI 管 schema 與 migration |
| 認證 | `next-auth@beta`（Auth.js v5）Credentials provider | JWT session、httpOnly cookie；middleware 保護路由 |
| 密碼雜湊 | `bcryptjs` | 帳密驗證 |
| 媒體上傳 | `@vercel/blob` | server 端上傳，本地用 `BLOB_READ_WRITE_TOKEN` |
| Markdown 渲染 | `react-markdown`（+ `remark-gfm`） | FAQ / 簡介等富文字 |
| 表單驗證 | `zod` + `react-hook-form` | Server Action 與表單共用 schema |
| 後台 UI | 沿用既有 shadcn/ui + Tailwind | 視需要補 `input`、`textarea`、`dialog`、`table` 等元件 |

> 認證替代方案（若不想用 Auth.js）：自刻 `jose`（JWT）+ `bcryptjs` + httpOnly cookie，更輕量但要自己處理 session 續期。預設採 Auth.js v5。

---

## 4. 資料模型（Prisma schema 草案）

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Supabase pooled (6543)
  directUrl = env("DIRECT_URL")     // Supabase direct (5432), migrate 用
}

// ---- 帳號（多帳號、同權限）----
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ---- 課程表 ----
model SchedulePeriod {
  id        String       @id @default(cuid())
  date      DateTime     // 上課日期
  courses   CourseSlot[]
  createdAt DateTime     @default(now())
  @@index([date])
}
model CourseSlot {
  id         String         @id @default(cuid())
  period     SchedulePeriod @relation(fields: [periodId], references: [id], onDelete: Cascade)
  periodId   String
  startTime  String         // "14:00"
  endTime    String         // "15:00"
  name       String         // "Bachata Lv1"
  cardType   String?        // "初階課卡" / "進階課卡"
  sortOrder  Int            @default(0)
}

// ---- 師資 ----
model Teacher {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  title       String?
  imageUrl    String
  instagram   String?
  skills      String[] // Postgres 原生陣列
  courses     String[]
  description String[] // 多段簡介
  videos      String[] // YouTube embed 連結
  sortOrder   Int      @default(0)
  published   Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}

// ---- 學生推薦 ----
model Testimonial {
  id         String   @id @default(cuid())
  name       String
  title      String   // "核心沒力的跳舞小白"
  imageUrl   String
  danceStyle String   // "Bachata & Salsa"
  content    String[] // 多段
  sortOrder  Int      @default(0)
  published  Boolean  @default(true)
}

// ---- 價格 ----
model PricingTier {
  id                String   @id @default(cuid())
  title             String
  subtitle          String
  note              String
  sortOrder         Int      @default(0)
  applicableCourses Json     // [{ name, colorScheme: 'sky'|'orange' }]
  options           Json     // [{ name, price }]
}

// ---- FAQ ----
model Faq {
  id        String  @id @default(cuid())
  question  String
  answer    String  // Markdown（含連結）
  sortOrder Int     @default(0)
  published Boolean @default(true)
}

// ---- 單例設定（首頁影片等全站設定）----
model SiteSetting {
  key   String @id   // 例： "hero_video_url"
  value String
}
```

> 設計備註：`skills/courses/description/videos/content` 用 Postgres `String[]`；
> `applicableCourses/options` 結構較自由，用 `Json`。
> 全站單一值（首頁影片網址）用 key-value 的 `SiteSetting`，未來新增設定不必改 schema。

---

## 5. 資料搬遷（seed）

寫 `prisma/seed.ts`，把現有寫死資料一次匯入 DB，確保上線時內容與現況一致：
- `COURSE_PERIODS` + `COURSES` → `SchedulePeriod` + `CourseSlot`（每個日期都先塞同一份 COURSES）
- `TEACHERS` → `Teacher`（slug 沿用 key，如 `sean`）
- `Testimonials.tsx` 陣列 → `Testimonial`
- `PRICING_TIERS` → `PricingTier`
- FAQ 陣列 → `Faq`（JSX 答案**手動轉成 Markdown**，連結改 `[文字](網址)`）
- Hero 影片網址 → `SiteSetting('hero_video_url')`
- 建立第一個 `User`（業主帳號，密碼 bcrypt 雜湊）

搬遷後，原本的 `src/data/*.ts` 與寫死陣列保留一版做為對照，待前台改接 DB、驗證無誤後再移除。

---

## 6. 認證設計（Auth.js v5）

- Credentials provider：email + 密碼，`bcrypt.compare` 驗證。
- Session 策略：JWT（存 httpOnly cookie），免額外 session 表。
- `middleware.ts`：攔截 `/admin/*`（除 `/admin/login`），未登入轉登入頁。
- 帳號管理：`/admin/users` 可新增帳號（同權限）；第一個帳號由 seed 建立。
- 環境變數：`AUTH_SECRET`（隨機字串）。

---

## 7. 媒體上傳（Vercel Blob）

- 後台上傳元件 → Server Action → `put()` 到 Blob → 回傳 URL 存進對應欄位（`imageUrl` / `hero_video_url`）。
- 本地開發需 `BLOB_READ_WRITE_TOKEN`（Vercel 專案 → Storage → Blob 取得）。
- 既有 `/public` 圖片維持不動；只有後台新上傳走 Blob。
- 限制檔案大小／類型（圖片 jpg/png/webp、影片 mp4），於 Server Action 驗證。

---

## 8. 前台改造（client → server + ISR）

每個頁面：
1. 改成 server component（或拆出 server 包 client 的互動部分，如 Schedule 的日期切換、Testimonials 的輪播仍是 client，但資料由 server 傳入 props）。
2. 用 Prisma 在 server 端讀資料。
3. 寫入時於 Server Action 內 `revalidatePath('/對應路徑')`，讓 ISR 立即更新。
4. 對應關係：
   - `/courses` ← SchedulePeriod/CourseSlot、PricingTier
   - `/teachers`、`/teachers/[slug]` ← Teacher（`generateStaticParams` 改由 DB 產生 slug）
   - `/`（Hero / Testimonials / FAQ）← SiteSetting、Testimonial、Faq

> 注意：互動元件（輪播、手風琴、日期選擇）保持 client，但**資料當 props 傳入**，不要在 client 直接打 DB。

---

## 9. 分階段實作路線圖

> 每個 Phase 都是一個可獨立執行的 session 任務。建議順序如下。

### Phase 0：基礎建設（一次性）✅ 已完成（2026-06-18）
- [x] 加 `prisma`、`@prisma/client`（用 Prisma **6**，非 7）、Auth.js v5、bcryptjs、zod、tsx
- [x] 寫 `prisma/schema.prisma`（第 4 節）
- [x] `.env` 設 `DATABASE_URL` / `DIRECT_URL`（Supabase，見第 10 節）
- [x] `prisma migrate dev` 建表（migration: `prisma/migrations/..._init`，建在 `bailamore` schema）
- [x] 寫 `prisma/seed.ts` 並執行（第 5 節）— 已匯入：課程表 6 期、師資 1、推薦 4、價格 2、FAQ 8、影片 1
- [x] 裝 Auth.js + bcryptjs，建 `src/auth.ts` / `src/auth.config.ts` / `src/middleware.ts` / `/admin/login` / 登入登出 server actions
- [x] 建後台框架：`src/app/(panel)/layout.tsx`（側邊欄 + 登出 + 守衛）、`/admin` 儀表板
- [x] 公開頁移入 `src/app/(site)/` route group（URL 不變），root layout 不再套 Navbar/Footer
- [x] 端到端驗證：正確/錯誤密碼登入、middleware 守衛皆通過

> **管理員帳號**（seed 建立）：`j606888@gmail.com` / 密碼 `bailamore2026`（**請盡早改密碼**，Phase 4 會做帳號管理頁；或重設 `SEED_ADMIN_PASSWORD` 重跑 seed）。
>
> **Supabase 連線重點（踩雷紀錄）**：
> - Direct connection（`db.<ref>.supabase.co:5432`）**只走 IPv6**，本機無 IPv6 會連不上 → 改用 **pooler（IPv4）**。
> - 本專案 pooler 主機是 **`aws-1-ap-northeast-1`**（不是 aws-0），帳號 `postgres.<projectref>`。
> - `DATABASE_URL`=Transaction pooler(6543, `pgbouncer=true`)；`DIRECT_URL`=Session pooler(5432)。兩條都帶 `schema=bailamore`。
> - 密碼含 `!` `*` 要 URL 編碼（`%21` `%2A`）。
> - Auth.js v5 自架/`next start` 需 `trustHost: true`（已設於 `auth.config.ts`）。

### Phase 1：課程表 + 師資（最高頻）✅ 已完成（2026-06-18）
- [x] `/admin/schedule`：新增/編輯/刪除上課日期與時段課程，「複製上一期」
- [x] `/admin/teachers`：列表 + 新增/編輯/刪除，圖片上傳、多段簡介、YouTube 連結、排序
- [x] 前台 `/courses`（schedule 區）、`/teachers`、`/teachers/[slug]` 改接 DB + ISR
- [x] 驗證後移除對應寫死資料（`src/data/schedule.ts`、`src/data/teachers.ts` 已刪除）

> **Phase 1 實作重點 / 踩雷紀錄**：
> - 新增套件 `@vercel/blob`（師資頭像上傳）。`next.config.ts` 加 `images.remotePatterns` 允許 `*.public.blob.vercel-storage.com`。
> - **`BLOB_READ_WRITE_TOKEN` 仍為空**：上傳按鈕會回傳提示，可先直接在頭像欄位貼圖片網址（既有 `/teachers/*.jpg` 維持可用）。要測上傳需先到 Vercel → Storage → Blob 取 token 填入 `.env`。
> - 共用讀取層在 `src/lib/queries.ts`；日期工具在 `src/lib/date.ts`。`server-only` 套件未安裝，故 queries 不 import 它（僅由 server 端使用）。
> - **課表日期時區**：使用者輸入的日期存成「當日 UTC 正午」（`2026-08-02T12:00:00Z`），在各時區渲染都落在同一日曆日；顯示一律以 `Asia/Taipei` 格式化（見 `src/lib/date.ts`）。
> - 課表改為 **per-period**：每個日期有自己的 `CourseSlot`；「複製上一期」會抓日期早於新日期且最接近的一期（無則取最新一期）的課程。
> - 前台互動元件（`Schedule.tsx` 日期切換）維持 client，資料由 server page 以 props 傳入（`SchedulePeriodView`）。
> - `/teachers/[slug]` 的 `generateStaticParams` 改由 DB 產 slug，並設 `dynamicParams = true`（新增師資免重新 build 即可造訪）。頁面設 `revalidate = 3600` 作時間型 ISR 保險，存檔的 Server Action 內 `revalidatePath` 即時更新。
> - 寫入操作（save/delete/move/createPeriod/savePeriod）皆為 Server Action，存檔後 `revalidatePath('/teachers' | '/teachers/<slug>' | '/courses')`。
> - `prisma/seed.ts` 已把課表/師資初始資料改為**內嵌**（不再 import `src/data`），確保刪檔後 seed 仍可用於全新 DB 首次匯入。
> - 後台側欄「課程表」「師資」已開放（`ready: true`）。
> - 端到端驗證：前台三頁讀 DB、`/admin` 守衛、「複製上一期」建立→前台出現→刪除、師資列表與編輯表單預填皆通過。

### Phase 2：學生推薦 + 價格 ✅ 已完成（2026-06-19）
- [x] `/admin/testimonials`：CRUD + 頭像上傳 + 排序
- [x] `/admin/pricing`：CRUD（含 applicableCourses tag、options）
- [x] 前台 Testimonials、`/courses`（pricing 區）改接 DB + ISR
- [x] 驗證後移除最後一份寫死資料（`src/data/pricing.ts` 已刪除，`src/data/` 已清空）

> **Phase 2 實作重點 / 踩雷紀錄**：
> - `PricingTier` 新增 `published Boolean @default(true)` 欄位（migration `..._add_pricing_published`），與 `Testimonial` 一致，後台可隱藏方案；前台查詢 `getPublishedPricingTiers()` 只取 `published: true`。
> - 後台模組比照 Phase 1 師資：`actions.ts`（Server Action + zod + `revalidatePath` + `redirect`）、`*Form.tsx`（`useActionState`）、`*RowActions.tsx`（上/下移交換 `sortOrder`、刪除 `window.confirm`）、`page/new/[id]/edit`。共用元件沿用 `src/components/admin/form.tsx`。
> - **價格的巢狀 Json 欄位**（`applicableCourses` `[{name,colorScheme}]`、`options` `[{name,price}]`）在 `PricingForm` 用 `useState` 陣列做動態增刪列（課程標籤含 sky/orange 下拉、方案含 number 價格），送出前各以 hidden input 帶 `JSON.stringify`；Server Action `JSON.parse` 後用 zod 驗證（colorScheme enum、`z.coerce.number()`、過濾空白項），讀取時從 Prisma `Json` `as` 回具體型別。
> - 學生推薦頭像上傳沿用 `uploadImage`（Blob 路徑改 `testimonials/`）；`BLOB_READ_WRITE_TOKEN` 仍為空，測試時直接貼 `/testimonials/*.png` 網址即可。
> - 前台：首頁 `src/app/(site)/page.tsx` 改 `async` + `revalidate=3600`，`getPublishedTestimonials()` map 成 props（DB `imageUrl`→元件 `image`）傳給維持 client 輪播的 `Testimonials`；`Pricing` 改吃 `tiers` props（型別 `PricingTierView` 由元件 export），`/courses` page 以 `Promise.all` 同時取 schedule 與 pricing。
> - `prisma/seed.ts` 已把 `PRICING_TIERS` 內嵌（不再 import `src/data/pricing`），刪檔後 seed 仍可用於全新 DB；testimonials 早已內嵌。
> - 後台側欄「學生推薦」「價格」已開放（`ready: true`）。
> - 驗證：`yarn lint`（僅既有 useEffect warning）、`yarn build`（`/`、`/courses` 為 ISR 1h，後台路由 dynamic）、`npx tsx prisma/seed.ts` 皆通過。

### Phase 3：首頁影片 + FAQ ✅ 已完成（2026-06-19）
- [x] `/admin/hero`：上傳/更換影片（Blob）
- [x] `/admin/faq`：CRUD，答案用 Markdown 編輯器
- [x] 前台 Hero、FAQ 改接 DB + ISR（FAQ 用 react-markdown）

> **Phase 3 實作重點 / 踩雷紀錄**：
> - 新增套件 `react-markdown` + `remark-gfm`（FAQ 答案以 Markdown 字串存 DB、前台渲染）。**不需改 schema、不需 migration**（`Faq`、`SiteSetting` 在 Phase 0 已建好）。
> - **FAQ 後台**比照 Phase 1/2 師資/推薦：`actions.ts`（Server Action + zod + `revalidatePath('/')` + `revalidatePath('/admin/faq')` + `redirect`）、`FaqForm.tsx`（`useActionState`，答案用 `<textarea>`）、`FaqRowActions.tsx`（上/下移交換 `sortOrder`、刪除 `window.confirm`）、`page/new/[id]/edit`。共用元件沿用 `src/components/admin/form.tsx`。
> - **FAQ 前台**（`src/components/home/FAQ.tsx`）維持 `'use client'` 手風琴，但移除寫死陣列、改吃 `faqs: {id,question,answer}[]` props；`openIds` 由 `Set<number>` 改 `Set<string>`（id 為 cuid）。答案用 `ReactMarkdown` + `remarkGfm` 渲染，`components.a` 套 `text-teal-600 underline`，**外部連結（`https?://`）才加 `target="_blank"`/`rel`**，內部相對路徑（`/courses`、`/location`）不加；`components.p` 沿用 `text-gray-700 mb-2 last:mb-0` 段落樣式。
> - **首頁影片**是 `SiteSetting` key-value 單例：`/admin/hero` 用 `prisma.siteSetting.upsert({ where: { key: 'hero_video_url' } })`，**單例頁面不需 new/edit/list 子路由**。`saveHeroVideo` 存檔後回傳 `{ ok: true }` state（留在原頁顯示「已儲存」並可看影片預覽），不 redirect。`videoUrl` 用 `z.string().trim().min(1)`（**不用 `.url()`**，以容許相對路徑/既有 Blob 網址）。
> - 影片上傳 `uploadHeroVideo` 沿用推薦的 `uploadImage` 寫法，但型別限 `video/mp4`、大小上限放寬到 200MB、Blob 路徑改 `hero/`。`BLOB_READ_WRITE_TOKEN` 仍為空屬預期 → 上傳回提示，可先直接貼網址。
> - Hero 前台（`src/components/home/Hero.tsx`，server component）新增 `videoUrl: string` prop 取代寫死 `<source src>`。
> - 首頁 `src/app/(site)/page.tsx` 以 `Promise.all` 同時取 `getPublishedTestimonials()` / `getPublishedFaqs()` / `getHeroVideoUrl()`，分別傳 props（`revalidate=3600` 已存在）。查詢層 `src/lib/queries.ts` 新增 `getPublishedFaqs/getAllFaqs/getFaqById` 與 `getSiteSetting(key)/getHeroVideoUrl()`。
> - 後台側欄「首頁影片」「FAQ」已開放（`ready: true`）。
> - 驗證：`yarn lint`（僅既有 Testimonials useEffect warning）、`yarn build`（`/` 為 ISR 1h，`/admin/faq`、`/admin/hero` 等後台路由 dynamic）、`npx tsx prisma/seed.ts`（FAQ 8 則 + 影片）皆通過。

### Phase 4：帳號管理 + 收尾
- [ ] `/admin/users`：新增/刪除帳號、改密碼
- [ ] 移除全部殘留寫死資料與 `src/data/*` 對照檔
- [ ] 正式站資料庫（Neon）建立、環境變數、seed 上線資料

---

## 10. 開發環境（Supabase）

不使用本地 Docker。資料庫託管在 **Supabase**（線上免費 Postgres）。業主會建立專案後提供連線字串。

建立步驟（業主端）：
1. supabase.com 建立專案，記住 DB 密碼。
2. 專案 → Settings → Database → Connection string，取兩條：
   - **Pooled**（port 6543，給 app runtime / serverless 用）→ `DATABASE_URL`
   - **Direct**（port 5432，給 Prisma migrate 用）→ `DIRECT_URL`

Prisma datasource 需同時設定（pooler 不支援 migrate）：
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled, ?pgbouncer=true
  directUrl = env("DIRECT_URL")     // direct, migrate 用
}
```

`.env.local`（或 `.env`）需要：
```
DATABASE_URL="postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...@...supabase.com:5432/postgres"
AUTH_SECRET="（用 openssl rand -base64 32 產生）"
BLOB_READ_WRITE_TOKEN="（從 Vercel Blob 取得，做媒體上傳時才需要）"
```

> 資料表也可直接在 Supabase 後台 Table Editor / SQL Editor 檢視，等同先前 Adminer 的角色。
> 建議 dev / prod 用兩個 Supabase 專案隔離；初期也可共用一個再分。

---

## 11. 正式站部署（Vercel）

- 資料庫用 Supabase（正式站專案）。
- Vercel 環境變數：`DATABASE_URL`（pooled）、`DIRECT_URL`（direct）、`AUTH_SECRET`、`BLOB_READ_WRITE_TOKEN`。
- build 流程加 `prisma generate`（package.json `postinstall` 或 build script），上線用 `prisma migrate deploy`。
- 首次上線跑一次 seed 匯入現有內容。
- ISR：頁面設 `export const revalidate = <秒數>`，並在 Server Action 寫入後 `revalidatePath()` 即時更新。

---

## 12. 風險與注意事項

- **FAQ JSX → Markdown**：搬遷時需人工確認每則答案的連結正確（LINE、課程資訊、地點頁）。
- **課程表 per-period**：資料模型比現況彈性（每期可不同），seed 時先全部塞同一份避免落差。
- **互動元件**：Schedule/Testimonials 的 client 邏輯不要改壞，只把資料來源換成 props。
- **`generateStaticParams`**：teachers 動態路由改由 DB 產 slug，注意 build 時 DB 要可連線（或改成 `dynamicParams`）。
- **媒體**：先確認 Blob token 才能測上傳；圖片大小/格式要驗證。
- **commit 時機**：依專案慣例，未經業主同意不主動 commit / push。

---

## 13. 下一步（建議在新 session 執行）

從 **Phase 0** 開始：安裝 Prisma、建 schema、跑 migration、寫 seed、接 Auth.js。
完成後再進 **Phase 1（課程表 + 師資）**。
本地 Docker DB 已就緒，可直接 `docker compose up -d` 後開工。
