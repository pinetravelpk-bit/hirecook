import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

// Search engines AND AI answer engines (ChatGPT, Perplexity, Claude, Gemini, Copilot) are welcome,
// so HireCook.pk can be cited in AI answers (GEO / AEO).
export default function robots(): MetadataRoute.Robots {
  const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'meta-externalagent', 'DuckAssistBot', 'YouBot'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      ...ai.map((ua) => ({ userAgent: ua, allow: '/', disallow: ['/api/', '/admin/'] })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
