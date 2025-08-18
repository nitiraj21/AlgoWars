import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  matcher : [
    "/dashboard/:path*",
    "/room/:path*",
    "/play/:path*",
    "/login",
    "/register"
  ]
};
module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};


export default nextConfig;
