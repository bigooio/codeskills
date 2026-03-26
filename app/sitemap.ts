import { MetadataRoute } from 'next'
import { getAllSkills } from '@/lib/skills'

const BASE_URL = 'https://codeskills.cn'

export default function sitemap(): MetadataRoute.Sitemap {
  const skills = getAllSkills()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category pages
  const categories = [
    { name: 'AI智能', slug: 'ai-intelligence' },
    { name: '开发工具', slug: 'developer-tools' },
    { name: '效率提升', slug: 'productivity' },
    { name: '数据分析', slug: 'data-analysis' },
    { name: '内容创作', slug: 'content-creation' },
    { name: '安全合规', slug: 'security-compliance' },
    { name: '自动化', slug: 'automation' },
    { name: '浏览器', slug: 'browser' },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/discover?category=${encodeURIComponent(cat.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Skill detail pages (top 1000 for sitemap size limit)
  const skillPages: MetadataRoute.Sitemap = skills
    .slice(0, 1000)
    .map((skill) => ({
      url: `${BASE_URL}/skill/${skill.slug}`,
      lastModified: new Date(skill.createdAt),
      changeFrequency: 'monthly' as const,
      priority: skill.downloads && skill.downloads > 10000 ? 0.7 : 0.5,
    }))

  return [...staticPages, ...categoryPages, ...skillPages]
}
