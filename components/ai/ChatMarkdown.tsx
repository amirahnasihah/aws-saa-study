'use client'

import { useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MermaidDiagram from '@/components/ai/MermaidDiagram'

// Markdown images are often model-invented URLs that 404. Render the image, but
// fall back to a tidy captioned placeholder (instead of the browser's broken
// icon) the moment it fails to load.
function ChatImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="my-2 flex items-center gap-2 rounded-xl border border-aws-border/60 bg-aws-card px-3 py-2 font-space-mono text-[0.72rem] text-aws-muted/70">
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <path d="m3 11 3-3 2 2 3-3 2 2" />
          <path d="M2 2l12 12" />
        </svg>
        {alt || 'Image unavailable'}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="my-2 max-w-full rounded-xl border border-aws-border/60 bg-white/5"
    />
  )
}

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-0.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-aws-text">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-c1 underline hover:text-c1/80"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-1.5 font-bold text-aws-text">{children}</h3>,
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="min-w-full text-left text-[0.74rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-aws-border/60 px-2 py-1 font-bold text-aws-text">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-aws-border/30 px-2 py-1">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-c1/40 pl-3 text-aws-muted/80 last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-2 border-aws-border/40" />,
  // Tool-fetched AWS diagrams arrive as Markdown images — render them framed
  // and constrained so they never overflow the chat bubble.
  img: ({ src, alt }) => {
    const url = typeof src === 'string' ? src : ''
    if (!url) return null
    return <ChatImage src={url} alt={typeof alt === 'string' ? alt : ''} />
  },
  // react-markdown nests block code inside <pre>; pass <pre> through so
  // `code` below fully controls block-level rendering (incl. mermaid).
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className ?? '')
    const value = String(children).replace(/\n$/, '')

    if (!match) {
      return (
        <code className="rounded bg-aws-card border border-aws-border/60 px-1 py-0.5 font-space-mono text-[0.74rem]">
          {children}
        </code>
      )
    }

    if (match[1] === 'mermaid') {
      return <MermaidDiagram source={value} />
    }

    return (
      <pre className="mb-2 overflow-x-auto rounded-xl bg-aws-card border border-aws-border/60 p-3 font-space-mono text-[0.7rem] leading-relaxed last:mb-0">
        <code>{value}</code>
      </pre>
    )
  },
}

interface ChatMarkdownProps {
  content: string
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="font-space-mono text-[0.82rem] leading-[1.8] text-aws-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
