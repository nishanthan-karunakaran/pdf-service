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
  const data = payload.data || payload;
  
  return {
    entityId: data.applicationId,
    entityName: data.entityName,
    entityType: data.entityType,
    entityDetails: {
      cin: { cinNumber: data.cin },
      gstin: { gstinNumber: data.pan } // Using PAN as GSTIN for now
    },
    submittedAt: data.submittedAt?.$date || data.submittedAt,
    date: data.updatedAt?.$date || data.updatedAt || new Date(),
    
    // Transform entityDocs
    entityDocs: Object.values(data.entityDocs || {}).map(doc => ({
      label: doc.label,
      status: doc.extractedContent?.error ? "Unverified" : "Verified",
      validationType: doc.extractedContent?.error ? "Error" : "OCR",
      verifiedOn: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date(),
      extractedContent: { 
        isVerified: doc.extractedContent?.error ? "Unverified" : "Verified" 
      }
    })),
    
    // Transform authorizedSignatories
    authorizedSignatories: (data.authorizedSignatories || []).map(aus => ({
      name: aus.fullName,
      email: aus.emailAddress,
      documentStatus: Object.values(aus.personalDocuments || {}).map(doc => ({
        docType: "identityProof", // Default to identityProof
        status: doc.extractedData?.error ? "Unverified" : "Verified",
        validationType: doc.extractedData?.error ? "Error" : "OCR",
        verifiedOn: new Date(),
        extractedContent: { 
          isVerified: doc.extractedData?.error ? "Unverified" : "Verified" 
        }
      }))
    }))
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

    // Inject data via setReportFormData function
    await page.evaluate((data) => {
      if (window.setReportFormData) {
        window.setReportFormData(data);
      } else {
        // Fallback to postMessage if setReportFormData is not available
        window.postMessage(
          {
            type: "SET_REPORT_FORM_DATA",
            payload: data,
          },
          "*"
        );
      }
    }, transformedData);

    // Wait for JS to finish DOM manipulation
    await page.waitForFunction(() => {
      // Check if content has been populated and entity name is set
      const content = document.getElementById("content");
      const entityName = document.getElementById("entityName");
      return content && content.innerHTML.trim() !== "" && 
             entityName && entityName.textContent.trim() !== "";
    }, {
      timeout: WAIT_TIMEOUT,
    });

    // Additional wait to ensure all rendering is complete
    await page.waitFor(2000);

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

// Example data structure for KYCUS report
const exampleData = {
  data: {
    applicationId: "REKYCAPP00001",
    entityName: "Ebitaus Private Limited",
    entityType: "PUBLIC_LIMITED",
    cin: "CIN121212121212121212",
    pan: "CIXPN9255M",
    submittedAt: { "$date": "2025-07-07T09:24:19.335Z" },
    updatedAt: { "$date": "2025-07-07T10:08:46.554Z" },
    entityDocs: {
      br: {
        fileName: "3. Hathway.pdf",
        label: "Board Resolution for ReKYC",
        extractedContent: { error: "Not a valid Board Resolution Document" },
        uploadedAt: "2025-07-07T15:01:05.150239"
      },
      coi: {
        fileName: "4. Ebitaus P Ltd - Certificate of Incorporation.pdf",
        label: "Certificate of Incorporation",
        extractedContent: {
          companyName: "EBITAUS PRIVATE LIMITED",
          cin: "U62099TN2023PTC158659"
        },
        uploadedAt: "2025-07-07T15:00:43.711317"
      }
    },
    authorizedSignatories: [
      {
        fullName: "Nishanthan",
        emailAddress: "nishanthan.karunakaran@ebitaus.com",
        personalDocuments: {
          personalpan: {
            fileName: "Nishanthan Pan Card.pdf",
            extractedData: { error: "Not a valid Individual PAN card" }
          }
        }
      }
    ]
  }
};

module.exports = { generateKycusReportPdf, generateKycusReport };
