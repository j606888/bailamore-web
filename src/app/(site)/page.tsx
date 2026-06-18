import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import WhoWeAre from '@/components/home/WhoWeAre';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';

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
  return (
    <>
      <Hero />
      <WhoWeAre />
      <Testimonials />
      <FAQ />
    </>
  );
}
