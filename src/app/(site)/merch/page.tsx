import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { MERCH_CHAPTERS, MERCH_CLOSING, type MerchItem } from '@/data/merch';

const DESCRIPTION =
  "Baila'more 兩週年周邊：不焦慮、狂漲粉、粉口愛、不焦橘、這樣紫、VAMOS 束口袋、R級讚賞襪。把跳舞教會我們的事，做成可以穿、可以戴、可以帶著走的東西。";

export const metadata: Metadata = {
  title: '周邊商品',
  description: DESCRIPTION,
  alternates: { canonical: '/merch' },
  openGraph: {
    title: "周邊商品 | Baila'more",
    description: DESCRIPTION,
    url: '/merch',
  },
};

// 原文是短句分行的散文，每段保留換行。
const Paragraphs = ({ items, className = '' }: { items: string[]; className?: string }) => (
  <div className={`flex flex-col gap-4 whitespace-pre-line leading-relaxed ${className}`}>
    {items.map((text) => (
      <p key={text}>{text}</p>
    ))}
  </div>
);

// 商品照還沒上傳時顯示灰底 placeholder（見 src/data/merch.ts）。
// 一律正方形，讓每張商品照在任何章節都一樣大。
const MerchImage = ({ item }: { item: MerchItem }) => (
  <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
    {item.imageUrl ? (
      <Image
        src={item.imageUrl}
        alt={item.name}
        fill
        sizes="(min-width: 768px) 360px, 100vw"
        className="object-cover"
      />
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
        {item.emoji && <span className="text-5xl">{item.emoji}</span>}
        <span className="text-sm">商品照即將上線</span>
      </div>
    )}
  </div>
);

const BuyButton = ({ item }: { item: MerchItem }) =>
  item.buyUrl ? (
    <Button asChild className="w-full">
      <Link href={item.buyUrl} target="_blank" rel="noopener noreferrer">
        立即購買
      </Link>
    </Button>
  ) : (
    <Button disabled className="w-full">
      即將開賣
    </Button>
  );

const ItemName = ({ item }: { item: MerchItem }) => (
  <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
    {item.emoji && <span className="mr-2">{item.emoji}</span>}
    {item.name}
  </h3>
);

const CARD = 'flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200';
// 桌機一律是三欄中的一欄寬（gap-6 × 2 = 3rem），兩個商品的章節置中排列。
const COLUMN_WIDTH = 'w-full md:w-[calc((100%-3rem)/3)]';

// 同章節多個商品：照片、名稱、文案、按鈕都在卡片裡，按鈕貼底對齊。
const MerchCard = ({ item }: { item: MerchItem }) => (
  <div id={item.slug} className={`${CARD} ${COLUMN_WIDTH}`}>
    <MerchImage item={item} />
    <div className="flex flex-1 flex-col gap-4 p-6">
      <ItemName item={item} />
      <Paragraphs items={item.lines} className="flex-1 text-gray-700" />
      <BuyButton item={item} />
    </div>
  </div>
);

// 一章只有一個商品（文案很長）：左邊是同尺寸的商品卡，捲動時跟著停在畫面上；右邊是文案。
const FeaturedMerch = ({ item }: { item: MerchItem }) => (
  <div id={item.slug} className="flex flex-col gap-6 md:flex-row md:items-start">
    <div className={`${CARD} ${COLUMN_WIDTH} md:sticky md:top-24 md:shrink-0`}>
      <MerchImage item={item} />
      <div className="flex flex-col gap-4 p-6">
        <ItemName item={item} />
        <BuyButton item={item} />
      </div>
    </div>
    <Paragraphs items={item.lines} className="flex-1 text-gray-700 md:px-4 md:text-lg" />
  </div>
);

// 「More」以主色強調。
const highlightMore = (text: string) => {
  const [head, tail] = text.split('More');
  return tail === undefined ? text : (
    <>
      {head}
      <strong className="font-semibold text-teal-600">More</strong>
      {tail}
    </>
  );
};

