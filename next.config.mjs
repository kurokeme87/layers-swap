/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PROJECT_ID: "c056c336-1079-4642-8877-097e4dd12b54",
    APP_CLIENT_KEY: "cFa79bluW1rTXvNWbU9D1Yty1V31CCCn56dEMOOO",
    APP_ID: "4f450f58-7f9d-43fc-9acb-d130155095eb",
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
