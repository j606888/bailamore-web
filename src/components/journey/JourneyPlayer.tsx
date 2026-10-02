'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  CHAPTERS,
  JOURNEY_EVENTS,
  PLACE_LABEL,
  journeyCoverUrl,
  journeyDateLabel,
  journeyMedia,
  journeyMediaLabel,
  journeyYear,
  type JourneyEvent,
} from '@/data/journey';
import { LINKS } from '@/constants/links';
import { cn } from '@/lib/utils';

// 兩年回顧播放器。同一個元件兩種版面：
// - 手機：IG 限動（點左右切換、上方分段進度條、目錄從底部拉起）
// - 電腦：投影模式（大字、模糊背景、滑鼠移動才浮出控制列、全螢幕時自動循環）
// 一場活動可以有好幾則（照片／短片）：照片每則停 PHOTO_MS，短片播完才換下一則，
// 這一場的最後一則播完才進下一場。手機上方的分段進度條是「這一場的每一則」。

const PHOTO_MS = 5000;
const HIDE_UI_MS = 3000;
const EVENTS = JOURNEY_EVENTS;
const LAST = EVENTS.length - 1;
const YEARS = [2024, 2025, 2026];

const firstIndexOfYear = (year: number) =>
  Math.max(0, EVENTS.findIndex((e) => journeyYear(e) === year));

function chapterOf(event: JourneyEvent) {
  return CHAPTERS[journeyYear(event)];
}

