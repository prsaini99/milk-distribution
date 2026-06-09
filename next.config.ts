import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Product images are served locally from /public/catalogue. Allow the
       local SVG placeholder used for admin-created products without a photo. */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
