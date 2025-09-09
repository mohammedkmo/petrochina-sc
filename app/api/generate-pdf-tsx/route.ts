import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import React from 'react';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Render the TSX component directly using dynamic import
    const { renderToStaticMarkup } = await import('react-dom/server');
    const PDFTemplate = (await import('@/components/pdf-template')).default;
    const htmlString = renderToStaticMarkup(React.createElement(PDFTemplate, { data: body }));
    
    // Create the complete HTML document
    const htmlTemplate = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Clearance Forms</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>

    @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap');
    
    body {
      font-family: "Merriweather", "Noto Naskh Arabic", serif;
    }
    
    .font-serif {
      font-family: "Merriweather", "Noto Naskh Arabic", serif;
    }
    
    /* Arabic text support */
    [dir="rtl"], .rtl {
      direction: rtl;
      font-family: "Noto Naskh Arabic", "Merriweather", serif;
    }
    
    .arabic {
      font-family: "Noto Naskh Arabic", "Merriweather", serif;
      direction: rtl;
      unicode-bidi: bidi-override;
      font-weight: 500;
      line-height: 2.0;
      letter-spacing: 0.5px;
      text-rendering: optimizeLegibility;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .break-after-page {
        page-break-after: always;
      }
      
      /* Ensure Arabic fonts are loaded for print */
      * {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  ${htmlString}
</body>
</html>
    `;

    // Launch Puppeteer with environment-specific configuration
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    const browser = await puppeteer.launch(isProduction ? {
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('/tmp'),
      headless: chromium.headless,
    } : {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for fonts to load
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    await browser.close();
    
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=security-clearance.pdf",
      },
    });
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to generate PDF", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
