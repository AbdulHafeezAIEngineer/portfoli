/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./node_modules/.prisma/client/query_compiler_bg.wasm"],
    },
    serverComponentsExternalPackages: [
      "@prisma/client",
      "@prisma/adapter-pg",
      "pg",
      "gmail-smtp",
    ],
  },
  images: {
    remotePatterns: process.env.BLOB_PUBLIC_HOST
      ? [{ protocol: "https", hostname: process.env.BLOB_PUBLIC_HOST }]
      : [],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
