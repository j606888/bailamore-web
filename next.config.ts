import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 師資/推薦頭像上傳走 Vercel Blob
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    // 允許 next/image 顯示自有 SVG（如 /teachers/placeholder.svg）。
    // 搭配官方建議的安全設定，避免 SVG 被當成可執行內容。
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
