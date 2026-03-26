import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'CodeSkills - 发现编程超能力 | AI技能中心',
    template: '%s | CodeSkills',
  },
  description: 'CodeSkills是一个AI技能发现平台，收录25,000+优质编程技能、工具、代码模式。支持按分类浏览、关键词搜索，帮助开发者提升效率。涵盖AI智能、开发工具、自动化等领域。',
  keywords: ['AI技能', 'Claude Skills', '编程工具', '开发效率', 'AI智能体', '自动化工具', '代码技能', 'ChatGPT插件', 'Claude插件', '程序员工具'],
  authors: [{ name: 'CodeSkills' }],
  creator: 'CodeSkills',
  publisher: 'CodeSkills',
  metadataBase: new URL('https://codeskills.cn'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://codeskills.cn',
    siteName: 'CodeSkills',
    title: 'CodeSkills - 发现编程超能力 | AI技能中心',
    description: '收录25,000+优质AI技能，支持分类浏览和关键词搜索，帮助开发者提升效率',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeSkills - AI技能发现平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeSkills - 发现编程超能力',
    description: '收录25,000+优质AI技能，帮助开发者提升效率',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background text-text-primary flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
