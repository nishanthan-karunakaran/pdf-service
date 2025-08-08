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

async function generatePdf(data, type, attempt = 0) {
  const applicationId = data.applicationId;
  const outputPath = path.join(OUTPUT_FOLDER, `${applicationId}-${Date.now()}.pdf`);
  // Handle special type mapping for individual-kyc
  let templatePath;
  if (type === 'individual-kyc') {
    templatePath = path.join(TEMPLATE_FOLDER, 'individual', 'kyc', 'kyc.html');
  } else {
    templatePath = path.join(TEMPLATE_FOLDER, type, `${type}.html`);
  }
  const htmlPath = `file://${templatePath}`;

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
        
    // Inject data via postMessage
// await page.evaluate((payload) => {
    //   window.postMessage(payload, "*");
    // }, data);
    await page.evaluate((data) => {
      window.postMessage(
        {
          type: "SET_FORM_DATA",
          source: "parent",
          payload: data,
        },
        "*"
      );
    }, data);

    
    // Wait for JS to finish DOM manipulation
    await page.waitForFunction(() => window.status === "ready", {
      timeout: WAIT_TIMEOUT,
    });

    // Save to PDF
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });

    console.log(`[${attempt}] PDF saved at: ${outputPath}`);
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
      return generatePdf(data, attempt + 1);
    } else {
      throw new Error("PDF generation failed after max retries");
    }
  }
}

module.exports = generatePdf;
