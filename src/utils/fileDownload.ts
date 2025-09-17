/**
 * Downloads content as a TXT file
 */
export async function downloadAsTxt(content: string, filename: string): Promise<void> {
  const cleanFilename = sanitizeFilename(filename);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${cleanFilename}.txt`);
}

/**
 * Downloads content as a PDF file
 * Note: This creates a simple PDF-like format since we don't have PDF libraries
 * In a real app, you'd use libraries like jsPDF or similar
 */
export async function downloadAsPdf(content: string, filename: string): Promise<void> {
  const cleanFilename = sanitizeFilename(filename);
  
  // Create a simple formatted version that looks better when printed/saved as PDF
  const formattedContent = formatContentForPdf(content, filename);
  
  // Create HTML content for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
          }
          h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }
          h2 {
            color: #1e40af;
            margin-top: 30px;
            margin-bottom: 15px;
          }
          p {
            margin-bottom: 15px;
            text-align: justify;
          }
          .intro, .conclusion {
            background-color: #f8fafc;
            padding: 20px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
          }
          ul {
            margin: 15px 0;
            padding-left: 30px;
          }
          li {
            margin-bottom: 8px;
          }
          .metadata {
            text-align: center;
            color: #64748b;
            font-size: 12px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        ${formattedContent}
        <div class="metadata">
          Generated on ${new Date().toLocaleDateString()} by AI Blog Generator
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${cleanFilename}.html`);
}

/**
 * Formats content for PDF-like display
 */
function formatContentForPdf(content: string, title: string): string {
  const lines = content.split('\n');
  let html = '';
  let inList = false;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      return;
    }
    
    // Title (first non-empty line)
    if (index === 0 || (index === 1 && !lines[0].trim())) {
      html += `<h1>${trimmedLine}</h1>`;
    }
    // Detect headings (lines that don't end with punctuation and are short)
    else if (trimmedLine.length < 100 && !trimmedLine.match(/[.!?]$/)) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h2>${trimmedLine}</h2>`;
    }
    // Detect bullet points
    else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${trimmedLine.substring(1).trim()}</li>`;
    }
    // Regular paragraphs
    else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      
      // Check if this might be intro or conclusion
      const isIntro = index < 5 && trimmedLine.length > 100;
      const isConclusion = index > lines.length - 10 && trimmedLine.length > 100 && 
                          (trimmedLine.includes('conclusion') || trimmedLine.includes('summary') || 
                           trimmedLine.includes('in conclusion') || index === lines.length - 1);
      
      if (isIntro || isConclusion) {
        html += `<div class="${isIntro ? 'intro' : 'conclusion'}"><p>${trimmedLine}</p></div>`;
      } else {
        html += `<p>${trimmedLine}</p>`;
      }
    }
  });
  
  if (inList) {
    html += '</ul>';
  }
  
  return html;
}

/**
 * Helper function to download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Sanitizes filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100) // Limit length
    .trim();
}