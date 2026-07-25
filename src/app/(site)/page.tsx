import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import JsonLd from '@/components/JsonLd';
import { getPublishedTestimonials } from '@/data/testimonials';
import { getPublishedFaqs } from '@/data/faq';
import { HERO_VIDEO_URL } from '@/data/site';
import { faqPageJsonLd } from '@/lib/jsonLd';

const HOME_DESCRIPTION =
  '台南・高雄的 Bachata & Salsa 社交舞教室。台南每週日、週二，高雄每週四定期開課，零基礎歡迎、不需舞伴即可報名。';

export const metadata: Metadata = {
  // 用 absolute 避開 layout 的 "%s | Baila'more" template，否則品牌名會出現兩次
  title: { absolute: "Baila'more｜台南・高雄拉丁舞教室 Bachata & Salsa" },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: "Baila'more｜台南・高雄拉丁舞教室 Bachata & Salsa",
    description: HOME_DESCRIPTION,
    url: '/',
  },
};

export default function Home() {
  const testimonialsData = getPublishedTestimonials().map((t) => ({
    id: t.id,
    name: t.name,
    title: t.title,
    image: t.imageUrl,
    content: t.content,
    danceStyle: t.danceStyle,
  }));

  const faqs = getPublishedFaqs();
  const faqsData = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <Hero videoUrl={HERO_VIDEO_URL} />
      <WhoWeAre />
      <Testimonials testimonials={testimonialsData} />
      <FAQ faqs={faqsData} />
    </>
  );
}
