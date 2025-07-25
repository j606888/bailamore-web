'use client'

import React from 'react';
import { useParams } from 'next/navigation';
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
  kathy: {
    name: 'Kathy',
    image: '/teachers/Kathy.jpg',
    skills: ['Lady Style', 'Bachata', 'Salsa'],
    courses: ['Lady Style', 'Bachata Lv2', 'Bachata 中階'],
    instagram: 'kathy_latin_bachata',
    description: [
      'Kathy 擁有豐富的舞蹈背景，是一位兼具優雅與力量的舞者。擅長 Bachata、國標舞（Ballroom Dance）、拉丁舞（Latin Dance）及 Sexy Style，風格多變，充滿舞台魅力。除了擔任 Bachata 與 Salsa 課程的助教外，Kathy 也專門教授 Lady Styling，協助學員從身體線條到氣場自信全面提升。',
      '身為一位專業的國標舞者，Kathy 對舞蹈的細節與表現力有極高的要求，擅長以溫柔耐心的方式引導學員，讓初學者也能自在展現舞姿之美。她相信舞蹈不只是技巧的呈現，更是身體與情感的連結。',
      '加入 Baila’more 後，Kathy 致力於打造支持與成長並重的學習環境，陪伴每位學員在舞蹈路上綻放屬於自己的光芒！',
    ],
    videos: [
      "https://www.youtube.com/embed/AE5NriBseoY?si=5u75-CtAGmvwPtVn",
      "https://www.youtube.com/embed/3SbhPZ9-qN0?si=Gt2mpLE9EqFicI8A"
    ],
  },
  angus: {
    name: 'Angus',
    image: '/teachers/Angus.jpg',
    skills: ['Salsa'],
    courses: ['Salsa Lv1', 'Salsa Lv2'],
    description: [
      'Angus曾在台北各大舞蹈教室學習，師承Magda、YiWen、Larry、Sol等知名老師，並多次參與國內外Salsa活動及教學，致力將不同老師的教學內容融合，走出自己的舞蹈風格！',
      'Angus learned Salsa with Magda, Larry, and Sol, and other top dancing studios of Taiwan for four years. Also, he joined many global salsa festivals and workshops. After he moves back to Kaohsiung, he wants to promote Salsa in south Taiwan and will do his best to share everything he learned.',
    ],
    videos: ["https://www.youtube.com/embed/dVxiFav_Z58?si=ZA16L7qQWs4NUUls"]
  }
};

export default function TeacherPage() {
  const params = useParams();
  const teacher = TEACHERS[params.slug as keyof typeof TEACHERS];

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="mx-auto px-3 py-6 flex flex-col gap-6 justify-center md:max-w-3xl md:gap-9">
      <Link href="/teachers" className='text-sm text-[#4B5563] underline flex items-center gap-1'>
        <img src="/icons/chevron-left.svg" alt="chevron-left" className='w-4 h-4' />
        返回教師列表
      </Link>
      <div className='flex gap-3 items-center md:m-auto md:flex-col md:gap-6'>
        <div className='w-[92px] h-[92px] md:w-[180px] md:h-[180px]'>
          <img src={teacher.image} alt={teacher.name} className='w-full h-full object-cover rounded-full' />
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
            <div  key={index} className="relative w-full" style={{ paddingBottom: '100%' }}>
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