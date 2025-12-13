export function createGlitchChar(originalChar: string): string {
  if (originalChar === ' ' || originalChar === '\n' || originalChar === '\t') {
    return originalChar
  }
  return Math.random() > 0.5 ? '1' : '0'
}

export function glitchText(text: string): string {
  return text.split('').map(createGlitchChar).join('')
}

export function partialGlitchText(text: string, progress: number): string {
  const targetIndex = Math.floor(text.length * progress)
  return text
    .split('')
    .map((char, idx) => {
      if (idx < targetIndex) {
        return char
      }
      return createGlitchChar(char)
    })
    .join('')
}

export function rangeGlitchText(
  text: string,
  startIdx: number,
  endIdx: number,
  rangeProgress: number
): string {
  const rangeLength = endIdx - startIdx
  const targetIndex = startIdx + Math.floor(rangeLength * rangeProgress)

  return text
    .split('')
    .map((char, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        if (idx < targetIndex) {
          return char
        }
        return createGlitchChar(char)
      }
      return char
    })
    .join('')
}
