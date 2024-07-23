/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image host v5.airtableusercontent.com
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
