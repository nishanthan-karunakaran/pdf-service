const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const TEMPLATE_FOLDER = path.resolve(__dirname, "template");
const OUTPUT_FOLDER = path.resolve(__dirname, "output");
const WAIT_TIMEOUT = 60000; // 60 seconds max for JS rendering
const MAX_RETRIES = 3;

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_FOLDER)) {
  fs.mkdirSync(OUTPUT_FOLDER);
}

// Transform the payload data to match the report template format
function transformDataForReport(payload) {
  // For now, just pass the original data structure since our template functions expect it
  // The template will extract what it needs using the utility functions
  const data = payload.data || payload;
  
  // Just ensure we have the basic fields the template expects
  return {
    ...data,
    entityId: data.applicationId || data.entityId,
    // Keep all original structure intact for utility functions
  };
}

async function generateKycusReportPdf(data, type, attempt = 0) {
  // Transform the data to match the expected format
  const transformedData = transformDataForReport(data);
  
  const applicationId = transformedData.entityId || transformedData.applicationId || "KYCUS";
  const outputPath = path.join(OUTPUT_FOLDER, `${applicationId}-${Date.now()}.pdf`);
  const htmlPath = `file://${path.join(TEMPLATE_FOLDER, "kycusReport", "report.html")}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    console.log(`[${attempt}] Navigating to: ${htmlPath}`);
    await page.goto(htmlPath, {
      waitUntil: "load",
      timeout: 0,
    });

    // Inject data via postMessage (same as working generate endpoint)
    await page.evaluate((data) => {
      window.postMessage(
        {
          type: "SET_FORM_DATA",
          payload: data,
        },
        "*"
      );
    }, transformedData);

    // Wait for JS to finish DOM manipulation using the same pattern as generate-pdf.js
    await page.waitForFunction(() => window.status === "ready", {
      timeout: WAIT_TIMEOUT,
    });

    // Save to PDF
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm"
      }
    });

    console.log(`[${attempt}] KYCUS Report PDF saved at: ${outputPath}`);
    await browser.close();
    return outputPath;
  } catch (err) {
    console.error(`[${attempt}] Error: ${err.message}`);
    const screenshotPath = path.join(OUTPUT_FOLDER, `error-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved error screenshot at: ${screenshotPath}`);

    await browser.close();

    if (attempt + 1 < MAX_RETRIES) {
      console.warn(`[${attempt}] Retrying...`);
      return generateKycusReportPdf(data, type, attempt + 1);
    } else {
      throw new Error("KYCUS Report PDF generation failed after max retries");
    }
  }
}

// Example usage function
async function generateKycusReport(data) {
  try {
    const pdfPath = await generateKycusReportPdf(data, "kycusReport");
    console.log(`Successfully generated KYCUS report: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error("Failed to generate KYCUS report:", error);
    throw error;
  }
}
module.exports = { generateKycusReportPdf, generateKycusReport };
