import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://kaushalam2k26.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow admin page
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
