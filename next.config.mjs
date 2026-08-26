/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
  },
  experimental: {
    mdxRs: false,
    // 语音合成依赖使用 WebSocket/原生 Web API，让 Next 按外部依赖处理（standalone 会随部署追踪）
    serverComponentsExternalPackages: ['edge-tts-universal'],
  },
};

export default nextConfig;