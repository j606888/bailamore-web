import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import VenueDetail from '@/components/location/VenueDetail';
import { getTracksByVenue } from '@/components/courses/schedule/data';
import { getVenue } from '@/data/venues';
import { breadcrumbJsonLd, venueJsonLd } from '@/lib/jsonLd';

const venue = getVenue('kaohsiung');
const tracks = getTracksByVenue('kaohsiung');

export const metadata: Metadata = {
  title: '高雄 Bachata 課程・拉丁社交舞教室',
  description:
    'Baila’more 高雄教室每週四在三民區大昌二路的 Social hub 開課，教 Bachata 與 Kizomba 雙人舞。零基礎可上、不需自備舞伴，課後還有 mini social 可以練習。台南、高雄共用同一張課卡。',
  alternates: { canonical: '/location/kaohsiung' },
  openGraph: {
    title: "高雄 Bachata 課程・拉丁社交舞教室 | Baila'more",
    description:
      '每週四在高雄三民區開課的 Bachata / Kizomba 雙人舞課程。零基礎、無舞伴都可以報名，課後有 mini social 練習時間。',
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
          venueJsonLd(venue, tracks),
          breadcrumbJsonLd([
            { name: '首頁', path: '/' },
            { name: '上課地點', path: '/location' },
            { name: '高雄教室', path: '/location/kaohsiung' },
          ]),
        ]}
      />
      <VenueDetail
        venue={venue}
        tracks={tracks}
        eyebrow="高雄據點・Social hub"
        title="高雄拉丁舞課程"
        subtitle="每週四・Bachata & Kizomba"
        intro="Baila’more 高雄教室每週四晚上在三民區的 Social hub 開課，教 Bachata 與 Kizomba 雙人社交舞。零基礎、沒有舞伴都可以直接報名。"
        photo={{
          src: '/images/kaohsiung.jpg',
          alt: 'Baila’more 高雄教室 Social hub 的木地板舞蹈教室',
          caption: '高雄上課的場地——Social hub 的木地板舞蹈教室',
        }}
        notes={[
          {
            question: '課卡可以在台南用嗎？',
            answer: (
              <>
                可以。高雄週四與{' '}
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
              '課後 21:30 起的自由練習時間，放音樂、大家互相邀舞。學過的東西在這裡跳過一輪才會真的變成自己的。',
          },
        ]}
      />
    </>
  );
}
