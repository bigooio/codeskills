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
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

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
            <pre key={key++} className="bg-card border border-border rounded-lg p-4 overflow-x-auto my-4 relative group">
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="absolute top-2 right-2 p-1.5 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition text-text-secondary hover:text-text-primary"
                title="复制代码"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
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

  const renderInline = (text: string): JSX.Element[] => {
    const parts: JSX.Element[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      const codeMatch = remaining.match(/^`([^`]+)`/)
      if (codeMatch) {
        parts.push(<code key={key++} className="bg-card px-1.5 py-0.5 rounded text-sm text-accent">{codeMatch[1]}</code>)
        remaining = remaining.slice(codeMatch[0].length)
        continue
      }

      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
      if (boldMatch) {
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      const italicMatch = remaining.match(/^\*([^*]+)\*/)
      if (italicMatch) {
        parts.push(<em key={key++}>{italicMatch[1]}</em>)
        remaining = remaining.slice(italicMatch[0].length)
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
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
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

        {/* Copy Icon - shows in MD and Split modes */}
        {(mode === 'md' || mode === 'split') && (
          <button
            onClick={handleCopy}
            className="p-2 rounded hover:bg-card text-text-secondary hover:text-text-primary transition"
            title={copied ? '已复制!' : '复制'}
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">MD 源码</h3>
            </div>
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
