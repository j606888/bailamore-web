'use client';

import { useEffect, useState } from 'react';
import {
  getFeaturedEvent,
  type EnrollEvent,
} from '@/components/courses/schedule/data';

// 首頁是預先產生的靜態 HTML，build 當下的日期會過期（跟 EnrollBoard 同一個道理）。
// SSR 時用 epoch → 靜態 HTML 一定有主打活動，爬蟲讀得到；
// 掛載後改用瀏覽器當下時間，活動辦完就自動退場，不用等重新部署。
const EPOCH = new Date(0);

export function useFeaturedEvent(): EnrollEvent | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  return getFeaturedEvent(now ?? EPOCH);
}
