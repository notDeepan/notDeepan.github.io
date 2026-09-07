import type { NextConfig } from 'next';
const staticPreview=process.env.NEXT_PUBLIC_STATIC_EXPORT==='1';
const config: NextConfig = {
  outputFileTracingRoot:process.cwd(),
  ...(staticPreview ? {output:'export',trailingSlash:true,images:{unoptimized:true}} : {}),
  basePath:process.env.NEXT_PUBLIC_BASE_PATH || '',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  poweredByHeader: false,
  reactStrictMode: true,
};
if(!staticPreview){
  config.headers=async () => {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ] }];
  };
}
export default config;
