import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getTracksByVenue } from '@/components/courses/schedule/data';
import { VENUES, type Venue } from '@/data/venues';

export const metadata: Metadata = {
  title: '上課地點・台南與高雄教室',
  description:
    "Baila'more 有兩個上課據點：台南教室（中西區・每週日、週二）與高雄教室（三民區・每週四）。兩地共用同一張課卡，零基礎、無舞伴都可以報名。",
  alternates: { canonical: '/location' },
  openGraph: {
    title: "上課地點・台南與高雄教室 | Baila'more",
    description:
      "Baila'more 台南（中西區・週日/週二）與高雄（三民區・週四）兩個據點的地址與交通資訊。",
    url: '/location',
  },
};

export default function LocationPage() {
  return (
    <div className="mx-auto flex flex-col items-center gap-8 px-3 py-6 md:max-w-4xl md:px-6">
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="台南・高雄"
        title="上課地點"
        subtitle="兩個據點，同一張課卡"
        className="py-2 md:py-4"
      />

      <p className="w-full text-base leading-relaxed text-gray-700">
        Baila’more 目前在台南與高雄各有一個固定據點。台南教室每週日與週二開課，高雄教室每週四開課，兩地共用同一張課卡，可以互相跑班。點下方卡片看該據點的完整地址、交通指引與課程時段。
      </p>

      <div className="grid w-full gap-4 md:grid-cols-2">
        {VENUES.map((venue) => (
          <VenueCard key={venue.slug} venue={venue} />
        ))}
      </div>
    </div>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  const tracks = getTracksByVenue(venue.slug);
  const days = tracks.map((t) => `每${t.dayZh}`).join('、');
  const courses = [...new Set(tracks.flatMap((t) => t.slots.map((s) => s.title)))];

  return (
    <Link
      href={`/location/${venue.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-gray-200 px-5 py-5 transition-colors hover:border-teal-600 hover:bg-slate-50"
    >
      <div className="flex flex-col leading-none">
        <span className="font-poppins text-2xl font-bold text-teal-600 md:text-3xl">
          {venue.cityEn}
        </span>
        <h2 className="mt-1.5 text-xl font-bold text-gray-900">
          {venue.city}
          {venue.district}
          <span className="ml-1 font-normal text-gray-500">・{venue.shortName}</span>
        </h2>
      </div>

      <p className="text-sm text-gray-600">{venue.addressFull}</p>

      <div className="flex flex-col gap-1 text-sm text-gray-700">
        <p>
          <span className="font-semibold">上課時間｜</span>
          {days}
        </p>
        <p>
          <span className="font-semibold">課程｜</span>
          {courses.join('、')}
        </p>
      </div>

      <span className="mt-auto pt-2 text-sm font-medium text-teal-600">
        看地址與地圖 →
      </span>
    </Link>
  );
}
