import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '探索 Skills - 发现AI技能中心',
  description: '浏览和搜索25,000+优质AI技能。支持按分类筛选（AI智能、开发工具、效率提升等）和排序（热门、下载量、收藏数）。帮助开发者快速找到提升效率的编程工具。',
  keywords: ['AI技能搜索', '技能浏览', 'AI工具', '编程技能', '开发工具', '效率工具'],
  openGraph: {
    title: '探索 Skills - CodeSkills',
    description: '浏览25,000+优质AI技能，支持分类筛选和搜索',
    images: ['/og-image.png'],
  },
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
