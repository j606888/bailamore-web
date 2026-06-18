import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import { getPublishedTestimonials, getPublishedFaqs, getHeroVideoUrl } from '@/lib/queries';

// 首頁影片、學生推薦、FAQ 皆由 DB 提供，存檔後以 revalidatePath('/') 即時更新。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Baila'more 拉丁舞教室",
  description: "台南 Bachata & Salsa 社交舞教室。不需舞伴、零基礎歡迎，每週日於台南定期開課。",
  openGraph: {
    title: "Baila'more 拉丁舞教室",
    description: "台南 Bachata & Salsa 社交舞教室。不需舞伴、零基礎歡迎，每週日於台南定期開課。",
    url: '/',
  },
};

export default async function Home() {
  const [testimonials, faqs, heroVideoUrl] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedFaqs(),
    getHeroVideoUrl(),
  ]);

  const testimonialsData = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    title: t.title,
    image: t.imageUrl,
    content: t.content,
    danceStyle: t.danceStyle,
  }));

  const faqsData = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <Hero videoUrl={heroVideoUrl ?? ''} />
      <WhoWeAre />
      <Testimonials testimonials={testimonialsData} />
      <FAQ faqs={faqsData} />
    </>
  );
}
