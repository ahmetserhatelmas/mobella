import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mobella.com";

  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("slug")
    .eq("is_active", true);

  const staticRoutes = [
    "",
    "/deneyimler",
    "/kombolar",
    "/hikaye",
    "/rehber",
    "/sss",
    "/iletisim",
    "/kurumsal",
  ];

  const staticUrls = staticRoutes.flatMap((route) =>
    ["tr", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  const experienceUrls = (experiences ?? []).flatMap((exp) =>
    ["tr", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/deneyimler/${exp.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...staticUrls, ...experienceUrls];
}
