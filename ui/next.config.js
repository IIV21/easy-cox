/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/employees",
        permanent: true,
      },
    ];
  },
  headers: () => [
    {
      source: "/dashboard/employees",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
  reactStrictMode: true,
  generateEtags: false,
};

module.exports = nextConfig;
