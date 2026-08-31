import React from 'react';

type Alignment = 'left' | 'center' | 'right';

interface TableBlock {
  type: 'table';
  headers: string[];
  alignments: Alignment[];
  rows: string[][];
}

interface ProseBlock {
  type: 'prose';
  lines: string[];
}

type Block = TableBlock | ProseBlock;

export function formatMessage(text: string): React.ReactNode {
  const lines = text.split('\n');
  const blocks = parseBlocks(lines);

  return blocks.map((block, idx) =>
    block.type === 'table' ? renderTable(block, idx) : renderProse(block.lines, idx)
  );
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let prose: string[] = [];
  let i = 0;

  const flushProse = () => {
    if (prose.length > 0) {
      blocks.push({ type: 'prose', lines: prose });
      prose = [];
    }
  };

  while (i < lines.length) {
    const table = tryParseTable(lines, i);
    if (table) {
      flushProse();
      blocks.push(table.block);
      i = table.next;
    } else {
      prose.push(lines[i]);
      i++;
    }
  }
  flushProse();
  return blocks;
}

function cellsOf(line: string): string[] {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((c) => c.trim());
}

function isSeparatorRow(line: string): boolean {
  const cells = cellsOf(line);
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-+:?$/.test(c));
}

function parseAlignments(sepLine: string, columns: number): Alignment[] {
  const cells = cellsOf(sepLine);
  const alignments: Alignment[] = [];
  for (let i = 0; i < columns; i++) {
    const c = cells[i] || '-';
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    if (left && right) alignments.push('center');
    else if (right) alignments.push('right');
    else alignments.push('left');
  }
  return alignments;
}

/**
 * A table is a header row followed by a `---` separator row (GFM). Anything
 * that doesn't match both is left to the prose renderer, so a stray `|` in a
 * sentence never swallows the rest of the reply.
 */
function tryParseTable(lines: string[], start: number): { block: TableBlock; next: number } | null {
  if (start + 1 >= lines.length) return null;
  if (!lines[start].includes('|')) return null;
  if (!isSeparatorRow(lines[start + 1])) return null;

  const headers = cellsOf(lines[start]);
  const sepCells = cellsOf(lines[start + 1]);
  if (headers.length < 2 || sepCells.length !== headers.length) return null;

  const alignments = parseAlignments(lines[start + 1], headers.length);

  const rows: string[][] = [];
  let i = start + 2;
  while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
    const row = cellsOf(lines[i]);
    while (row.length < headers.length) row.push('');
    rows.push(row.slice(0, headers.length));
    i++;
  }

  return { block: { type: 'table', headers, alignments, rows }, next: i };
}

function alignClass(a: Alignment): string {
  return a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';
}

function renderTable(block: TableBlock, key: number): React.ReactNode {
  return (
    <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '10px 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
        <thead>
          <tr>
            {block.headers.map((h, hi) => (
              <th
                key={hi}
                className={alignClass(block.alignments[hi])}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  padding: '6px 10px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatInlineText(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={alignClass(block.alignments[ci])}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px' }}
                >
                  {formatInlineText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderProse(lines: string[], blockKey: number): React.ReactNode {
  return (
    <React.Fragment key={`prose-${blockKey}`}>
      {lines.map((line, lineIndex) => {
        if (!line.trim()) {
          return <br key={`br-${blockKey}-${lineIndex}`} />;
        }

        const isBulletPoint = line.trim().startsWith('-');
        const isNumberedPoint = /^\d+\./.test(line.trim());

        if (isBulletPoint || isNumberedPoint) {
          const content = isBulletPoint
            ? line.trim().substring(1).trim()
            : line.trim().replace(/^\d+\.\s*/, '');

          return (
            <div key={`line-${blockKey}-${lineIndex}`} style={{ marginLeft: '20px', marginTop: '4px' }}>
              <span style={{ marginRight: '8px' }}>
                {isBulletPoint ? '•' : line.trim().match(/^\d+/)?.[0] + '.'}
              </span>
              {formatInlineText(content)}
            </div>
          );
        }

        return (
          <div key={`line-${blockKey}-${lineIndex}`} style={{ marginTop: '4px' }}>
            {formatInlineText(line)}
          </div>
        );
      })}
    </React.Fragment>
  );
}

function formatInlineText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;

  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
