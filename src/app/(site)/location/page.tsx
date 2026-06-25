import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';

const VIDEO_URL =
  'https://ikhr8fc3iglih52q.public.blob.vercel-storage.com/%E6%8C%87%E5%BC%95%28%E5%AD%97%E5%B9%95%29.mp4';

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239.85183938333768!2d120.21063370455558!3d22.994232091187936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e768c1cdb6a8b%3A0x63cdd79f783bce5c!2z6JCs5piM6LW3576p!5e0!3m2!1szh-TW!2stw!4v1782357028566!5m2!1szh-TW!2stw';

export const metadata: Metadata = {
  title: '上課地點',
  description:
    "Baila'more 上課地點：丁宅（台南市中西區民族路二段57巷5號一帶）。導航請搜尋地標「萬昌起義」，教室在酒吧對面的住宅區、門牌 45 號入口。",
  openGraph: {
    title: "上課地點 | Baila'more",
    description:
      "Baila'more 全新據點「丁宅」位於台南市中西區。導航請搜尋「萬昌起義」，教室在酒吧對面住宅區，認準門牌 45 號。",
    url: '/location',
  },
};

export default function LocationPage() {
  return (
    <div className='mx-auto px-3 py-6 flex flex-col gap-8 items-center justify-center md:px-6 md:max-w-4xl'>
      {/* 頁首 */}
      <div className='flex flex-col items-center text-center'>
        <p className='text-sm font-semibold tracking-widest text-teal-600 md:text-base'>
          全新據點・丁宅
        </p>
        <h3 className='text-2xl font-bold md:text-4xl'>教室位置</h3>
        <p className='text-base text-gray-600 md:text-lg'>
          Baila&apos;more 上課地點
        </p>
      </div>

      {/* 入口照片：認門 */}
      <div className='w-full flex flex-col gap-3'>
        <div className='relative w-full aspect-[16/10] overflow-hidden rounded-xl shadow-sm md:aspect-[16/9]'>
          <Image
            src='/images/丁宅.jpg'
            alt='丁宅教室入口——門牌 45 號的鐵捲門與黑色格柵門'
            fill
            priority
            sizes='(min-width: 768px) 768px, 100vw'
            className='object-cover'
          />
        </div>
        <p className='text-center text-sm text-gray-600'>
          認準這扇門 ——{' '}
          <span className='font-bold text-gray-900'>門牌 45 號</span>{' '}
          的住宅入口（鐵捲門＋左側黑色格柵門）
        </p>
      </div>

      {/* 找路指引影片 */}
      <div className='w-full flex flex-col gap-3'>
        <div className='flex flex-col'>
          <h4 className='text-xl font-bold md:text-2xl'>跟著影片走，一次就找到</h4>
          <p className='text-sm text-gray-600'>
            從地標「萬昌起義」走到教室的完整指引（影片含字幕與語音，點擊即可播放）。
          </p>
        </div>
        <video
          controls
          preload='metadata'
          playsInline
          poster='/images/丁宅.jpg'
          className='mx-auto w-full max-w-sm rounded-xl bg-black shadow-sm'
        >
          <source src={VIDEO_URL} type='video/mp4' />
          您的瀏覽器不支援影片播放。
        </video>
      </div>

      {/* 強警告：別走錯到酒吧 */}
      <div className='w-full rounded-xl border-2 border-red-300 bg-red-50 p-4 md:p-5'>
        <div className='flex items-start gap-3'>
          <span className='text-2xl leading-none' aria-hidden='true'>
            ⚠️
          </span>
          <div className='flex flex-col gap-2'>
            <h4 className='text-lg font-bold text-red-700 md:text-xl'>
              我們不是酒吧！請別走進「萬昌起義」
            </h4>
            <p className='text-sm leading-relaxed text-red-900 md:text-base'>
              搜尋「萬昌起義」只是為了
              <span className='font-bold'>定位附近</span>
              。我們的教室{' '}
              <span className='font-bold'>不在酒吧裡面</span>
              ，而是在酒吧
              <span className='font-bold'>對面的住宅區</span>
              。請走到上方照片中那扇
              <span className='font-bold'>門牌 45 號</span>
              的住宅入口，
              <span className='font-bold'>千萬不要走進酒吧</span>
              ！
            </p>
          </div>
        </div>
      </div>

      {/* 如何抵達 + 地址 + 地圖 */}
      <div className='w-full flex flex-col gap-4 md:flex-row md:items-stretch'>
        {/* 左：步驟與地址 */}
        <div className='flex flex-col gap-4 w-full md:w-1/2'>
          <div className='flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4'>
            <p className='font-bold'>如何抵達</p>
            <ol className='flex flex-col gap-2 text-sm text-gray-700'>
              <li className='flex gap-2'>
                <span className='font-bold text-teal-600'>1.</span>
                <span>
                  Google 地圖搜尋地標{' '}
                  <span className='font-semibold text-gray-900'>「萬昌起義」</span>
                  （一間酒吧）。
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold text-teal-600'>2.</span>
                <span>
                  抵達後{' '}
                  <span className='font-semibold text-gray-900'>轉向對面的住宅區</span>
                  ，教室在酒吧正對面。
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='font-bold text-teal-600'>3.</span>
                <span>
                  找到{' '}
                  <span className='font-semibold text-gray-900'>門牌 45 號</span>{' '}
                  的住宅入口（即上方照片）即抵達。
                </span>
              </li>
            </ol>
          </div>

          <div className='flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-4'>
            <p className='font-bold'>導航地標與地址</p>
            <p className='text-sm text-gray-900'>萬昌起義（酒吧・導航用地標）</p>
            <p className='text-sm text-gray-600'>
              700 台南市中西區城隍里民族路二段 57 巷 5 號
            </p>
            <p className='mt-2 text-xs text-gray-500'>
              ※ 丁宅為後門入口、沒有獨立門牌地址，導航請一律搜尋「萬昌起義」。
            </p>
          </div>
        </div>

        {/* 右：地圖 */}
        <div className='w-full md:w-1/2'>
          <iframe
            title='教室位置地圖（地標：萬昌起義）'
            src={MAP_SRC}
            width='100%'
            height='100%'
            className='min-h-[280px] w-full rounded-lg border border-gray-200'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      </div>
    </div>
  );
}
