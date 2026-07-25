import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';
import { getPublishedTeacherSlugs } from '@/data/teachers';
import { getVenueSlugs } from '@/data/venues';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/courses', priority: 0.9 },
    { path: '/location', priority: 0.8 },
    { path: '/teachers', priority: 0.7 },
  ];

  // 據點頁是城市關鍵字（台南／高雄）的落地頁，優先度拉高
  const venueRoutes = getVenueSlugs().map(({ slug }) => ({
    path: `/location/${slug}`,
    priority: 0.9,
  }));

  const teacherRoutes = getPublishedTeacherSlugs().map(({ slug }) => ({
    path: `/teachers/${slug}`,
    priority: 0.6,
  }));

  return [...staticRoutes, ...venueRoutes, ...teacherRoutes].map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })
  );
}
