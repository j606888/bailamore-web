import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VenueDetail from '@/components/location/VenueDetail';
import { getTracksByCity, getTracksByVenue } from '@/components/courses/schedule/data';
import { getVenuesByCity } from '@/data/venues';
import { breadcrumbJsonLd, venueJsonLd } from '@/lib/jsonLd';

// 高雄有兩間教室：週二 24steps（新興區）、週四 Social hub（三民區）
const venues = getVenuesByCity('kaohsiung');
const tracks = getTracksByCity('kaohsiung');

export const metadata: Metadata = {
  title: '高雄 Bachata 課程・拉丁社交舞教室',
  description:
    'Baila’more 高雄教室每週二在新興區的 24steps 開 Salsa、Kizomba，每週四在三民區大昌二路的 Social hub 開 Bachata。零基礎可上、不需自備舞伴，週四課後還有 mini social 可以練習。台南、高雄共用同一張課卡。',
  alternates: { canonical: '/location/kaohsiung' },
  openGraph: {
    title: "高雄 Bachata 課程・拉丁社交舞教室 | Baila'more",
    description:
      '高雄每週二（新興區 24steps）Salsa / Kizomba、每週四（三民區 Social hub）Bachata 雙人舞課程。零基礎、無舞伴都可以報名。',
    url: '/location/kaohsiung',
    images: [
      {
        url: '/images/kaohsiung.jpg',
        width: 792,
        height: 570,
        alt: 'Baila’more 高雄教室 Social hub 的舞蹈教室',
      },
    ],
  },
};

export default function KaohsiungLocationPage() {
  return (
    <>
      <JsonLd
        data={[
          ...venues.map((venue) => venueJsonLd(venue, getTracksByVenue(venue.slug))),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '上課地點', path: '/location' },
            { name: '高雄教室', path: '/location/kaohsiung' },
          ]),
        ]}
      />
      <VenueDetail
        venues={venues}
        tracks={tracks}
        eyebrow="高雄據點・24steps・Social hub"
        title="高雄拉丁舞課程"
        subtitle="每週二 Salsa & Kizomba・每週四 Bachata"
        intro="Baila’more 高雄有兩間教室：每週二晚上在新興區的 24steps 上 Salsa 與 Kizomba，每週四晚上在三民區的 Social hub 上 Bachata。零基礎、沒有舞伴都可以直接來上課。"
        photo={{
          src: '/images/kaohsiung.jpg',
          alt: 'Baila’more 高雄教室 Social hub 的木地板舞蹈教室',
          caption: '高雄週四上課的場地——Social hub 的木地板舞蹈教室',
        }}
        notes={[
          {
            question: '課卡可以在台南用嗎？',
            answer: (
              <>
                可以。高雄週二、週四與{' '}
                <Link
                  href="/location/tainan"
                  className="font-medium text-teal-600 underline-offset-2 hover:underline"
                >
                  台南週日
                </Link>{' '}
                共用同一張課卡，兩邊都能上，用不完也可以留到下一期。
              </>
            ),
          },
          {
            question: 'mini social 是什麼？',
            answer:
              '週四在 Social hub 課後 21:30 起的自由練習時間，放音樂、大家互相邀舞。學過的東西在這裡跳過一輪才會真的變成自己的。週二 24steps 沒有 mini social。',
          },
        ]}
      />
    </>
  );
}
