'use client'

interface GlitchTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function GlitchText({ text, className = '', style = {} }: GlitchTextProps) {
  return (
    <>
      {text.split('').map((char, idx) => {
        if (char === '0' || char === '1') {
          return (
            <span
              key={idx}
              style={{
                fontSize: '0.9em',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              {char}
            </span>
          )
        }
        return <span key={idx}>{char}</span>
      })}
    </>
  )
}
