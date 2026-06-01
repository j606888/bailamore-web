import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import IGIcon from '@/components/icons/IGIcon';

type Teacher = {
  name: string;
  title?: string;
  image: string;
  skills: string[];
  instagram?: string;
  courses: string[];
  description: string[];
  videos: string[];
};

const TEACHERS: Record<string, Teacher> = {
  sean: {
    name: 'Sean',
    title: 'Baila\'more創辦人',
    image: '/teachers/Sean.jpg',
    skills: ['Bachata', 'Salsa', 'Zouk'],
    instagram: 'baila_moredancestudio',
    courses: ['Bachata Lv1', 'Bachata Lv2', 'Bachata 中階'],
    description: [
      "Sean 擁有二年的拉丁舞教學與表演經驗，專精於 Salsa 與 Bachata，風格融合熱情、音樂性與舞台魅力。曾多次參與國內外拉丁舞活動與工作坊，不僅擁有紮實的技術基礎，更擅長引導學員掌握節奏與身體表達。",
      "他創辦 Baila'more 拉丁社交舞學校，致力於推廣「愛跳舞、多跳舞」的理念，讓每位舞者在歡樂中找到自信與自由。Sean 教學風格親切細膩，擅長拆解動作，激發學員的學習熱情與音樂感，無論是初學者或進階者都能有所收穫。",
      "舞蹈對 Sean 而言不只是技藝，更是連結人與人之間的橋樑，歡迎一起進入這個充滿熱情與愛的舞蹈世界！",
    ],
    videos: ["https://www.youtube.com/embed/TdRV1NkV4Pg?si=MYwpQG-1ZlcPu1QD", "https://www.youtube.com/embed/AE5NriBseoY?si=5u75-CtAGmvwPtVn"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const teacher = TEACHERS[slug];
  if (!teacher) return {};
  return {
    title: `${teacher.name}${teacher.title ? `（${teacher.title}）` : ''}`,
    description: teacher.description[0].slice(0, 160),
    openGraph: {
      title: `${teacher.name} — 師資介紹 | Baila'more`,
      description: teacher.description[0].slice(0, 160),
      url: `/teachers/${slug}`,
    },
  };
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = TEACHERS[slug as keyof typeof TEACHERS];

  if (!teacher) {
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
          <Image src={teacher.image} alt={teacher.name} fill className='object-cover rounded-full' />
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