const Closing = () => {
  const c = MERCH_CLOSING;
  return (
    <>
      {/* 提問與「它讓我們」：桌機左右兩欄，手機上下 */}
      <section className="max-w-6xl mx-auto w-full px-4 pt-8 pb-16 grid grid-cols-1 gap-10 md:px-6 md:pt-16 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-5">
          <p className="text-sm font-semibold tracking-[0.2em] text-teal-700">CHAPTER 08</p>
          <h2 className="whitespace-pre-line text-3xl font-extrabold leading-snug text-gray-900 md:text-4xl">{c.title}</h2>
          <p className="leading-loose text-gray-600 md:text-lg">{c.before}</p>
          <p className="leading-loose text-gray-600 md:text-lg">{highlightMore(c.after)}</p>
        </div>
        <div className="flex flex-col md:col-start-7 md:col-span-6">
          <p className="mb-3 text-gray-500">它讓我們：</p>
          <ol className="border-b border-gray-200">
            {c.lessons.map((lesson, i) => (
              <li key={lesson} className="flex items-baseline gap-5 border-t border-gray-200 py-4">
                <span className="w-7 shrink-0 text-sm font-semibold text-teal-700">{String(i + 1).padStart(2, '0')}</span>
                <span className="whitespace-pre-line text-lg font-bold leading-relaxed text-gray-900 md:text-2xl">{lesson}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <p className="px-4 pb-20 text-center text-4xl font-extrabold tracking-wide text-teal-600 md:pb-28 md:text-8xl">{c.cheer}</p>

      {/* 收尾帶：Bailar / Amor / More 三欄 → 兩週年 → VAMOS */}
      <section className="bg-teal-50">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center gap-12 text-center md:px-6 md:py-28 md:gap-14">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-7xl">Bailar. Amor. More.</h2>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            {c.words.map((w) => (
              <div key={w.word} className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{w.word}</span>
                <span className="text-xl font-bold text-gray-900 md:text-2xl">{w.line}</span>
                <span className="text-gray-600">{w.more}</span>
              </div>
            ))}
          </div>
          <p className="max-w-xl whitespace-pre-line leading-loose text-gray-700 md:text-lg">{c.gift}</p>
          <p className="flex flex-col gap-1 text-lg font-semibold text-teal-800 md:flex-row md:gap-3 md:text-xl">
            {c.forLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <span className="mr-3 hidden text-teal-600 md:inline">·</span>}
                {line}
              </span>
            ))}
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="whitespace-pre-line leading-loose text-gray-700 md:text-lg">{c.send}</p>
            <p className="mt-2 text-7xl font-extrabold leading-none text-teal-600 md:text-9xl">VAMOS.</p>
            <p className="mt-3 text-gray-600">{c.sign}</p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/story">← 讀品牌故事</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default function MerchPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-16 md:px-6 md:gap-24 md:py-10">
        <SectionHeading
          as="h1"
          eyebrow="Baila'more 兩週年"
          title="周邊商品"
          subtitle="把跳舞教會我們的事，做成可以帶著走的東西"
          size="lg"
          className="py-2 md:py-4"
        />

        {MERCH_CHAPTERS.map((chapter) => (
          <section key={chapter.slug} id={chapter.slug} className="flex flex-col gap-8 md:gap-10">
            <SectionHeading eyebrow={chapter.eyebrow} title={chapter.title} />
            {chapter.intro && <Paragraphs items={chapter.intro} className="text-center text-gray-700 md:text-lg" />}
            {chapter.items.length === 1 ? (
              <FeaturedMerch item={chapter.items[0]} />
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {chapter.items.map((item) => (
                  <MerchCard key={item.slug} item={item} />
                ))}
                {/* 兩個商品時（帽子），共同文案補進第三欄 */}
                {chapter.outro && chapter.items.length === 2 && (
                  <Paragraphs
                    items={chapter.outro}
                    className={`${COLUMN_WIDTH} self-center py-4 text-gray-700 md:px-4 md:text-lg`}
                  />
                )}
              </div>
            )}
            {chapter.outro && chapter.items.length !== 2 && (
              <Paragraphs items={chapter.outro} className="text-center text-gray-700 md:text-lg" />
            )}
          </section>
        ))}
      </div>
      <Closing />
    </>
  );
}
