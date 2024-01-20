/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ordinalslite.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ordinalslite.com",
      },
    ],
  },
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/litescribe/:slug*",
        destination: "https://litescribe.io/api/:slug*",
      },
      {
        source: "/ordinalslite/:slug*",
        destination: "https://ordinalslite.xyz/:slug*",
      },
      {
        source: "/chainz/:slug*",
        destination: "https://chainz.cryptoid.info/:slug*",
      },
      {
        source: "/searchInscription/:slug*",
        destination: "http://217.76.63.90:3000/:slug*",
      },
      {
        source: "/ordinalsExplorer/:slug*",
        destination: "https://ordinalslite.com/:slug*",
      },
    ];
  },
};

module.exports = nextConfig;
