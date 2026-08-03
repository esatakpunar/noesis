import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Kişisel/oturum gerektiren sayfalar indekslenmesin.
        disallow: ["/codex", "/api/"],
      },
    ],
    sitemap: "https://noesis-seven-wheat.vercel.app/sitemap.xml",
  };
}
