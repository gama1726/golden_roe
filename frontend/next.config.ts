import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  // API media URLs are absolute (APP_URL/storage/...), often http://127.0.0.1:8000 locally.
  "img-src 'self' data: blob: http: https:",
  "font-src 'self' data:",
  "connect-src 'self' http://127.0.0.1:8000 http://localhost:8000",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

/** PDF file responses must be embeddable in our document page iframe. */
const pdfFileHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'",
  },
];

const nextConfig: NextConfig = {
  // Needed when `next dev` is reached via nginx / public host instead of localhost.
  allowedDevOrigins: [
    "212.109.194.23",
    "goldenroe.fvds.ru",
    "localhost",
    "127.0.0.1",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Listed after the catch-all so these keys win for the PDF proxy route.
      {
        source: "/documents/:type/file",
        headers: pdfFileHeaders,
      },
    ];
  },
};

export default nextConfig;
