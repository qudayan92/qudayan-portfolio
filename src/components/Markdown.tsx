// 轻量 Markdown 渲染器 - 零外部依赖
// 支持：标题 / 段落 / 列表 / 引用 / 代码块 / 行内代码 / 强调 / 链接 / 分隔线
import React from 'react';

type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; lang?: string; text: string }
  | { type: 'hr' };

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      blocks.push({ type: 'p', text: paraBuf.join(' ').trim() });
      paraBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // code block
    if (line.startsWith('```')) {
      flushPara();
      const lang = line.slice(3).trim() || undefined;
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang, text: buf.join('\n') });
      i++;
      continue;
    }

    // heading
    const h2 = line.match(/^##\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    if (h2) {
      flushPara();
      blocks.push({ type: 'h2', text: h2[1].trim() });
      i++;
      continue;
    }
    if (h3) {
      flushPara();
      blocks.push({ type: 'h3', text: h3[1].trim() });
      i++;
      continue;
    }

    // hr
    if (/^---+$/.test(line.trim())) {
      flushPara();
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // quote
    const q = line.match(/^>\s?(.*)/);
    if (q) {
      flushPara();
      const buf: string[] = [q[1]];
      i++;
      while (i < lines.length && lines[i].startsWith('>')) {
        const m = lines[i].match(/^>\s?(.*)/);
        if (m) buf.push(m[1]);
        i++;
      }
      blocks.push({ type: 'quote', text: buf.join(' ') });
      continue;
    }

    // unordered list
    const ul = line.match(/^[-*]\s+(.*)/);
    if (ul) {
      flushPara();
      const items: string[] = [ul[1]];
      i++;
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.*)/);
        if (m) items.push(m[1]);
        else break;
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // ordered list
    const ol = line.match(/^\d+\.\s+(.*)/);
    if (ol) {
      flushPara();
      const items: string[] = [ol[1]];
      i++;
      while (i < lines.length) {
        const m = lines[i].match(/^\d+\.\s+(.*)/);
        if (m) items.push(m[1]);
        else break;
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // blank
    if (line.trim() === '') {
      flushPara();
      i++;
      continue;
    }

    // paragraph
    paraBuf.push(line);
    i++;
  }
  flushPara();
  return blocks;
}

// inline: **bold** *italic* `code` [text](url)
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // 先粗略切分，按优先级匹配
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) nodes.push(<em key={key++}>{m[4]}</em>);
    else if (m[5]) nodes.push(<code key={key++}>{m[6]}</code>);
    else if (m[7]) {
      nodes.push(
        <a key={key++} href={m[9]} target="_blank" rel="noreferrer">
          {m[8]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const blocks = parse(source);
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return <h2 key={i}>{renderInline(b.text)}</h2>;
          case 'h3':
            return <h3 key={i}>{renderInline(b.text)}</h3>;
          case 'p':
            return <p key={i}>{renderInline(b.text)}</p>;
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return <blockquote key={i}>{renderInline(b.text)}</blockquote>;
          case 'code':
            return (
              <pre key={i}>
                <code>{b.text}</code>
              </pre>
            );
          case 'hr':
            return <hr key={i} />;
        }
      })}
    </>
  );
}