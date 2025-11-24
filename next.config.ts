import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // old broken business plan URL → correct file
        source: "/pdfs/Fashion_Business_Plan_Template,%20(2).pdf",
        destination: "/pdfs/business-plan-template.pdf",
        permanent: true,
      },
      // no brand-identity redirect here anymore
    ];
  },
};

export default nextConfig;
