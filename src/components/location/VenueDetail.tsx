import Image from 'next/image';
import Link from 'next/link';
import IGIcon from '@/components/icons/IGIcon';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';
import type { Venue } from '@/data/venues';
import { PRICE_PLANS, type Track } from '@/components/courses/schedule/data';

// 台南／高雄兩個據點頁共用的版面。
// 順序固定為：標題 → 場地照片 → 找路內容 → 地址地圖 → 課表 → 小須知 → 報名，
// 讓「地點在哪」最快被看到，說明性的文字往後放。
type Props = {
  venue: Venue;
  tracks: Track[];
  eyebrow: string;
  title: string;
  subtitle: string;
  /** 標題下方的一段話，承載該城市的關鍵字。保持精簡。 */
  intro?: string;
  /** 場地照片 */
  photo?: { src: string; alt: string; caption?: React.ReactNode };
  /** 地圖之前插入的據點特有內容（台南的指引影片、酒吧警告、三步驟） */
  children?: React.ReactNode;
  /** 課表之後的小須知 */
  notes?: { question: string; answer: React.ReactNode }[];
};

export default function VenueDetail({
  venue,
  tracks,
  eyebrow,
  title,
  subtitle,
  intro,
  photo,
  children,
  notes,
}: Props) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8 px-3 py-6 md:max-w-4xl md:px-6">
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        className="py-2 md:py-4"
      />

      {intro && (
        <p className="w-full text-base leading-relaxed text-gray-700">{intro}</p>
      )}

      {photo && (
        <div className="flex w-full flex-col gap-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-sm md:aspect-[16/9]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {photo.caption && (
            <p className="text-center text-sm text-gray-600">{photo.caption}</p>
          )}
        </div>
      )}

      {children}

      {/* 地址 + 地圖 */}
      <section className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-4">
            <h2 className="text-lg font-bold md:text-xl">地址</h2>
            <address className="not-italic text-sm text-gray-900">
              {venue.addressFull}
            </address>
            {venue.navNote && (
              <p className="mt-2 text-sm text-gray-600">{venue.navNote}</p>
            )}
            {venue.addressNote && (
              <p className="mt-2 text-xs text-gray-500">※ {venue.addressNote}</p>
            )}
            <a
              href={venue.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-sm font-medium text-teal-600 underline-offset-2 hover:underline"
            >
              用 Google 地圖導航 →
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <iframe
            title={`${venue.name}位置地圖`}
            src={venue.mapEmbedSrc}
            width="100%"
            height="100%"
            className="min-h-[280px] w-full rounded-lg border border-gray-200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* 該據點的課表 */}
      <section className="flex w-full flex-col gap-4">
        <h2 className="text-xl font-bold md:text-2xl">
          {venue.city}的固定課程
        </h2>
        <div className="flex flex-col gap-4">
          {tracks.map((track) => (
            <TrackSummary key={track.id} track={track} />
          ))}
        </div>
        <Link
          href="/courses?tab=schedule"
          className="text-sm font-medium text-teal-600 underline-offset-2 hover:underline"
        >
          查看完整月課表與場次日期 →
        </Link>
      </section>

      {/* 小須知 */}
      {notes && notes.length > 0 && (
        <section className="flex w-full flex-col gap-4">
          <h2 className="text-xl font-bold md:text-2xl">小須知</h2>
          <dl className="flex flex-col gap-4">
            {notes.map((note) => (
              <div
                key={note.question}
                className="rounded-xl border border-gray-200 px-4 py-4"
              >
                <dt className="font-bold text-gray-900">{note.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-gray-700 md:text-base">
                  {note.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 報名 CTA */}
      <section className="flex w-full flex-col items-center gap-3 rounded-xl bg-slate-50 px-4 py-8 text-center">
        <h2 className="text-xl font-bold md:text-2xl">想來{venue.city}上課？</h2>
        <p className="max-w-md text-sm text-gray-600 md:text-base">
          不需舞伴、零基礎都可以報名。直接 Instagram 私訊我們，或在上課時間到教室現場體驗。
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link
            href={LINKS.INSTAGRAM_DM}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="hover:cursor-pointer">
              <IGIcon className="h-6 w-6" color="#ffffff" />
              IG 私訊報名
            </Button>
          </Link>
          <Link href={LINKS.PRICING}>
            <Button size="lg" variant="outline" className="hover:cursor-pointer">
              了解費用
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function TrackSummary({ track }: { track: Track }) {
  const plan = PRICE_PLANS.find((p) => p.id === track.pricePlanId);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 px-4 py-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-lg font-bold text-gray-900">
          每{track.dayZh}・{track.cityZh}
        </h3>
        {track.badge && (
          <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-bold text-white">
            {track.badge}
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-1.5 text-sm text-gray-700 md:text-base">
        {track.slots.map((slot) => (
          <li key={slot.time} className="flex gap-3">
            <span className="font-poppins font-bold tabular-nums text-teal-600">
              {slot.time}
            </span>
            <span>{slot.title}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-600">
        💲 {track.priceSummary}
        {plan && (
          <>
            {' '}
            <Link
              href={`/courses?tab=pricing#${plan.id}`}
              className="font-medium text-teal-600 underline-offset-2 hover:underline"
            >
              （{plan.name}）
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
