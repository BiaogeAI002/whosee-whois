import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/static/screenshots/',
        '/_next/',
      ],
    },
    sitemap: 'https://whosee.me/sitemap.xml',
  }
} 