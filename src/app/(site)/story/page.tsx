import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import {
  NAME_INTRO,
  NAME_WORDS,
  NAME_RESULT,
  NAME_MEANING,
  NAME_TAGLINE,
  LOGOTYPE_INTRO,
  LOGOTYPE_LETTERS,
} from '@/data/story';

const DESCRIPTION =
  "Baila'more 的名字藏著 Bailar（跳舞）、Amor（愛）、More（更多）。認識我們的品牌故事，以及標準字裡 I、O、R 的設計精神。";

export const metadata: Metadata = {
  title: '品牌故事',
  description: DESCRIPTION,
  alternates: { canonical: '/story' },
  openGraph: {
    title: "品牌故事 | Baila'more",
    description: DESCRIPTION,
    url: '/story',
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

export default function StoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-16 md:px-6 md:gap-24 md:py-10">
      <SectionHeading
        as="h1"
        eyebrow="About Baila'more"
        title="品牌故事"
        subtitle="因為愛上跳舞，所以想要更多"
        size="lg"
        className="py-2 md:py-4"
      />

      <section className="flex flex-col gap-8 md:gap-10">
        <SectionHeading eyebrow="第一章" title="Baila'more，從名字開始" />
        <Paragraphs items={NAME_INTRO} className="text-center text-gray-700 md:text-lg" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {NAME_WORDS.map((word) => (
            <div key={word.title} className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-3xl font-bold text-teal-600">{word.title}</h3>
              <p className="text-sm font-semibold tracking-widest text-gray-500">{word.subtitle}</p>
              <Paragraphs items={word.paragraphs} className="text-gray-700" />
            </div>
          ))}
        </div>

        {/* 於是：三個字相加成為 Baila'more */}
        <div className="flex flex-col items-center gap-4 py-6 text-center md:py-10">
          <p className="text-gray-500">於是：</p>
          <p className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            {NAME_WORDS.map((word, i) => (
              <span key={word.title}>
                {i > 0 && <span className="mx-2 text-teal-600 md:mx-4">+</span>}
                {word.title}
              </span>
            ))}
          </p>
          <p className="text-xl font-bold text-gray-900 md:text-2xl">{NAME_RESULT}</p>
          <p className="mt-4 whitespace-pre-line leading-loose text-gray-600 md:text-lg">{NAME_MEANING}</p>
        </div>

        <div className="grid grid-cols-2 border-y border-gray-200 md:grid-cols-4">
          {NAME_TAGLINE.map((rest, i) => (
            <div
              key={rest}
              className={`flex flex-col gap-1 px-4 py-6 md:px-6 md:py-8 ${i % 2 === 1 ? 'border-l border-gray-200' : ''} ${i >= 2 ? 'border-t border-gray-200 md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">More</span>
              <span className="text-2xl font-extrabold text-gray-900 md:text-3xl">{rest}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8 md:gap-10">
        <SectionHeading eyebrow="第二章" title="而這份精神，也藏進了 Baila'more 的標準字" />
        <Paragraphs items={LOGOTYPE_INTRO} className="text-center text-gray-700 md:text-lg" />

        <div className="flex flex-col gap-6">
          {LOGOTYPE_LETTERS.map((item) => (
            <div
              key={item.letter}
              className="grid grid-cols-1 gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:grid-cols-[160px_1fr] md:gap-8 md:p-8"
            >
              {/* 字母取自網站 Logo（public/logo-letters/，從 bailamore_green.svg 切出），三個字母等高 */}
              <div className="relative h-24 w-full md:h-36">
                <Image
                  src={`/logo-letters/${item.letter.toLowerCase()}.svg`}
                  alt={`Baila'more 標準字的 ${item.letter}`}
                  fill
                  sizes="160px"
                  className="object-contain object-left md:object-center"
                />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">{item.title}</h3>
                <Paragraphs items={item.paragraphs} className="text-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 text-center">
        <p className="text-gray-700 md:text-lg">兩週年，我們把這些故事做成了可以穿、可以戴、可以帶著走的東西。</p>
        <Button asChild size="lg">
          <Link href="/merch">看周邊商品 →</Link>
        </Button>
      </section>
    </div>
  );
}
