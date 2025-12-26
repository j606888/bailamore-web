'use client'

import React from 'react';
import Link from 'next/link';

export default function CoursesPage() {

  return (
    <>
      <div className="mx-auto px-3 py-6 flex flex-col gap-6 items-center justify-center md:px-6">
        <div className='flex flex-col items-center'>
          <h3 className='text-2xl font-bold md:text-4xl'>師資介紹</h3>
          <p className='text-base md:text-lg'>認識我們團隊</p>
        </div>
        <div className='flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center'>
          <Link href="/teachers/sean" className='w-full max-w-[350px] h-[350px] relative cursor-pointer'>
            <img src='/teachers/Sean.jpg' alt='Sean' className='w-full h-full object-cover rounded-lg' />
            <div className='absolute bottom-3 left-3 right-3 bg-white/80 rounded-lg p-3'>
              <h3 className='text-xl font-bold mb-1'>
                Sean
                <span className='text-sm text-gray-500'>（Baila&apos;more創辦人）</span>
              </h3>
              <div className='flex gap-2'>
                {['Bachata Lv1', 'Bachata Lv2', 'Bachata 中階'].map((item) => (
                  <div key={item} className='text-xs text-white bg-teal-600 p-2 rounded-md'>{item}</div>
                ))}
              </div>
            </div>
          </Link>
          <Link href="/teachers/kathy" className='w-full max-w-[350px] h-[350px] relative cursor-pointer'>
            <img src='/teachers/Kathy.jpg' alt='Kathy' className='w-full h-full object-cover rounded-lg' />
            <div className='absolute bottom-3 left-3 right-3 bg-white/80 rounded-lg p-3'>
              <h3 className='text-xl font-bold mb-1'>
                Kathy
              </h3>
              <div className='flex gap-2'>
                {['Lady Style', 'Bachata Lv2', 'Bachata 中階'].map((item) => (
                  <div key={item} className='text-xs text-white bg-teal-600 p-2 rounded-md'>{item}</div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
} 