/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/setup',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 