/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.nevtis.com'],
  },
  // Asegurarnos de que no hay configuración de output
  output: 'standalone',
};

export default nextConfig;