import { MetadataRoute } from "next";
import { EVENTS } from "@/constants";

const baseUrl = "https://kaushalam2k26.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/events",
    "/team",
    "/schedule",
    "/gallery",
    "/help",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  /**
   * IMPORTANT:
   * Only include event routes IF they are real, server-addressable URLs.
   * If events are client-side state only, DO NOT include them yet.
   */

  // Uncomment ONLY after /events/[id]/page.tsx exists
  /*
  const eventRoutes: MetadataRoute.Sitemap = EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  */

  return [
    ...staticRoutes,
    // ...eventRoutes,
  ];
}
