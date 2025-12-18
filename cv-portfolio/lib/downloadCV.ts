export async function downloadCV() {
  try {
    const { default: html2pdf } = await import('html2pdf.js')
    const { PDFDocument } = await import('pdf-lib')

    let cvElement = document.querySelector('[data-cv-content]') as HTMLElement | null
    
    if (!cvElement) {
      const response = await fetch('/cv')
      if (!response.ok) {
        throw new Error('Failed to load CV page')
      }
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      cvElement = doc.querySelector('[data-cv-content]') as HTMLElement | null
      
      if (!cvElement) {
        throw new Error('CV content not found on CV page')
      }
    }

    const elementClone = cvElement.cloneNode(true) as HTMLElement
    
    const visibleH2El = elementClone.querySelector('[data-content-type="visible-h2"]')
    const invisibleH2El = elementClone.querySelector('[data-content-type="invisible-h2"]')
    
    const DEFAULT_VISIBLE_H2 = 'I can build and launch IT products, from idea to a working solution.'
    
    if (visibleH2El && visibleH2El instanceof HTMLElement) {
      visibleH2El.textContent = DEFAULT_VISIBLE_H2
    }
    if (invisibleH2El && invisibleH2El instanceof HTMLElement) {
      invisibleH2El.remove()
    }
    
    const opt = {
      margin: 0,
      filename: 'Andrii_Chepizhko_CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { format: 'a4', orientation: 'portrait', compress: true },
    }
    
    const pdfBlob: Blob = await new Promise((resolve, reject) => {
      html2pdf()
        .set(opt)
        .from(elementClone)
        .toPdf()
        .get('pdf', (pdf: any) => {
          try {
            const blob = pdf.output('blob')
            resolve(blob)
          } catch (e) {
            reject(e)
          }
        })
    })
    
    const pdfBytes = await pdfBlob.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    
    while (pdfDoc.getPageCount() > 1) {
      pdfDoc.removePage(pdfDoc.getPageCount() - 1)
    }
    
    const modifiedPdfBytes = await pdfDoc.save()
    const modifiedBlob = new Blob([modifiedPdfBytes as any], { type: 'application/pdf' })
    
    const url = URL.createObjectURL(modifiedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Andrii_Chepizhko_CV.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    const message = error instanceof Error ? error.message : String(error)
    alert(`Failed to download CV: ${message}`)
  }
}
