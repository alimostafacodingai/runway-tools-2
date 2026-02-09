import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // OLD broken business plan URL → correct file
        source: "/pdfs/Fashion_Business_Plan_Template,%20(2).pdf",
        destination: "/pdfs/business-plan-template.pdf",
        permanent: true,
      },
      // 👇 IMPORTANT: no redirect here for brand-identity-template.pdf
    ];
  },
};

export default withNextIntl(nextConfig);
