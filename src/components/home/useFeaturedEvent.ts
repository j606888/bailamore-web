'use client';

import { useEffect, useState } from 'react';
import {
  getFeaturedEvents,
  type EnrollEvent,
} from '@/components/courses/schedule/data';

// 首頁是預先產生的靜態 HTML，build 當下的日期之後會過期（跟 EnrollBoard 同一個道理）。
// renderedAt 由 server 端的 page.tsx 傳進來（= build 的時間）：
// SSR 與 hydration 用同一個時間，兩邊算出來一樣，不會 mismatch；
// 靜態 HTML 也就不會再印出 build 時已經辦完的活動（之前用 epoch，過期的 10/22 會一直留在 HTML 裡）。
// 掛載後改用瀏覽器當下時間，活動辦完就自動退場，不用等重新部署。
export function useFeaturedEvents(renderedAt: number): EnrollEvent[] {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return getFeaturedEvents(now ?? new Date(renderedAt));
}
