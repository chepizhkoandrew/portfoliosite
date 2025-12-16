declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[] | { top: number; left: number; bottom: number; right: number }
    filename?: string
    image?: { type: string; quality: number }
    html2canvas?: Record<string, unknown>
    jsPDF?: Record<string, unknown>
    pagebreak?: { mode: string; before?: string }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement): Html2Pdf
    save(): Promise<void>
  }

  function html2pdf(): Html2Pdf

  export default html2pdf
}
