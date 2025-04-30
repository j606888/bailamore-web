'use client'
import React from 'react';
import Callout from '@/components/Callout';
export default function LocationPage() {
  return (
    <div className='mx-auto px-3 py-6 flex flex-col gap-6 items-center justify-center md:px-6 md:max-w-4xl'>
      <div className='flex flex-col items-center'>
        <h3 className='text-2xl font-bold md:text-4xl'>教室位置</h3>
        <p className='text-base md:text-lg'>Baila&apos;more 上課地點</p>
      </div>
      <div className='flex flex-col bg-gray-100 rounded-lg px-3 py-4 w-full gap-3'>
        <div className='flex gap-2 items-center'>
          <img src='/icons/info.svg' alt='info' className='w-4 h-4' />
          <p className='font-bold'>關於我們的教室</p>
        </div>
        <p className='text-[#374151]'>
          Baila&apos;more Studio 目前與 About Dancing Studio 合作，租用其專業舞蹈空間進行拉丁舞課程教學。About Dancing Studio 擁有優質的舞蹈環境，包括專業木質地板、全身鏡面牆、高品質音響設備等，為學員提供最佳的學習體驗。
        </p>
        <p className='text-[#374151]'>
        教室分為 A、B 兩個獨立空間，兩個空間的入口相距約 20 公尺。A 教室較大，主要用於人數較多的課程；B 教室較小，適合小班制或私人課程。請依照課程表上標示的教室前往正確的位置上課。
        </p>
        <Callout title='溫馨提醒' description='初次到訪的同學可能會找不到入口，建議提前 10-15 分鐘抵達，或觀看下方影片了解如何抵達各教室。' />
      </div>
      <div className='flex flex-col gap-3 md:flex-row w-full items-start'>
        <div className='flex flex-col border border-gray-100 rounded-md px-3 py-4 w-full gap-3'>
          <p className='font-bold'>地址位置</p>
          <div>
            <p className='text-sm'>About dancing studio</p>
            <p className='text-[#374151] text-sm'>704台南市北區長北街71號</p>
          </div>
        </div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.6141254968898!2d120.20133761186423!3d23.001212917036284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e7704a0b5dd3b%3A0xef34d966efb0f3f2!2zQWJvdXQgZGFuY2luZyBzdHVkaW8g5bCI5qWt6KGX6Iie5pWZ5a6k!5e0!3m2!1szh-TW!2stw!4v1746000601841!5m2!1szh-TW!2stw" 
            width="100%" 
            height="300" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
