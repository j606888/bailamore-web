import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import IGIcon from '@/components/icons/IGIcon';
import { getPublishedTeacherSlugs, getTeacherBySlug } from '@/lib/queries';

export const revalidate = 3600;
// 新增師資後無需重新 build 也能造訪（DB 即時）
export const dynamicParams = true;

export async function generateStaticParams() {
  const teachers = await getPublishedTeacherSlugs();
  return teachers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);
  if (!teacher) return {};
  const desc = teacher.description[0]?.slice(0, 160) ?? '';
  return {
    title: `${teacher.name}${teacher.title ? `（${teacher.title}）` : ''}`,
    description: desc,
    openGraph: {
      title: `${teacher.name} — 師資介紹 | Baila'more`,
      description: desc,
      url: `/teachers/${slug}`,
    },
  };
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = await getTeacherBySlug(slug);

  if (!teacher || !teacher.published) {
    notFound();
  }

  return (
    <div className="mx-auto px-3 py-6 flex flex-col gap-6 justify-center md:max-w-3xl md:gap-9">
      <Link href="/teachers" className='text-sm text-[#4B5563] underline flex items-center gap-1'>
        <Image src="/icons/chevron-left.svg" alt="chevron-left" width={16} height={16} />
        返回教師列表
      </Link>
      <div className='flex gap-3 items-center md:m-auto md:flex-col md:gap-6'>
        <div className='relative w-[92px] h-[92px] md:w-[180px] md:h-[180px]'>
          <Image src={teacher.imageUrl} alt={teacher.name} fill className='object-cover rounded-full' />
        </div>
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-baseline gap-1'>
            <h2 className='text-2xl font-bold md:text-4xl'>{teacher.name}</h2>
            {teacher.title && <span className='text-sm text-gray-500 font-bold md:text-xl'>({teacher.title})</span>}
          </div>
          <div className='flex flex-wrap gap-2'>
            {teacher.skills.map((skill) => (
              <div key={skill} className='text-xs text-white bg-teal-600 px-2 py-1 rounded-2xl md:text-base md:px-4 md:py-1 md:rounded-3xl'>{skill}</div>
            ))}
          </div>
          {teacher?.instagram && (
            <Link href={`https://www.instagram.com/${teacher.instagram}`} target='_blank' rel='noopener noreferrer' className='text-sm text-[#666666] underline flex items-center gap-1 md:text-lg'>
              <IGIcon className='w-4 h-4 md:w-6 md:h-6' color='#666666' />
              @{teacher.instagram}
            </Link>
          )}
        </div>
      </div>
      <div className='w-full max-w-[350px] bg-gray-100 rounded-lg p-3 md:max-w-full md:p-6'>
        <div className='hidden md:block text-xl font-bold mb-3'>
          關於{teacher.name}
        </div>
        {teacher.description.map((desc, index) => (
          <p key={index} className='text-[#373737]'>{desc}</p>
        ))}
      </div>
      <div className='w-full max-w-[350px]'>
        <p className='text-[#373737] mb-2 font-bold'>授課項目</p>
        <div className='flex flex-wrap gap-2'>
          {teacher.courses.map((course) => (
            <div key={course} className='text-xs text-white bg-teal-600 px-3 py-2 rounded-md'>{course}</div>
          ))}
        </div>
      </div>
      <div className='w-full max-w-[350px]'>
        <p className='text-[#373737] mb-2 font-bold'>舞蹈展示</p>
        <div className='flex flex-wrap gap-2'>
          {teacher.videos.map((video, index) => (
            <div key={index} className="relative w-full" style={{ paddingBottom: '100%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={video}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
