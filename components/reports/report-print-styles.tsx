/** Mounted only with a report. Does not change the interactive application shell. */
export function ReportPrintStyles() {
  return <style>{`
    @media print {
      @page { size: A4; margin: 14mm; }
      body:has([data-dtc-report]) { background: white !important; color: #0f172a !important; }
      body:has([data-dtc-report]) :is(header, nav, aside, footer, [role="dialog"]):not([data-dtc-report] *) {
        display: none !important;
      }
      body:has([data-dtc-report]) a[href="#main-content"],
      body:has([data-dtc-report]) #mobile-navigation { display: none !important; }
      body:has([data-dtc-report]) [class~="lg:pl-72"] { padding-left: 0 !important; }
      body:has([data-dtc-report]) #main-content { min-height: 0 !important; }
      body:has([data-dtc-report]) #main-content > div {
        padding: 0 !important; margin: 0 !important; max-width: none !important;
      }
    }
  `}</style>
}
