import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedTeachers } from '@/data/teachers';
import SectionHeading from '@/components/SectionHeading';
import IGIcon from '@/components/icons/IGIcon';
import type { Teacher } from '@/data/teachers';

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

// 卡片整張可點進老師頁，IG 連結則直接開 IG。
// <a> 不能巢狀，所以用「撐滿的連結」：名字的 Link 以 after:absolute inset-0 蓋住整張卡（卡片是 relative），IG 連結再用 z-10 浮在上面。
const STRETCHED_LINK = "after:absolute after:inset-0 after:content-['']";

const InstagramLink = ({ teacher }: { teacher: Teacher }) =>
  teacher.instagram ? (
    <a
      href={`https://www.instagram.com/${teacher.instagram}`}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={`${teacher.name} 的 Instagram`}
      className='relative z-10 inline-flex w-fit items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 hover:underline'
    >
      <IGIcon className='w-4 h-4' color='currentColor' />
      @{teacher.instagram}
    </a>
  ) : null;

const CourseTags = ({ courses }: { courses: string[] }) => (
  <div className='flex gap-2 flex-wrap'>
    {courses.map((item) => (
      <div key={item} className='text-xs text-white bg-teal-600 px-3 py-2 rounded-md'>{item}</div>
    ))}
  </div>
);

export default function TeachersPage() {
  const teachers = getPublishedTeachers();
  // 前兩位（sortOrder 最小）是主打的橫向大卡，其餘排成直式卡片，桌機一排三張。
  const featured = teachers.slice(0, 2);
  const rest = teachers.slice(2);

  return (
    <>
      <div className="max-w-6xl mx-auto px-3 py-6 flex flex-col gap-6 items-center justify-center md:px-6 md:gap-8">
        <SectionHeading
          as='h1'
          eyebrow='認識我們團隊'
          title='師資介紹'
          subtitle='五位老師、五種風格，陪你從第一步跳到舞池中央'
          size='lg'
          className='py-2 md:py-4'
        />

        <div className='w-full grid gap-6 grid-cols-1 lg:grid-cols-2'>
          {featured.map((teacher, index) => (
            <div
              key={teacher.slug}
              className='relative grid grid-cols-1 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-shadow duration-200 hover:shadow-lg group'
            >
              <div className='relative h-[280px] sm:h-auto sm:min-h-[320px]'>
                <Image
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  fill
                  priority={index === 0}
                  sizes='(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw'
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col justify-center gap-3.5 p-6 md:p-7'>
                <div>
                  <h3 className='text-2xl font-bold md:text-3xl'>
                    <Link href={`/teachers/${teacher.slug}`} className={STRETCHED_LINK}>
                      {teacher.name}
                    </Link>
                  </h3>
                  {teacher.title && <p className='mt-1 text-sm text-gray-500'>{teacher.title}</p>}
                </div>
                <InstagramLink teacher={teacher} />
                <CourseTags courses={teacher.courses} />
                {teacher.description[0] && (
                  <p className='text-sm text-gray-600 leading-relaxed line-clamp-3'>{teacher.description[0]}</p>
                )}
                <span className='text-sm font-medium text-teal-600 group-hover:underline'>認識 {teacher.name} →</span>
              </div>
            </div>
          ))}
        </div>

        <div className='w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {rest.map((teacher) => (
            <div
              key={teacher.slug}
              className='relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-shadow duration-200 hover:shadow-lg'
            >
              <div className='relative aspect-[4/5] bg-gray-100'>
                <Image
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  fill
                  sizes='(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw'
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col gap-2.5 px-5 pt-4 pb-5'>
                <h3 className='text-xl font-bold'>
                  <Link href={`/teachers/${teacher.slug}`} className={STRETCHED_LINK}>
                    {teacher.name}
                  </Link>
                  {teacher.title && <span className='text-sm font-normal text-gray-500'>（{teacher.title}）</span>}
                </h3>
                <InstagramLink teacher={teacher} />
                <CourseTags courses={teacher.courses} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
