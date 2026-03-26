import { getSkillBySlug, getAllSkills } from '@/lib/skills'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SkillViewer from '@/components/SkillViewer'
import CopyCommand from '@/components/CopyCommand'

// Tag name mapping to Chinese
const TAG_NAME_MAP: Record<string, string> = {
  'ai-intelligence': 'AI智能',
  'developer-tools': '开发工具',
  'productivity': '效率提升',
  'data-analysis': '数据分析',
  'content-creation': '内容创作',
  'security-compliance': '安全合规',
  'automation': '自动化',
  'browser': '浏览器',
  'headless': '无头浏览器',
  'web': 'Web开发',
  'communication-collaboration': '通讯协作',
  'lifestyle': '生活娱乐',
  'integrations': '集成工具',
  'finance': '金融',
  'social': '社交',
}

// Skill title mapping to Chinese names
const SKILL_TITLE_MAP: Record<string, string> = {
  'Find Skills': '查找技能',
  'Summarize': '内容总结',
  'Agent Browser': '浏览器代理',
  'Github': 'GitHub工具',
  'Skill Vetter': '技能审查',
  'Proactive Agent': '主动代理',
  'Weather': '天气预报',
  'Humanizer': '人性化改写',
  'Brave Search': '勇敢搜索',
  'Free Ride': '免费AI通道',
  'Auto-Updater': '自动更新',
  'Mcporter': 'MCP传输',
  'Stock Analysis': '股票分析',
  'Nano Banana Pro': '图像生成',
  'Sonoscli': 'Sonos控制',
  'self-improving-agent': '自我改进代理',
  'Free Ride - Unlimited free AI': '免费AI通道 - 无限制免费AI',
  'Auto-Updater Skill': '自动更新技能',
}

function getTagName(tag: string): string {
  return TAG_NAME_MAP[tag] || tag
}

interface SkillPageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)
  if (!skill) return { title: 'Not Found' }
  return {
    title: `${skill.title} - codeskills`,
    description: skill.description,
  }
}

export default function SkillPage({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)

  if (!skill) {
    notFound()
  }

  const allSkills = getAllSkills()
  const relatedSkills = allSkills
    .filter((s) => s.id !== skill.id && s.tags.some((t) => skill.tags.includes(t)))
    .slice(0, 3)

  const installCmd = `codeskills install ${skill.slug}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/discover" className="text-text-secondary hover:text-accent text-sm mb-6 inline-block">
        ← 返回发现
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.tags.map((tag) => (
              <Link
                key={tag}
                href={`/discover?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition"
              >
                {getTagName(tag)}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-4">{SKILL_TITLE_MAP[skill.title] || skill.title}</h1>
          <p className="text-xl text-text-secondary mb-4">{skill.description}</p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className={skill.source === 'github' ? 'text-accent' : 'text-success'}>
              {skill.source === 'github' ? '来自 GitHub' : skill.source === 'clawhub' ? '来自 SkillHub' : '原创'}
            </span>
            {skill.downloads !== undefined && skill.downloads > 0 && (
              <span>下载: {skill.downloads.toLocaleString()}</span>
            )}
            {skill.stars !== undefined && skill.stars > 0 && (
              <span>⭐ {skill.stars.toLocaleString()}</span>
            )}
            {skill.sourceUrl && (
              <a
                href={skill.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                查看原文 →
              </a>
            )}
            <span>{skill.createdAt}</span>
          </div>

          {/* CLI Install Command */}
          <div className="mt-6 p-4 bg-card border border-border rounded-lg flex items-center gap-3">
            <code className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm font-mono text-accent overflow-x-auto">
              {installCmd}
            </code>
            <CopyCommand text={installCmd} />
          </div>
        </header>

        <SkillViewer slug={skill.slug} initialContent={skill.content} />
      </article>

      {relatedSkills.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-6">相关 Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedSkills.map((s) => (
              <Link key={s.id} href={`/skill/${s.slug}`} className="block">
                <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition">
                  <h3 className="font-medium text-text-primary hover:text-accent">{s.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
