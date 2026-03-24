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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'md' || mode === 'split') {
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
    }
  }, [mode, slug, initialContent])

  // Simple markdown to HTML conversion for preview
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    const result: JSX.Element[] = []
    let inCodeBlock = false
    let codeContent = ''
    let codeLang = ''
    let key = 0

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.push(
            <pre key={key++} className="bg-card border border-border rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm text-text-primary">{codeContent}</code>
            </pre>
          )
          codeContent = ''
          codeLang = ''
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeLang = line.slice(3).trim()
        }
        continue
      }

      if (inCodeBlock) {
        codeContent += line + '\n'
        continue
      }

      if (line.startsWith('# ')) {
        result.push(<h1 key={key++} className="text-3xl font-bold mb-4 mt-8">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        result.push(<h2 key={key++} className="text-2xl font-semibold mb-3 mt-6">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        result.push(<h3 key={key++} className="text-xl font-medium mb-2 mt-4">{line.slice(4)}</h3>)
      } else if (line.startsWith('- ')) {
        result.push(<li key={key++} className="ml-6 list-disc text-text-primary mb-1">{renderInline(line.slice(2))}</li>)
      } else if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s(.*)/)
        if (match) {
          result.push(<li key={key++} className="ml-6 list-decimal text-text-primary mb-1">{renderInline(match[2])}</li>)
        }
      } else if (line.startsWith('| ')) {
        // Table row - simple handling
        const cells = line.split('|').filter(c => c.trim() && c.trim() !== '---')
        if (cells.length > 0 && !line.includes('---')) {
          result.push(
            <div key={key++} className="flex gap-4 py-2 border-b border-border">
              {cells.map((cell, i) => <span key={i} className="flex-1">{renderInline(cell.trim())}</span>)}
            </div>
          )
        }
      } else if (line.trim() === '') {
        result.push(<div key={key++} className="h-2" />)
      } else {
        result.push(<p key={key++} className="text-text-primary mb-4 leading-relaxed">{renderInline(line)}</p>)
      }
    }

    return result
  }

  // Render inline elements like bold, italic, code
  const renderInline = (text: string): JSX.Element[] => {
    const parts: JSX.Element[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      // Match inline code
      const codeMatch = remaining.match(/^`([^`]+)`/)
      if (codeMatch) {
        parts.push(<code key={key++} className="bg-card px-1.5 py-0.5 rounded text-sm text-accent">{codeMatch[1]}</code>)
        remaining = remaining.slice(codeMatch[0].length)
        continue
      }

      // Match bold
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
      if (boldMatch) {
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      // Match italic
      const italicMatch = remaining.match(/^\*([^*]+)\*/)
      if (italicMatch) {
        parts.push(<em key={key++}>{italicMatch[1]}</em>)
        remaining = remaining.slice(italicMatch[0].length)
        continue
      }

      // Match link
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        parts.push(<a key={key++} href={linkMatch[2]} className="text-accent hover:underline">{linkMatch[1]}</a>)
        remaining = remaining.slice(linkMatch[0].length)
        continue
      }

      // Regular text
      const nextSpecial = remaining.search(/[`*\[]/)
      if (nextSpecial === -1) {
        parts.push(<span key={key++}>{remaining}</span>)
        break
      } else if (nextSpecial === 0) {
        parts.push(<span key={key++}>{remaining[0]}</span>)
        remaining = remaining.slice(1)
      } else {
        parts.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>)
        remaining = remaining.slice(nextSpecial)
      }
    }

    return parts
  }

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        <span className="text-sm text-text-secondary mr-2">视图模式:</span>
        <button
          onClick={() => setMode('preview')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${
            mode === 'preview'
              ? 'bg-accent text-white'
              : 'bg-card text-text-secondary hover:text-text-primary'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setMode('md')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${
            mode === 'md'
              ? 'bg-accent text-white'
              : 'bg-card text-text-secondary hover:text-text-primary'
          }`}
        >
          MD 源码
        </button>
        <button
          onClick={() => setMode('split')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${
            mode === 'split'
              ? 'bg-accent text-white'
              : 'bg-card text-text-secondary hover:text-text-primary'
          }`}
        >
          实时模式
        </button>
      </div>

      {/* Preview Mode */}
      {mode === 'preview' && (
        <div className="prose prose-invert max-w-none">
          {renderMarkdown(fullContent)}
        </div>
      )}

      {/* MD Source Mode */}
      {mode === 'md' && (
        <div>
          {loading ? (
            <div className="text-text-secondary">加载中...</div>
          ) : (
            <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-text-primary whitespace-pre-wrap">{fullContent}</code>
            </pre>
          )}
        </div>
      )}

      {/* Split/Real-time Mode */}
      {mode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: MD Source */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">MD 源码</h3>
            <pre className="bg-card border border-border rounded-lg p-4 overflow-auto h-[600px] text-sm">
              <code className="text-text-primary whitespace-pre-wrap">
                {loading ? '加载中...' : fullContent}
              </code>
            </pre>
          </div>

          {/* Right: Preview */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">预览</h3>
            <div className="bg-card border border-border rounded-lg p-4 overflow-auto h-[600px]">
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(fullContent)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
