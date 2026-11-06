import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "우리집 입주노트",
    short_name: "입주노트",
    description: "함께 준비하는 입주 체크리스트, 지출 비교와 자금계획",
    lang: "ko-KR",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f7f8f4",
    theme_color: "#28624f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
