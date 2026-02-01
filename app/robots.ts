import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kausalam.gecbilaspur.ac.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow admin page
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
