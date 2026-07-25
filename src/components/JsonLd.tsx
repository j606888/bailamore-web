import type { JsonLd as JsonLdData } from '@/lib/jsonLd';

// 把 schema.org 物件輸出成 <script type="application/ld+json">。
// 資料全來自本地靜態檔（無使用者輸入），但仍轉義 `<` 避免提早關閉 script 標籤。
export default function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
