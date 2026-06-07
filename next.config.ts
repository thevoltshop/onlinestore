import type { NextConfig } from "next";

const securityHeaders = [
  // Запрет встраивания сайта в iframe (защита от кликджекинга)
  { key: "X-Frame-Options", value: "DENY" },
  // Запрет угадывания типа контента браузером
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Минимум информации в Referer-заголовке
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Отключаем доступ к камере, микрофону, геолокации
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Принудительный HTTPS на 1 год
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Базовая политика загрузки контента
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://images.unsplash.com https://cdn.shopify.com https://s.alicdn.com https://ae01.alicdn.com https://i.postimg.cc data: blob:",
      "connect-src 'self'",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
