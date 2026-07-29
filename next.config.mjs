/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The lesson view moved from /tutor/:topicId to /lesson/:topicId.
      { source: '/tutor/:topicId', destination: '/lesson/:topicId', permanent: true },
    ];
  },
};

export default nextConfig;
