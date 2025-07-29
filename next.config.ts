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

export default nextConfig;
