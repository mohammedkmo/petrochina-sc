"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PDFTemplate from "./pdf-template";

interface PDFGeneratorProps {
  data: Record<string, unknown>;
  onClose: () => void;
}

export default function PDFGenerator({ data, onClose }: PDFGeneratorProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Security Clearance Forms",
    onBeforePrint: async () => {
      // Wait for fonts to load
      await document.fonts.ready;
      console.log("Fonts loaded, ready to print");
    },
    onAfterPrint: () => {
      console.log("PDF printed successfully");
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex bg-white justify-between items-center p-4 border-b">
          <h2 className="text-md font-bold">معاينة PDF / PDF Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-sm hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
            >
              طباعة PDF / Print PDF
            </button>
            <button
              onClick={onClose}
              className="bg-white border hover:bg-gray-100 text-sm text-gray-700 font-bold py-2 px-4 rounded-md"
            >
              إغلاق / Close
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]" dir="ltr">
          <div
            ref={componentRef}
            className="w-full bg-white"
          >
            <style>
              {`

                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Noto+Naskh+Arabic:wght@400..700&display=swap');
                
                [dir="rtl"], .rtl {
                  direction: rtl;
                  font-family: 'Noto Naskh Arabic','Geist', serif !important;
                }
                
                .arabic {
                  font-family: 'Noto Naskh Arabic','Geist', serif !important;
                  direction: rtl;
                  unicode-bidi: bidi-override;
                  font-weight: 500;
                  line-height: 2.0;
                  letter-spacing: 0.5px;
                  text-rendering: optimizeLegibility;
                }
                
                .font-serif {
                  font-family: 'Noto Naskh Arabic','Geist', serif !important;
                }
              `}
            </style>
            <PDFTemplate data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
