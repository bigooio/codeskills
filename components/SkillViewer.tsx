'use client'

import { useState, useEffect } from 'react'

interface SkillViewerProps {
  slug: string
  initialContent: string
}

type ViewMode = 'preview' | 'md' | 'split'

export default function SkillViewer({ slug, initialContent }: SkillViewerProps) {
  const [mode, setMode] = useState<ViewMode>('preview')
  const [fullContent, setFullContent] = useState<string>(initialContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/skills/${slug}`)
      .then(res => res.json())
      .then(data => {
        setFullContent(data.fullContent || initialContent)
        setLoading(false)
      })
      .catch(() => {
        setFullContent(initialContent)
        setLoading(false)
      })
  }, [slug, initialContent])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullContent)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    const result: JSX.Element[] = []
    let inCodeBlock = false
    let codeContent = ''
    let key = 0

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.push(
            <pre key={key++} className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg p-4 overflow-x-auto my-4 text-sm">
              <code className="text-text-primary">{codeContent.trim()}</code>
            </pre>
          )
          codeContent = ''
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        codeContent += line + '\n'
        continue
      }

      if (line.startsWith('# ')) {
        result.push(<h1 key={key++} className="text-2xl font-bold mb-4 text-text-primary">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        result.push(<h2 key={key++} className="text-xl font-semibold mb-3 mt-6 text-text-primary">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        result.push(<h3 key={key++} className="text-lg font-medium mb-2 mt-4 text-text-primary">{line.slice(4)}</h3>)
      } else if (line.startsWith('- ')) {
        result.push(<li key={key++} className="ml-6 list-disc text-text-primary mb-1">{renderInline(line.slice(2))}</li>)
      } else if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s(.*)/)
        if (match) {
          result.push(<li key={key++} className="ml-6 list-decimal text-text-primary mb-1">{renderInline(match[2])}</li>)
        }
      } else if (line.startsWith('| ') && line.includes('---')) {
        // Skip table separator
      } else if (line.startsWith('| ')) {
        const cells = line.split('|').filter(c => c.trim() && !c.match(/^-+$/))
        if (cells.length > 0) {
          result.push(
            <div key={key++} className="flex border-b border-[#2a2a3e] py-2">
              {cells.map((cell, i) => <span key={i} className="flex-1 text-text-primary">{renderInline(cell.trim())}</span>)}
            </div>
          )
        }
      } else if (line.trim() === '') {
        result.push(<div key={key++} className="h-3" />)
      } else {
        result.push(<p key={key++} className="text-text-primary mb-3 leading-relaxed">{renderInline(line)}</p>)
      }
    }

    return result
  }

  const renderInline = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      const codeMatch = remaining.match(/^`([^`]+)`/)
      if (codeMatch) {
        parts.push(<code key={key++} className="bg-[#1a1a2e] px-1.5 py-0.5 rounded text-sm text-accent">{codeMatch[1]}</code>)
        remaining = remaining.slice(codeMatch[0].length)
        continue
      }

      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
      if (boldMatch) {
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        parts.push(<a key={key++} href={linkMatch[2]} className="text-accent hover:underline">{linkMatch[1]}</a>)
        remaining = remaining.slice(linkMatch[0].length)
        continue
      }

      const nextSpecial = remaining.search(/[`*\[]/)
      if (nextSpecial === -1) {
        parts.push(remaining)
        break
      } else if (nextSpecial === 0) {
        parts.push(remaining[0])
        remaining = remaining.slice(1)
      } else {
        parts.push(remaining.slice(0, nextSpecial))
        remaining = remaining.slice(nextSpecial)
      }
    }

    return parts
  }

  return (
    <div className="mt-8">
      {/* Tab Bar */}
      <div className="flex border-b border-[#2a2a3e]">
        <button
          onClick={() => setMode('preview')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
            mode === 'preview'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setMode('md')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
            mode === 'md'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          源码
        </button>
        <button
          onClick={() => setMode('split')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
            mode === 'split'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          分屏
        </button>

        {/* Copy button for preview mode */}
        {mode === 'preview' && (
          <button
            onClick={handleCopy}
            className="ml-auto p-2 text-text-secondary hover:text-text-primary transition"
            title="复制"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-text-secondary">
            <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            加载中...
          </div>
        ) : (
          <>
            {/* Preview Mode */}
            {mode === 'preview' && (
              <div className="text-text-primary">
                {renderMarkdown(fullContent)}
              </div>
            )}

            {/* MD Source Mode */}
            {mode === 'md' && (
              <pre className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-text-primary whitespace-pre-wrap">{fullContent}</code>
              </pre>
            )}

            {/* Split Mode */}
            {mode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-[#2a2a3e] rounded-lg">
                  <div className="px-4 py-2 border-b border-[#2a2a3e] text-xs text-text-secondary">源码</div>
                  <pre className="p-4 overflow-auto max-h-[600px] text-sm">
                    <code className="text-text-primary whitespace-pre-wrap">{fullContent}</code>
                  </pre>
                </div>
                <div className="border border-[#2a2a3e] rounded-lg">
                  <div className="px-4 py-2 border-b border-[#2a2a3e] text-xs text-text-secondary">预览</div>
                  <div className="p-4 overflow-auto max-h-[600px]">
                    {renderMarkdown(fullContent)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
