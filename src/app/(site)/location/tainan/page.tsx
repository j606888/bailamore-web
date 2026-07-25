import type { Metadata } from 'next';
import React from 'react';
import JsonLd from '@/components/JsonLd';
import VenueDetail from '@/components/location/VenueDetail';
import { getTracksByVenue } from '@/components/courses/schedule/data';
import { getVenue } from '@/data/venues';
import { breadcrumbJsonLd, venueJsonLd } from '@/lib/jsonLd';

const VIDEO_URL =
  'https://ikhr8fc3iglih52q.public.blob.vercel-storage.com/%E6%8C%87%E5%BC%95%28%E5%AD%97%E5%B9%95%29.mp4';

const venue = getVenue('tainan');
const tracks = getTracksByVenue('tainan');

export const metadata: Metadata = {
  title: '台南拉丁舞教室・上課地點',
  description:
    "Baila'more 台南教室「丁宅」位於台南市中西區民族路二段57巷5號一帶，每週日與週二開設 Bachata、Salsa 課程。導航請搜尋地標「萬昌起義」，教室在酒吧對面的住宅區、門牌 45 號入口。",
  alternates: { canonical: '/location/tainan' },
  openGraph: {
    title: "台南拉丁舞教室・上課地點 | Baila'more",
    description:
      "Baila'more 台南據點「丁宅」位於台南市中西區，每週日、週二開課。導航請搜尋「萬昌起義」，教室在酒吧對面住宅區，認準門牌 45 號。",
    url: '/location/tainan',
  },
};

export default function TainanLocationPage() {
  return (
    <>
      <JsonLd
        data={[
          venueJsonLd(venue, tracks),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '上課地點', path: '/location' },
            { name: '台南教室', path: '/location/tainan' },
          ]),
        ]}
      />
      <VenueDetail
        venue={venue}
        tracks={tracks}
        eyebrow="台南據點・丁宅"
        title="台南教室位置"
        subtitle="Baila'more 台南上課地點"
        intro="Baila’more 台南教室「丁宅」位在台南市中西區，每週日與每週二固定開設 Bachata、Salsa 課程。不需舞伴、零基礎都可以直接報名。"
        photo={{
          src: '/images/丁宅.jpg',
          alt: '丁宅教室入口——門牌 45 號的鐵捲門與黑色格柵門',
          caption: (
            <>
              認準這扇門 ——{' '}
              <span className="font-bold text-gray-900">門牌 45 號</span>{' '}
              的住宅入口（鐵捲門＋左側黑色格柵門）
            </>
          ),
        }}
      >
        {/* 找路指引影片 */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold md:text-2xl">跟著影片走，一次就找到</h2>
            <p className="text-sm text-gray-600">
              從地標「萬昌起義」走到教室的完整指引（影片含字幕與語音，點擊即可播放）。
            </p>
          </div>
          <video
            controls
            preload="metadata"
            playsInline
            poster="/images/丁宅.jpg"
            className="mx-auto w-full max-w-sm rounded-xl bg-black shadow-sm"
          >
            <source src={VIDEO_URL} type="video/mp4" />
            您的瀏覽器不支援影片播放。
          </video>
        </div>

        {/* 強警告：別走錯到酒吧 */}
        <div className="w-full rounded-xl border-2 border-red-300 bg-red-50 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none" aria-hidden="true">
              ⚠️
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-red-700 md:text-xl">
                我們不是酒吧！請別走進「萬昌起義」
              </h2>
              <p className="text-sm leading-relaxed text-red-900 md:text-base">
                搜尋「萬昌起義」只是為了
                <span className="font-bold">定位附近</span>
                。我們的教室{' '}
                <span className="font-bold">不在酒吧裡面</span>
                ，而是在酒吧
                <span className="font-bold">對面的住宅區</span>
                。請走到上方照片中那扇
                <span className="font-bold">門牌 45 號</span>
                的住宅入口，
                <span className="font-bold">千萬不要走進酒吧</span>
                ！
              </p>
            </div>
          </div>
        </div>

        {/* 如何抵達 */}
        <div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
          <h2 className="font-bold">如何抵達</h2>
          <ol className="flex flex-col gap-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-teal-600">1.</span>
              <span>
                Google 地圖搜尋地標{' '}
                <span className="font-semibold text-gray-900">「萬昌起義」</span>
                （一間酒吧）。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600">2.</span>
              <span>
                抵達後{' '}
                <span className="font-semibold text-gray-900">轉向對面的住宅區</span>
                ，教室在酒吧正對面。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-teal-600">3.</span>
              <span>
                找到{' '}
                <span className="font-semibold text-gray-900">門牌 45 號</span>{' '}
                的住宅入口（即上方照片）即抵達。
              </span>
            </li>
          </ol>
        </div>
      </VenueDetail>
    </>
  );
}
