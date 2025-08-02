const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
const fs = require("fs");

const generatePdf = require("./generate-pdf"); // your main logic
const { generateKycusReportPdf } = require("./kycus-report");

// Increase payload limit to 500MB (or higher if needed)
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Serve static files for templates
app.use('/templates', express.static(path.join(__dirname, 'template')));

app.post("/generate", async (req, res) => {
  try {
    const { data, type } = req.body;
    console.log("\nData received for generate endpoint\n")
    const pdfPath = await generatePdf(data, type);
    
    // Read the PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Pdf = pdfBuffer.toString('base64');
    
    // Clean up the temporary file
    fs.unlinkSync(pdfPath);
    
    res.json({ 
      success: true, 
      pdf: base64Pdf,
      filename: `${data.applicationId}-${Date.now()}.pdf`
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/final-report", async (req, res) => {
  try {
    const { data, type } = req.body;
    console.log("\nData received for final-report endpoint\n")
    const pdfPath = await generateKycusReportPdf(data, type);
    
    // Read the PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Pdf = pdfBuffer.toString('base64');
    
    // Clean up the temporary file
    fs.unlinkSync(pdfPath);

    // res.download(pdfPath);
    
    res.json({ 
      success: true, 
      pdf: base64Pdf,
      filename: `${data.applicationId}-${Date.now()}.pdf`
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`PDF service listening on port ${port}`);
});
