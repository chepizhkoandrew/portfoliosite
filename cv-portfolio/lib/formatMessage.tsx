import React from 'react';

export function formatMessage(text: string): React.ReactNode {
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    if (!line.trim()) {
      return <br key={`br-${lineIndex}`} />;
    }

    const isBulletPoint = line.trim().startsWith('-');
    const isNumberedPoint = /^\d+\./.test(line.trim());
    
    if (isBulletPoint || isNumberedPoint) {
      const content = isBulletPoint 
        ? line.trim().substring(1).trim()
        : line.trim().replace(/^\d+\.\s*/, '');
      
      return (
        <div key={`line-${lineIndex}`} style={{ marginLeft: '20px', marginTop: '4px' }}>
          <span style={{ marginRight: '8px' }}>
            {isBulletPoint ? '•' : line.trim().match(/^\d+/)?.[0] + '.'}
          </span>
          {formatInlineText(content)}
        </div>
      );
    }

    return (
      <div key={`line-${lineIndex}`} style={{ marginTop: '4px' }}>
        {formatInlineText(line)}
      </div>
    );
  });
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
    parts.push(
      <strong key={`bold-${match.index}`}>{match[1]}</strong>
    );
    lastIndex = boldRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}
