'use client'

import Link from 'next/link'
import CopyButton from './CopyButton'

const INSTALL_CMD_UNIX = 'curl -fsSL https://codeskills.cn/install.sh | bash'
const INSTALL_CMD_WIN = 'irm https://codeskills.cn/install.ps1 | iex'

export default function InstallSection() {
  return (
    <div className="mt-8">
      {/* Unix */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
        <span className="text-sm text-text-secondary">Linux / macOS:</span>
        <div className="relative group">
          <code className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-mono text-accent block">
            {INSTALL_CMD_UNIX}
          </code>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <CopyButton text={INSTALL_CMD_UNIX} />
          </div>
        </div>
      </div>

      {/* Windows */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-sm text-text-secondary">Windows (PowerShell):</span>
        <div className="relative group">
          <code className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-mono text-accent block">
            {INSTALL_CMD_WIN}
          </code>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <CopyButton text={INSTALL_CMD_WIN} />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/discover"
          className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition"
        >
          浏览全部 Skills →
        </Link>
      </div>
    </div>
  )
}
