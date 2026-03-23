import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
          CodeSkills
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-text-secondary hover:text-text-primary transition">
            首页
          </Link>
          <Link href="/discover" className="text-text-secondary hover:text-text-primary transition">
            发现
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-text-primary transition">
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
