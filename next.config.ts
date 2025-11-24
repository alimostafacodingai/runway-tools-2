import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // OLD broken business plan URL → NEW correct file
        source: "/pdfs/Fashion_Business_Plan_Template,%20(2).pdf",
        destination: "/pdfs/business-plan-template.pdf",
        permanent: true,
      },
      {
        // OLD broken brand identity URL (capital B) → NEW correct file
        source: "/pdfs/Brand-identity-template.pdf",
        destination: "/pdfs/brand-identity-template.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
