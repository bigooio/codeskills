'use client'

import Link from 'next/link'
import CopyButton from './CopyButton'

const INSTALL_CMD = 'curl -fsSL https://codeskills.cn/install.sh | bash'

export default function InstallSection() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <code className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-mono text-accent">
        {INSTALL_CMD}
      </code>
      <CopyButton text={INSTALL_CMD} />
      <Link
        href="/discover"
        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition"
      >
        浏览全部 →
      </Link>
    </div>
  )
}
