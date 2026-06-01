import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TEACHERS } from '@/data/teachers';

export const metadata: Metadata = {
  title: '師資介紹',
  description: "認識 Baila'more 的舞蹈老師團隊。專業拉丁舞教學，陪伴你從零開始學習 Bachata 與 Salsa。",
  openGraph: {
    title: "師資介紹 | Baila'more",
    description: "認識 Baila'more 的舞蹈老師團隊。專業拉丁舞教學，陪伴你從零開始學習 Bachata 與 Salsa。",
    url: '/teachers',
  },
};

export default function CoursesPage() {
  return (
    <>
      <div className="mx-auto px-3 py-6 flex flex-col gap-6 items-center justify-center md:px-6">
        <div className='flex flex-col items-center'>
          <h3 className='text-2xl font-bold md:text-4xl'>師資介紹</h3>
          <p className='text-base md:text-lg'>認識我們團隊</p>
        </div>
        <div className='flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center'>
          {Object.entries(TEACHERS).map(([slug, teacher]) => (
            <Link key={slug} href={`/teachers/${slug}`} className='w-full max-w-[350px] h-[350px] relative cursor-pointer'>
              <Image src={teacher.image} alt={teacher.name} fill className='object-cover rounded-lg' />
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
