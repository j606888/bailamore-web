import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedTeachers } from '@/data/teachers';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: '師資介紹',
  description: "認識 Baila'more 的舞蹈老師團隊。台南與高雄的專業拉丁舞教學，陪伴你從零開始學習 Bachata 與 Salsa。",
  alternates: { canonical: '/teachers' },
  openGraph: {
    title: "師資介紹 | Baila'more",
    description: "認識 Baila'more 的舞蹈老師團隊。台南與高雄的專業拉丁舞教學，陪伴你從零開始學習 Bachata 與 Salsa。",
    url: '/teachers',
  },
};

export default function TeachersPage() {
  const teachers = getPublishedTeachers();
  // 第一位（sortOrder 最小）以橫幅大卡呈現，其餘排成等寬卡片列。
  const [featured, ...rest] = teachers;

  return (
    <>
      <div className="max-w-6xl mx-auto px-3 py-6 flex flex-col gap-6 items-center justify-center md:px-6 md:gap-8">
        <SectionHeading
          as='h1'
          eyebrow='認識我們團隊'
          title='師資介紹'
          subtitle='四位老師、四種風格，陪你從第一步跳到舞池中央'
          size='lg'
          className='py-2 md:py-4'
        />

        {featured && (
          <Link
            href={`/teachers/${featured.slug}`}
            className='w-full grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-shadow duration-200 hover:shadow-lg group'
          >
            <div className='relative h-[280px] md:h-[360px]'>
              <Image
                src={featured.imageUrl}
                alt={featured.name}
                fill
                priority
                sizes='(min-width: 768px) 420px, 100vw'
                className='object-cover'
              />
            </div>
            <div className='flex flex-col justify-center gap-4 p-6 md:p-10'>
              <h3 className='text-2xl font-bold md:text-3xl'>
                {featured.name}
                {featured.title && <span className='text-sm font-normal text-gray-500 md:text-base'>（{featured.title}）</span>}
              </h3>
              <div className='flex gap-2 flex-wrap'>
                {featured.courses.map((item) => (
                  <div key={item} className='text-xs text-white bg-teal-600 px-3 py-2 rounded-md'>{item}</div>
                ))}
              </div>
              {featured.description[0] && (
                <p className='text-sm text-gray-600 leading-relaxed line-clamp-3 md:text-base'>{featured.description[0]}</p>
              )}
              <span className='text-sm font-medium text-teal-600 group-hover:underline'>認識 {featured.name} →</span>
            </div>
          </Link>
        )}

        {/* 其餘老師：桌機三欄、平板兩欄、手機單欄，卡片等寬填滿容器。 */}
        <div className='w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {rest.map((teacher) => (
            <Link
              key={teacher.slug}
              href={`/teachers/${teacher.slug}`}
              className='h-[350px] relative cursor-pointer group'
            >
              <Image
                src={teacher.imageUrl}
                alt={teacher.name}
                fill
                sizes='(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw'
                className='object-cover rounded-lg'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg' />
              <div className='absolute bottom-3 left-3 right-3 bg-white/80 rounded-lg p-3'>
                <h3 className='text-xl font-bold mb-1'>
                  {teacher.name}
                  {teacher.title && <span className='text-sm text-gray-500'>（{teacher.title}）</span>}
                </h3>
                <div className='flex gap-2 flex-wrap'>
                  {teacher.courses.map((item) => (
                    <div key={item} className='text-xs text-white bg-teal-600 p-2 rounded-md'>{item}</div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
