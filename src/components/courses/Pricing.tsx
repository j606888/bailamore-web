'use client'

import React from 'react';

export default function Schedule() {
  return (
    <div className='px-3 py-6 md:px-6 bg-gray-100 flex flex-col gap-3 md:gap-6'>
      <div className='flex flex-col rounded-lg overflow-hidden md:max-w-xl shadow-sm'>
        <div className='bg-teal-600 px-4 py-3 flex flex-col text-white'>
          <p className='font-bold text-lg'>Lv1 課程</p>
          <p className='text-sm'>適合初學者的基礎課程</p>
        </div>
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='單堂體驗' price={300} />
          <hr />
          <Course name='6堂課程' price={1700} />
        </div>
        <div className='bg-[#EAF5F4] px-3 py-3'>
          <p className='text-sm'>*可插班，沒使用完畢可用於下一期</p>
        </div>
      </div>
      <div className='flex flex-col rounded-lg overflow-hidden md:max-w-xl shadow-sm'>
        <div className='bg-teal-600 px-4 py-3 flex flex-col text-white'>
          <p className='font-bold text-lg'>Lv2, 中階課程</p>
          <p className='text-sm'>進階技巧與舞步</p>
        </div>
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='單堂體驗' price={350} />
          <hr />
          <Course name='6堂課程' price={2000} />
        </div>
        <div className='bg-[#EAF5F4] px-3 py-3'>
          <p className='text-sm'>*可插班，沒使用完畢可用於下一期</p>
        </div>
      </div>
      <div className='flex flex-col rounded-lg overflow-hidden md:max-w-xl shadow-sm'>
        <div className='bg-teal-600 px-4 py-3 flex flex-col text-white'>
          <p className='font-bold text-lg'>Lady Style</p>
          <p className='text-sm'>打造妳獨一無二的舞台魅力</p>
        </div>
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='8堂課程' price={2800} />
        </div>
      </div>
    </div>
  );
}

const Course = ({ name, price }: { name: string, price: number }) => {
  return (
    <div className='flex justify-between items-center'>
      <div className='text-base font-bold'>{name}</div>
      <span className='text-base font-bold'>${price}</span>
    </div>
  )
}