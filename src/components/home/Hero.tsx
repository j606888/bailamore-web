import IGIcon from "@/components/icons/IGIcon";
import { Button } from "../ui/button";
import Link from "next/link";
import { LINKS } from "@/constants/links";

const Hero = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div className="px-5 py-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-6 md:max-w-7xl md:mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 md:w-[420px] md:items-start md:flex-shrink-0">
        <h1 className="font-poppins text-2xl font-bold mb-1 md:text-5xl">
          第一次跳舞，
          <br className="hidden md:block" />
          就從這裡開始
        </h1>

        <p className="text-base max-w-2xl text-center md:text-left md:text-md">
          沒舞伴、沒經驗都沒關係，來試一次
          <br className="md:hidden" />
          Bachata，說不定你會愛上。
        </p>
        {/* 主按鈕指向報名頁（現在開放哪些場次一目了然），IG 私訊降為次要。
            「了解費用」改成文字連結，避免三顆按鈕在手機上擠成三行。 */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href={LINKS.ENROLL}>
              <Button size="lg" className="hover:cursor-pointer">
                立即報名
              </Button>
            </Link>
            <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
              <Button
                className="hover:cursor-pointer"
                size="lg"
                variant="outline"
              >
                <IGIcon className="w-6 h-6" color="#009689" />
                IG 私訊詢問
              </Button>
            </Link>
          </div>
          <Link
            href={LINKS.PRICING}
            className="text-sm font-medium text-teal-600 underline-offset-2 hover:underline md:text-base"
          >
            了解費用 →
          </Link>
        </div>
      </div>
      <div className="w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* <picture>
        <source srcSet="/images/hero-large.jpg" media="(min-width: 640px)" />
        <img
          src="/images/hero.jpg"
          alt="Dance class background"
          className="object-cover w-full rounded-xl"
          loading="lazy"
          width={1200}
          height={800}
        />
      </picture> */}
    </div>
  );
};

export default Hero;
