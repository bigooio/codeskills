import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">CodeSkills</span>
            <span className="text-text-secondary text-sm">发现编程超能力</span>
          </div>
          <nav className="flex gap-6 text-sm text-text-secondary">
            <Link href="/" className="hover:text-accent transition">首页</Link>
            <Link href="/discover" className="hover:text-accent transition">发现</Link>
            <Link href="/about" className="hover:text-accent transition">关于</Link>
          </nav>
        </div>
        <div className="text-center mt-6 text-text-secondary text-xs">
          © 2026 CodeSkills. 免费分享编程技能。
        </div>
      </div>
    </footer>
  )
}
