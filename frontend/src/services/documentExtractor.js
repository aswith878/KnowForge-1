import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// PDF Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Extract text from PDF
 */
async function extractPDF(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const p = await pdf.getPage(page);

    const content = await p.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  return text;
}

/**
 * Extract text from DOCX
 */
async function extractDOCX(arrayBuffer) {
  const result = await mammoth.extractRawText({
    arrayBuffer,
  });

  return result.value;
}

/**
 * Main Function
 */
export async function extractDocumentText(fileUrl) {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error("Unable to download document.");
    }

    const arrayBuffer = await response.arrayBuffer();

    if (fileUrl.toLowerCase().endsWith(".pdf")) {
      return await extractPDF(arrayBuffer);
    }

    if (
      fileUrl.toLowerCase().endsWith(".docx") ||
      fileUrl.toLowerCase().endsWith(".doc")
    ) {
      return await extractDOCX(arrayBuffer);
    }

    return "";
  } catch (err) {
    console.error("Document Extraction Error:", err);

    return "";
  }
}