import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'], // Hide admin panel from Google
    },
    sitemap: 'https://ru-study-hub.vercel.app/sitemap.xml',
  };
}