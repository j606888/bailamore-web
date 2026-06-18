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

### Phase 1：課程表 + 師資（最高頻）
- [ ] `/admin/schedule`：新增/編輯/刪除上課日期與時段課程，「複製上一期」
- [ ] `/admin/teachers`：列表 + 新增/編輯/刪除，圖片上傳、多段簡介、YouTube 連結、排序
- [ ] 前台 `/courses`（schedule 區）、`/teachers`、`/teachers/[slug]` 改接 DB + ISR
- [ ] 驗證後移除對應寫死資料

### Phase 2：學生推薦 + 價格
- [ ] `/admin/testimonials`：CRUD + 頭像上傳 + 排序
- [ ] `/admin/pricing`：CRUD（含 applicableCourses tag、options）
- [ ] 前台 Testimonials、`/courses`（pricing 區）改接 DB + ISR

### Phase 3：首頁影片 + FAQ
- [ ] `/admin/hero`：上傳/更換影片（Blob）
- [ ] `/admin/faq`：CRUD，答案用 Markdown 編輯器
- [ ] 前台 Hero、FAQ 改接 DB + ISR（FAQ 用 react-markdown）

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
