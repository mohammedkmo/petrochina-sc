import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
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
    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Roboto:wght@400;500&display=swap');
    
    body {
      font-family: 'Roboto', sans-serif;
    }
    
    .font-serif {
      font-family: 'Amiri', serif;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .break-after-page {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  ${htmlString}
</body>
</html>
    `;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
