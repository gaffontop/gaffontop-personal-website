/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./index.htm"],
  },
};

module.exports = nextConfig;
