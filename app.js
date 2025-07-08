const express = require("express");
const app = express();
const port = 3000;

const generatePdf = require("./generate-pdf"); // your main logic

app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { data, type } = req.body;
    console.log("\n", data, "\n")
    const pdfPath = await generatePdf(data, type);
    res.download(pdfPath); // or return URL, base64, etc.
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`PDF service listening on port ${port}`);
});
