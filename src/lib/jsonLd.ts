// schema.org 結構化資料的 builder。
//
// 為什麼要有這個：Google 判斷「這間教室在哪個城市」主要靠 LocalBusiness 結構化資料，
// 純文字提到城市名的權重低很多。台南、高雄各自的據點頁都會掛一份。

import { SERVICE_AREAS, SITE_NAME, SITE_URL } from '@/constants/site';
import { LINKS } from '@/constants/links';
import type { Venue } from '@/data/venues';
import type { Faq } from '@/data/faq';
import type { Teacher } from '@/data/teachers';
import type { Track } from '@/components/courses/schedule/data';

/** JSON-LD 是自由格式的物件，值可以是巢狀物件／陣列。 */
export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

function absolute(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

/** 全站共用的品牌實體，掛在 root layout。其他 schema 用 @id 指回這裡。 */
export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "Baila'more",
    url: SITE_URL,
    logo: absolute('/logo.png'),
    image: absolute('/images/hero.jpg'),
    description:
      '台南與高雄的拉丁社交舞教室，教授 Bachata、Salsa 與 Kizomba，零基礎與單人報名皆可。',
    areaServed: SERVICE_AREAS.map((name) => ({
      '@type': 'City',
      name,
    })),
    sameAs: [LINKS.INSTAGRAM],
  };
}

/** '19:30–20:30' → { opens: '19:30', closes: '20:30' }。注意是 en dash（–）不是 hyphen。 */
function parseSlotTime(time: string): { opens: string; closes: string } | null {
  const [opens, closes] = time.split(/[–—-]/).map((s) => s.trim());
  if (!opens || !closes) return null;
  return { opens, closes };
}

const DAY_OF_WEEK: Record<string, string> = {
  SUNDAY: 'https://schema.org/Sunday',
  MONDAY: 'https://schema.org/Monday',
  TUESDAY: 'https://schema.org/Tuesday',
  WEDNESDAY: 'https://schema.org/Wednesday',
  THURSDAY: 'https://schema.org/Thursday',
  FRIDAY: 'https://schema.org/Friday',
  SATURDAY: 'https://schema.org/Saturday',
};

/** 由該據點的課程 track 推導營業時間：每個 track 取第一堂開始到最後一堂結束。 */
function openingHours(tracks: Track[]): JsonLd[] {
  return tracks.flatMap((track) => {
    const dayOfWeek = DAY_OF_WEEK[track.sessionLabelEn.toUpperCase()];
    const first = parseSlotTime(track.slots[0]?.time ?? '');
    const last = parseSlotTime(track.slots[track.slots.length - 1]?.time ?? '');
    if (!dayOfWeek || !first || !last) return [];
    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: first.opens,
        closes: last.closes,
      },
    ];
  });
}

/** 單一據點的 LocalBusiness。這是「高雄 Bachata」這類本地查詢真正吃的訊號。 */
export function venueJsonLd(venue: Venue, tracks: Track[]): JsonLd {
  const url = `${SITE_URL}/location/${venue.slug}`;
  const courses = [...new Set(tracks.flatMap((t) => t.slots.map((s) => s.title)))];

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': `${url}#localbusiness`,
    name: venue.name,
    url,
    parentOrganization: { '@id': ORGANIZATION_ID },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TW',
      addressRegion: venue.city,
      addressLocality: venue.district,
      streetAddress: venue.streetAddress,
      postalCode: venue.postalCode,
    },
    ...(venue.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.geo.lat,
        longitude: venue.geo.lng,
      },
    }),
    areaServed: { '@type': 'City', name: venue.city },
    openingHoursSpecification: openingHours(tracks),
    knowsAbout: courses,
    sameAs: [LINKS.INSTAGRAM],
    image: absolute('/images/hero.jpg'),
    hasMap: venue.mapLink,
  };
}

/**
 * 常見問題。
 * 註：Google 自 2023 起把 FAQ 複合式搜尋結果限縮到政府／醫療網站，
 * 這段不會長出摺疊式問答，但仍有助於理解頁面主題，成本也低。
 */
export function faqPageJsonLd(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // answer 是 Markdown，剝掉連結語法只留文字
        text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
      },
    })),
  };
}

export function teacherJsonLd(teacher: Teacher): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    url: `${SITE_URL}/teachers/${teacher.slug}`,
    image: absolute(teacher.imageUrl),
    jobTitle: teacher.title ?? '拉丁舞老師',
    description: teacher.description[0],
    knowsAbout: teacher.skills,
    worksFor: { '@id': ORGANIZATION_ID },
    ...(teacher.instagram && {
      sameAs: [`https://www.instagram.com/${teacher.instagram}`],
    }),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
