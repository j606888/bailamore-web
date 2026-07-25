import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import { getPublishedTestimonials } from '@/data/testimonials';
import { getPublishedFaqs } from '@/data/faq';
import { HERO_VIDEO_URL } from '@/data/site';

export const metadata: Metadata = {
  title: "Baila'more 拉丁舞教室",
  description: "台南 Bachata & Salsa 社交舞教室。不需舞伴、零基礎歡迎，每週日於台南定期開課。",
  openGraph: {
    title: "Baila'more 拉丁舞教室",
    description: "台南 Bachata & Salsa 社交舞教室。不需舞伴、零基礎歡迎，每週日於台南定期開課。",
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

  const faqsData = getPublishedFaqs().map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <Hero videoUrl={HERO_VIDEO_URL} />
      <WhoWeAre />
      <Testimonials testimonials={testimonialsData} />
      <FAQ faqs={faqsData} />
    </>
  );
}