export default function JourneyPlayer() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [idx, setIdx] = useState(0);
  const [frame, setFrame] = useState(0); // 這一場的第幾則
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true); // 瀏覽器只允許靜音自動播放，使用者按一下才開聲音
  const [progress, setProgress] = useState(0); // 0–1，這一則播到哪
  const [tocOpen, setTocOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const event = EVENTS[idx];
  const frames = journeyMedia(event);
  const current = frames[frame];
  const coverUrl = journeyCoverUrl(event);
  // 短片載入失敗就退回封面照，照常計時
  const clipUrl = current?.kind === 'video' && !failed[current.url] ? current.url : undefined;
  const photoUrl = clipUrl ? undefined : current?.kind === 'photo' ? current.url : coverUrl;
  const chapter = chapterOf(event);

  const goTo = useCallback((i: number, f = 0) => {
    setIdx(Math.max(0, Math.min(LAST, i)));
    setFrame(f);
    setProgress(0);
  }, []);

  const pos = useRef({ idx, frame, frames: frames.length });
  pos.current = { idx, frame, frames: frames.length };

  // 下一則：這一場還有就播下一則，沒有就進下一場；
  // 最後一場播完時，全螢幕（投影）循環回第一場，平常停在二週年
  const advance = useCallback(() => {
    const { idx: i, frame: f, frames: n } = pos.current;
    if (f < n - 1) goTo(i, f + 1);
    else if (i < LAST) goTo(i + 1);
    else if (document.fullscreenElement) goTo(0);
    else {
      setPlaying(false);
      setProgress(1);
    }
  }, [goTo]);

  // 上一則：這一場的上一則，已經在第一則就回上一場的開頭（跟 IG 限動一樣）
  const back = useCallback(() => {
    const { idx: i, frame: f } = pos.current;
    if (f > 0) goTo(i, f - 1);
    else goTo(i - 1);
  }, [goTo]);

  // 照片／文字卡：用 rAF 計時
  useEffect(() => {
    if (!playing || clipUrl) return;
    let raf = 0;
    const start = performance.now() - progress * PHOTO_MS;
    const tick = (t: number) => {
      const p = (t - start) / PHOTO_MS;
      if (p >= 1) {
        advance();
        return;
      }
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // progress 只在開始計時時讀一次（暫停後從原位置續播），不列為依賴
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, frame, clipUrl, advance]);

  // 短片：跟著 playing / muted 走
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    // 只有瀏覽器擋播放（NotAllowedError）才轉成暫停；換場打斷的 AbortError 不理它
    if (playing)
      video.play().catch((err: DOMException) => {
        if (err.name === 'NotAllowedError') setPlaying(false);
      });
    else video.pause();
  }, [playing, muted, idx, frame, clipUrl]);

  // 預先載入下一則照片（或下一場的封面），切換時不會閃白
  useEffect(() => {
    const nextInEvent = journeyMedia(EVENTS[idx])[frame + 1];
    const nextEvent = EVENTS[idx + 1];
    const url =
      nextInEvent?.kind === 'photo'
        ? nextInEvent.url
        : nextEvent && journeyCoverUrl(nextEvent);
    if (url) new window.Image().src = url;
  }, [idx, frame]);

  // 網址 hash 指定場次（頁面下方的活動清單用 #slug 連過來）
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const i = EVENTS.findIndex((e) => e.slug === slug);
      if (i < 0) return;
      goTo(i);
      setPlaying(true);
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [goTo]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // 電腦版控制列：滑鼠一動就出現，停 3 秒後收起（暫停或開著目錄時一直顯示）
  const wakeUi = useCallback(() => {
    setUiVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiVisible(false), HIDE_UI_MS);
  }, []);
  useEffect(() => {
    wakeUi();
    return () => clearTimeout(hideTimer.current);
  }, [wakeUi]);
  const showUi = uiVisible || !playing || tocOpen;

  const togglePlay = useCallback(() => {
    if (!playing && idx === LAST && progress >= 1) goTo(0);
    setPlaying((p) => !p);
  }, [playing, idx, progress, goTo]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen().catch(() => {});
  }, []);

  // 鍵盤：← → 上一則／下一則、空白鍵播放／暫停、F 全螢幕（投影時用遙控筆也能操作）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') advance();
      else if (e.key === 'ArrowLeft') back();
      else if (e.key === ' ' && rootRef.current?.contains(target)) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      else if (e.key === 'Escape') setTocOpen(false);
      else return;
      wakeUi();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, back, togglePlay, toggleFullscreen, wakeUi]);

  const pick = (i: number) => {
    goTo(i);
    setPlaying(true);
    setTocOpen(false);
  };

  const place = event.place ? PLACE_LABEL[event.place] : undefined;
  const media = journeyMediaLabel(event);
  const chapterTag = event.finale ? '二週年' : `${journeyYear(event)} · ${chapter.title}`;
  const counter = `${idx + 1} / ${EVENTS.length}`;
  const overall = ((idx + (frame + progress) / Math.max(1, frames.length)) / EVENTS.length) * 100;

  return (
    <section
      ref={rootRef}
      aria-label="Baila'more 兩年回顧播放器"
      onMouseMove={wakeUi}
      className={cn(
        'relative w-full scroll-mt-16 overflow-hidden bg-[#0d1222] text-white',
        fullscreen ? 'h-screen' : 'h-[calc(100svh-4rem)] min-h-[560px]',
        !showUi && 'md:cursor-none'
      )}
    >
      {/* ---------- 媒體 ---------- */}
      {coverUrl ? (
        <>
          {/* 電腦版的模糊背景，讓直式照片也能填滿 16:9 */}
          <div className="absolute inset-0 hidden md:block" aria-hidden>
            <Image
              src={photoUrl ?? coverUrl}
              alt=""
              fill
              sizes="40vw"
              quality={40}
              className="scale-110 object-cover blur-3xl brightness-[0.4]"
            />
          </div>
          <div className="absolute inset-0 md:inset-auto md:top-[7%] md:right-[4%] md:h-[86%] md:w-[58%]">
            {clipUrl ? (
              <video
                key={clipUrl}
                ref={videoRef}
                src={clipUrl}
                poster={coverUrl}
                playsInline
                muted={muted}
                preload="auto"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress(v.currentTime / v.duration);
                }}
                onEnded={advance}
                onError={() => setFailed((f) => ({ ...f, [clipUrl]: true }))}
                className="h-full w-full object-cover md:object-contain"
              />
            ) : (
              <Image
                key={photoUrl}
                src={photoUrl ?? coverUrl}
                alt={`${event.title}（${frame + 1} / ${frames.length}）`}
                fill
                priority={idx === 0}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover duration-500 animate-in fade-in md:object-contain"
              />
            )}
          </div>
          {/* 手機版文字壓在照片上，上下各一層暗色漸層保可讀性 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0a0e1c]/95 to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0a0e1c]/60 to-transparent md:hidden" />
        </>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: event.finale ? '#009689' : chapter.color }}>
          <span
            aria-hidden
            className="absolute right-4 bottom-[-0.15em] font-poppins text-[38vw] leading-none font-extrabold opacity-10 md:text-[22vw]"
          >
            {journeyYear(event)}
          </span>
        </div>
      )}

      {/* ---------- 文字 ---------- */}
      <div className="pointer-events-none absolute inset-x-6 bottom-12 z-[3] flex flex-col gap-2.5 md:right-auto md:bottom-36 md:left-16 md:w-[32%] md:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-poppins text-sm font-bold md:text-2xl md:text-[#7fe0d5]">
            {journeyDateLabel(event)}
          </span>
          {place && (
            <span className="rounded-full bg-[#7fe0d5] px-2.5 py-0.5 text-xs font-bold text-[#0b3b37] md:text-sm">
              {place}
            </span>
          )}
        </div>
        <h2 className="text-3xl leading-tight font-black md:text-5xl md:leading-tight">{event.title}</h2>
        <p className="text-[15px] leading-relaxed text-[#e3e6ee] md:text-xl md:leading-relaxed">{event.desc}</p>
        {media && <p className="text-sm text-white/70 md:text-base">{media}</p>}
        {/* 電腦版：這一場的每一則縮圖，點了直接跳過去；只有一則就不顯示 */}
        {frames.length > 1 && (
          <div className="pointer-events-auto hidden flex-wrap gap-2 md:flex">
            {frames.map((m, f) => (
              <button
                key={m.url}
                type="button"
                aria-label={`第 ${f + 1} 則${m.kind === 'video' ? '（影片）' : ''}`}
                aria-current={f === frame ? 'true' : undefined}
                onClick={() => goTo(idx, f)}
                className={cn(
                  'relative h-16 w-16 overflow-hidden rounded-xl ring-2 transition',
                  f === frame ? 'ring-white' : 'opacity-60 ring-transparent hover:opacity-100'
                )}
              >
                <Image
                  src={m.kind === 'photo' ? m.url : (coverUrl as string)}
                  alt=""
                  fill
                  sizes="64px"
                  quality={50}
                  className="object-cover"
                />
                {m.kind === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <Play size={18} fill="currentColor" />
                  </span>
                )}
                {f === frame && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                    <span className="block h-full bg-teal-500" style={{ width: `${progress * 100}%` }} />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        {event.finale && (
          <Link
            href={LINKS.ENROLL}
            className="pointer-events-auto relative z-[5] mt-2 inline-flex min-h-11 items-center justify-center self-stretch rounded-full bg-white px-6 py-3 font-bold text-teal-700 md:self-start"
          >
            報名下一堂課
          </Link>
        )}
      </div>

      {/* ---------- 手機：點左右切換（一則一則走，這場走完進下一場） ---------- */}
      <button
        type="button"
        aria-label="上一則"
        onClick={back}
        className="absolute top-24 bottom-0 left-0 z-[2] w-[35%] md:hidden"
      />
      <button
        type="button"
        aria-label="下一則"
        onClick={advance}
        className="absolute top-24 right-0 bottom-0 z-[2] w-[65%] md:hidden"
      />

      {/* ---------- 手機：這一場的分段進度條 + 頂部列 ---------- */}
      <div className="absolute inset-x-2.5 top-3 z-[4] flex gap-1 md:hidden" aria-hidden>
        {Array.from({ length: Math.max(1, frames.length) }, (_, f) => (
          <div key={f} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white"
              style={{ width: f < frame ? '100%' : f > frame ? '0%' : `${progress * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-3 top-6 z-[4] flex items-center justify-between md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-bold whitespace-nowrap">{chapterTag}</span>
          <span className="text-xs whitespace-nowrap text-white/80">第 {counter} 場</span>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="mr-1 rounded-full border border-white/50 bg-[#0d1222]/40 px-3 py-1.5 text-[13px] font-bold"
          >
            目錄
          </button>
          <IconButton label={muted ? '開啟聲音' : '靜音'} onClick={() => setMuted((m) => !m)}>
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </IconButton>
          <IconButton label={playing ? '暫停' : '播放'} onClick={togglePlay}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </IconButton>
        </div>
      </div>

      {/* ---------- 電腦：左上品牌、右上場次 ---------- */}
      <div className="absolute top-12 left-16 z-[3] hidden items-center gap-3 md:flex">
        <span className="font-poppins text-lg font-bold tracking-[0.12em]">BAILA&apos;MORE</span>
        <span className="text-lg text-white/85">{chapterTag}</span>
      </div>
      {/* 控制列浮出時它會蓋住場次，所以只在控制列收起時顯示 */}
      {!showUi && (
        <span className="absolute bottom-14 left-16 z-[3] hidden font-poppins text-xl font-bold md:block">
          {counter}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-[3] hidden h-1.5 bg-white/15 md:block" aria-hidden>
        <div className="h-full bg-teal-600" style={{ width: `${overall}%` }} />
      </div>

      {/* 靜音提示：瀏覽器擋有聲自動播放，第一次要使用者自己按 */}
      {muted && clipUrl && (
        <button
          type="button"
          onClick={() => setMuted(false)}
          className="absolute top-12 right-16 z-[5] hidden min-h-11 items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur md:flex"
        >
          <VolumeX size={18} /> 點一下開啟聲音
        </button>
      )}

      {/* ---------- 電腦：控制列 ---------- */}
      <div
        className={cn(
          'absolute inset-x-10 bottom-6 z-[6] hidden items-center gap-3 rounded-[22px] border border-white/10 bg-[#0d1222]/90 px-4 py-3 transition-opacity duration-300 md:flex',
          showUi ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <IconButton label="上一場" onClick={() => goTo(idx - 1)}>
          <ChevronLeft size={22} />
        </IconButton>
        <button
          type="button"
          aria-label={playing ? '暫停' : '播放'}
          onClick={togglePlay}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-600"
        >
          {playing ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <IconButton label="下一場" onClick={() => goTo(idx + 1)}>
          <ChevronRight size={22} />
        </IconButton>
        <div className="flex min-w-0 flex-grow flex-col gap-1">
          <label htmlFor="journey-timeline" className="truncate text-xs text-white/70">
            時間軸・{journeyDateLabel(event)}　{event.title}
          </label>
          <input
            id="journey-timeline"
            type="range"
            min={0}
            max={LAST}
            step={1}
            value={idx}
            onChange={(e) => goTo(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="relative h-4 font-poppins text-[11px] text-white/70" aria-hidden>
            {YEARS.map((y) => (
              <span key={y} className="absolute" style={{ left: `${(firstIndexOfYear(y) / LAST) * 100}%` }}>
                {y}
              </span>
            ))}
            <span className="absolute right-0">10/3</span>
          </div>
        </div>
        <YearButtons idx={idx} onPick={pick} />
        <IconButton label={muted ? '開啟聲音' : '靜音'} onClick={() => setMuted((m) => !m)}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </IconButton>
        <button
          type="button"
          onClick={() => setTocOpen(true)}
          className="flex min-h-10 items-center gap-1.5 rounded-full border border-white/35 px-3.5 py-2 text-sm font-semibold"
        >
          <List size={18} />
          目錄
        </button>
        <IconButton label={fullscreen ? '離開全螢幕' : '全螢幕投影'} onClick={toggleFullscreen}>
          {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </IconButton>
      </div>
      {!showUi && (
        <span className="absolute right-16 bottom-5 z-[3] hidden text-xs text-white/50 md:block">
          移動滑鼠顯示控制列
        </span>
      )}

      {/* ---------- 目錄：手機從底部拉起、電腦從右側滑出 ---------- */}
      {tocOpen && (
        <>
          <button
            type="button"
            aria-label="關閉目錄"
            onClick={() => setTocOpen(false)}
            className="absolute inset-0 z-[29] bg-[#0a0e1c]/50"
          />
          <div
            role="dialog"
            aria-label="全部活動"
            className="absolute inset-x-0 bottom-0 z-30 flex h-[80%] flex-col rounded-t-3xl bg-[#faf7f2] text-[#2d3a5e] md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-[440px] md:rounded-none md:bg-[#0d1222]/95 md:text-white"
          >
            <div className="flex items-center justify-between py-3 pr-3 pl-5">
              <span className="text-lg font-black">全部 {EVENTS.length} 場活動</span>
              <IconButton label="關閉目錄" onClick={() => setTocOpen(false)}>
                <X size={20} />
              </IconButton>
            </div>
            <div className="px-5 pb-2 md:hidden">
              <YearButtons idx={idx} onPick={pick} light />
            </div>
            <ol className="flex-grow overflow-y-auto px-2 pb-6">
              {EVENTS.map((e, i) => {
                const head = i === 0 || journeyYear(EVENTS[i - 1]) !== journeyYear(e);
                return (
                  <li key={e.slug}>
                    {head && (
                      <div className="flex items-baseline gap-2.5 px-3 pt-4 pb-1.5">
                        <span className="font-poppins text-xl font-extrabold">{journeyYear(e)}</span>
                        <span className="text-[13px] font-bold text-[#d4796e]">{chapterOf(e).title}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={i === idx ? 'true' : undefined}
                      className={cn(
                        'flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left',
                        i === idx
                          ? 'border-teal-600 bg-[#e1f2ef] md:bg-teal-600/25'
                          : 'border-transparent'
                      )}
                    >
                      <span className="w-[84px] flex-shrink-0 font-poppins text-[13px] font-semibold opacity-70">
                        {journeyDateLabel(e)}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-[15px] font-semibold">{e.title}</span>
                        {journeyMediaLabel(e) && (
                          <span className="text-xs opacity-65">{journeyMediaLabel(e)}</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}
    </section>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
    >
      {children}
    </button>
  );
}

/** 2024 / 2025 / 2026 跳到該年第一場，外加一顆直達二週年 */
function YearButtons({
  idx,
  onPick,
  light = false,
}: {
  idx: number;
  onPick: (i: number) => void;
  light?: boolean;
}) {
  const current = EVENTS[idx];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {YEARS.map((y) => {
        const on = !current.finale && journeyYear(current) === y;
        return (
          <button
            key={y}
            type="button"
            onClick={() => onPick(firstIndexOfYear(y))}
            className={cn(
              'min-h-10 rounded-full border px-3.5 py-2 font-poppins text-sm font-semibold',
              on
                ? 'border-teal-600 bg-teal-600 text-white'
                : light
                  ? 'border-[#d8d0c2] text-[#2d3a5e]'
                  : 'border-white/35 text-white'
            )}
          >
            {y}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPick(LAST)}
        className={cn(
          'min-h-10 rounded-full border border-[#d4796e] px-3.5 py-2 text-sm font-bold whitespace-nowrap',
          current.finale ? 'bg-[#d4796e] text-white' : light ? 'text-[#b8574c]' : 'text-[#ffb4a9]'
        )}
      >
        2026/10 二週年
      </button>
    </div>
  );
}
