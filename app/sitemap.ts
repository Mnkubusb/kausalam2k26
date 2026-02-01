import { MetadataRoute } from 'next';
import { EVENTS } from '@/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kausalam2k26.vercel.app/'; // Assuming this is the production URL

  // Static routes
  const routes = [
    '',
    '/events',
    '/team',
    '/schedule',
    '/gallery',
    '/help',
    '/privacy',
    '/terms',
    '/cookies'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic event routes
  const eventRoutes = EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.id}`, // Assuming this is how individual event pages are accessed, though current app might use query params or client-side nav.
    // Based on app/page.tsx, navigation is client-side state based (navigateTo).
    // However, for SEO, we should ideally have distinct URLs. 
    // Since the current architecture uses client-side state for 'pages', 
    // real deep linking might be limited without a refactor to App Router pages.
    // But for the sitemap, let's list the main accessible sections.
    // Given the single-page-like structure with "views", strict deep linking 
    // might not work without URL query params or hash.
    // For now, I will list the main sections which are effectively "pages".
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes];
}
