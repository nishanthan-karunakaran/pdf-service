// Global data variable that will be set by the data injection
let reportData = null;

// Initialize the report when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Use sample data if available, otherwise wait for data injection
  if (typeof data !== "undefined") {
    setReportFormData(data);
  }
});

// Main function to set report data and render the report
window.setReportFormData = function (inputData) {
  console.log("Setting report data:", inputData);
  reportData = inputData;

  // Reset person counter for each new report
  window.personCounter = { director: 0, aus: 0 };

  // Clear all dynamic content containers to prevent duplication
  clearAllContainers();

  try {
    // Populate Page 1: Entity information and files only
    populateEntityInfo(reportData);
    generateEntityFilesTable(reportData);

    // Generate Board Resolution pages if available
    generateBoardResolutionPages(reportData);

    // Generate additional pages for Directors and AUS
    generatePersonPages(reportData);

    // Mark as ready for PDF generation
    window.status = "ready";
    console.log("Multi-page report generation completed successfully");
  } catch (error) {
    console.error("Error generating report:", error);
    // Still mark as ready even on partial failure to prevent timeout
    window.status = "ready";
    console.log(
      "Report generation completed with errors - marked as ready for PDF"
    );
  }
};

// Populate basic entity information on Page 1
function populateEntityInfo(data) {
  // Set dynamic report header based on applicationId
  const reportType = getReportType(data.applicationId);
  document.getElementById(
    "reportHeader"
  ).textContent = `${reportType} - NON INDIVIDUALS`;

  // Entity basic info
  document.getElementById("entityName").textContent = data.entityName || "N/A";
  document.getElementById("entityType").textContent =
    formatEntityType(data.entityType) || "N/A";

  // Get CIN and GSTIN from entity docs if available
  const cin = getCINFromDocs(data) || data.cin || "N/A";
  const gstin = getGSTINFromDocs(data) || data.gstin || "N/A";

  document.getElementById("cin").textContent = cin;
  document.getElementById("gstin").textContent = gstin;

  // Application details
  document.getElementById("applicationId").textContent = `#${
    data.applicationId || "N/A"
  }`;
  document.getElementById("requestedOn").textContent = formatDate(
    data.submittedAt
  );
  document.getElementById("completedOn").textContent = formatDate(
    data.updatedAt
  );
}

// Generate entity files table on Page 1
function generateEntityFilesTable(data) {
  const tableBody = document.getElementById("entityFilesBody");
  tableBody.innerHTML = "";

  if (!data.entityDocs) {
    tableBody.innerHTML =
      '<tr><td colspan="4" class="text-center text-gray">No entity documents found</td></tr>';
    return;
  }

  // Convert entityDocs object to array and process each document
  Object.entries(data.entityDocs).forEach(([key, doc]) => {
    const row = createEntityDocRow(doc);
    tableBody.appendChild(row);
  });
}

// Create a table row for an entity document
function createEntityDocRow(doc) {
  const row = document.createElement("tr");

  // File name/label
  const fileCell = document.createElement("td");
  fileCell.textContent = doc.label || doc.fileName || "Unknown Document";

  // Status
  const statusCell = document.createElement("td");
  const status = getDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;

  // Validation type
  const validationCell = document.createElement("td");
  validationCell.textContent = getValidationType(doc);

  // Verified date
  const dateCell = document.createElement("td");
  dateCell.textContent = formatDate(
    doc.verificationData?.verifiedOn || doc.uploadedAt
  );

  row.appendChild(fileCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);

  return row;
}

// Generate Board Resolution pages (dedicated pages, not on Page 1)
function generateBoardResolutionPages(data) {
  const brDoc = data.entityDocs?.board_resolution;
  if (!brDoc || !brDoc.extractedContent) {
    return; // No board resolution document or extracted content
  }

  const authorizedPersons =
    brDoc.verificationData?.result?.data?.authorizedPersons
      ?.authorizedPersons || [];
  const maxPersonsPerPage = 4; // More space available on dedicated pages
  const container = document.getElementById("dynamic-pages-container");

  // Generate first BR page with main info and first batch of authorized persons
  const firstBRPage = createFirstBRPage(data, brDoc, authorizedPersons, maxPersonsPerPage);
  container.appendChild(firstBRPage);

  // Generate continuation pages if needed
  if (authorizedPersons.length > maxPersonsPerPage) {
    generateBRContinuationPages(
      data,
      brDoc,
      authorizedPersons,
      maxPersonsPerPage
    );
  }
}

// Create first Board Resolution page with main info and authorized persons
function createFirstBRPage(data, brDoc, authorizedPersons, maxPersonsPerPage) {
  const page = document.createElement("div");
  page.className = "page";

  // Header
  const header = document.createElement("div");
  header.className = "page-header";
  const reportType = getReportType(data?.applicationId);
  header.innerHTML = `<h1>${reportType} - NON INDIVIDUALS</h1>`;

  // Content
  const content = document.createElement("div");
  content.className = "page-content";

  // Board Resolution section
  const brSection = document.createElement("div");
  brSection.className = "section board-resolution-section";

  const brTitle = document.createElement("h3");
  brTitle.textContent = "Board Resolution Details";
  brSection.appendChild(brTitle);

  // Create Board Resolution card
  const brCard = document.createElement("div");
  brCard.className = "board-resolution-card";

  // Resolution Information
  const brInfo = document.createElement("div");
  brInfo.className = "board-resolution-info";

  // Get company name from extracted content or fall back to entity name
  const companyName =
    brDoc.verificationData?.result?.data?.entity?.companyName ||
    brDoc.extractedContent.companyName ||
    data.entityName ||
    "N/A";

  const companyNameRow = document.createElement("div");
  companyNameRow.className = "br-detail-row";
  companyNameRow.innerHTML = `
    <span class="br-label">Company Name:</span>
    <span class="br-value">${companyName}</span>
  `;

  const resolutionDate = document.createElement("div");
  resolutionDate.className = "br-detail-row";
  resolutionDate.innerHTML = `
    <span class="br-label">Resolution Date:</span>
    <span class="br-value">${
      formatDate(brDoc.extractedContent.resolutionDate) || "N/A"
    }</span>
  `;

  const purpose = document.createElement("div");
  purpose.className = "br-detail-row";
  purpose.innerHTML = `
    <span class="br-label">Purpose:</span>
    <span class="br-value">${brDoc.extractedContent.purpose || "N/A"}</span>
  `;

  const signedBy = document.createElement("div");
  signedBy.className = "br-detail-row";
  const signedByValue = brDoc.verificationData?.result?.data?.signatureDetails?.signerDetails?.signerName || brDoc.extractedContent.signedBy || "N/A";
  signedBy.innerHTML = `
    <span class="br-label">Signed By:</span>
    <span class="br-value">${signedByValue}</span>
  `;

  brInfo.appendChild(companyNameRow);
  brInfo.appendChild(resolutionDate);
  brInfo.appendChild(purpose);
  brInfo.appendChild(signedBy);

  // Authorized Persons Section (first batch)
  if (authorizedPersons && authorizedPersons.length > 0) {
    const separator = document.createElement("div");
    separator.className = "br-separator";
    brInfo.appendChild(separator);

    const authTitle = document.createElement("div");
    authTitle.className = "br-section-title";
    authTitle.textContent = "Authorized Persons:";
    brInfo.appendChild(authTitle);

    // Show first batch of authorized persons
    const firstBatch = authorizedPersons.slice(0, maxPersonsPerPage);
    firstBatch.forEach((person, index) => {
      const personItem = createBRAuthorizedPersonElement(person);
      brInfo.appendChild(personItem);
    });
  }

  brCard.appendChild(brInfo);
  brSection.appendChild(brCard);
  content.appendChild(brSection);

  // Footer
  const footer = document.createElement("div");
  footer.className = "page-footer";
  footer.innerHTML = "Powered by <strong>Ebitaus</strong>";

  page.appendChild(header);
  page.appendChild(content);
  page.appendChild(footer);

  return page;
}

// Generate Board Resolution continuation pages
function generateBRContinuationPages(
  data,
  brDoc,
  authorizedPersons,
  maxPersonsPerPage
) {
  const remainingPersons = authorizedPersons.slice(maxPersonsPerPage);
  const personsPerContinuationPage = 4; // More space available on dedicated pages
  const container = document.getElementById("dynamic-pages-container");

  for (
    let i = 0;
    i < remainingPersons.length;
    i += personsPerContinuationPage
  ) {
    const personsOnThisPage = remainingPersons.slice(
      i,
      i + personsPerContinuationPage
    );
    const startIndex = maxPersonsPerPage + i + 1;
    const endIndex = Math.min(
      startIndex + personsOnThisPage.length - 1,
      authorizedPersons.length
    );

    const page = createBRContinuationPage(
      data,
      personsOnThisPage,
      startIndex,
      endIndex,
      authorizedPersons.length
    );
    container.appendChild(page);
  }
}

// Create a Board Resolution continuation page
function createBRContinuationPage(
  data,
  personsOnPage,
  startIndex,
  endIndex,
  totalPersons
) {
  const page = document.createElement("div");
  page.className = "page";

  // Header
  const header = document.createElement("div");
  header.className = "page-header";
  const reportType = getReportType(reportData?.applicationId);
  header.innerHTML = `<h1>${reportType} - NON INDIVIDUALS</h1>`;

  // Content
  const content = document.createElement("div");
  content.className = "page-content";

  // Board Resolution Continuation Section
  const brSection = document.createElement("div");
  brSection.className = "section board-resolution-section";

  const brTitle = document.createElement("h3");
  brTitle.textContent = "Board Resolution Details (Continued)";
  brSection.appendChild(brTitle);

  const brCard = document.createElement("div");
  brCard.className = "board-resolution-card";

  const brInfo = document.createElement("div");
  brInfo.className = "board-resolution-info";

  const authTitle = document.createElement("div");
  authTitle.className = "br-section-title";
  authTitle.textContent = "Authorized Persons (Continued):";
  brInfo.appendChild(authTitle);

  // Add persons for this page
  personsOnPage.forEach((person) => {
    const personItem = createBRAuthorizedPersonElement(person);
    brInfo.appendChild(personItem);
  });

  brCard.appendChild(brInfo);
  brSection.appendChild(brCard);
  content.appendChild(brSection);

  // Footer
  const footer = document.createElement("div");
  footer.className = "page-footer";
  footer.innerHTML = "Powered by <strong>Ebitaus</strong>";

  page.appendChild(header);
  page.appendChild(content);
  page.appendChild(footer);

  return page;
}

// Helper function to create authorized person element
function createBRAuthorizedPersonElement(person) {
  const personItem = document.createElement("div");
  personItem.className = "br-authorized-person";

  const personHeader = document.createElement("div");
  personHeader.className = "br-person-header";
  personHeader.innerHTML = `• ${person.fullName}`;

  personItem.appendChild(personHeader);

  // Add authorizations if available
  if (person.authorizations && person.authorizations.length > 0) {
    person.authorizations.forEach((auth) => {
      const authDetail = document.createElement("div");
      authDetail.className = "br-authorization";
      authDetail.innerHTML = `${auth.authorizationType || ""} - ${
        auth.description || ""
      }`;
      personItem.appendChild(authDetail);
    });
  }

  return personItem;
}

// Generate pages for Directors and Authorized Signatories (separated sections)
function generatePersonPages(data) {
  const container = document.getElementById("dynamic-pages-container");
  // Note: Don't clear container here as BR continuation pages might already be added

  // Generate Directors section first
  generateDirectorPages(data, container);

  // Generate AUS section after Directors
  generateAUSPages(data, container);
}

// Generate Director pages (separate section)
function generateDirectorPages(data, container) {
  const directors = data.directors || [];
  if (directors.length === 0) return;

  const directorsPerPage = 2;

  for (let i = 0; i < directors.length; i += directorsPerPage) {
    const directorsOnPage = directors.slice(i, i + directorsPerPage);

    // Convert to expected format
    const personsOnPage = directorsOnPage.map((director, index) => ({
      type: "Director",
      data: director,
      isDirector: true,
    }));

    const page = createPersonPage(personsOnPage, "Directors");
    container.appendChild(page);
  }
}

// Generate AUS pages (separate section)
function generateAUSPages(data, container) {
  const authorizedSignatories = data.authorizedSignatories || [];
  if (authorizedSignatories.length === 0) return;

  const ausPerPage = 2;

  for (let i = 0; i < authorizedSignatories.length; i += ausPerPage) {
    const ausOnPage = authorizedSignatories.slice(i, i + ausPerPage);

    // Convert to expected format
    const personsOnPage = ausOnPage.map((aus, index) => ({
      type: "Authorized Signatory",
      data: aus,
      isDirector: false,
    }));

    const page = createPersonPage(personsOnPage, "Authorized Signatories");
    container.appendChild(page);
  }
}

// Create a page with 1 or 2 people
function createPersonPage(personsOnPage, sectionType) {
  const page = document.createElement("div");
  page.className = "page";

  // Header
  const header = document.createElement("div");
  header.className = "page-header";
  const reportType = getReportType(reportData?.applicationId);
  header.innerHTML = `<h1>${reportType} - NON INDIVIDUALS</h1>`;

  // Content
  const content = document.createElement("div");
  content.className = "page-content two-person-layout";

  // Add all persons on this page (1 or 2)
  personsOnPage.forEach((person, index) => {
    const section = createPersonSection(person, getPersonIndex(person));
    content.appendChild(section);
  });

  // Footer
  const footer = document.createElement("div");
  footer.className = "page-footer";
  footer.innerHTML = "Powered by <strong>Ebitaus</strong>";

  page.appendChild(header);
  page.appendChild(content);
  page.appendChild(footer);

  return page;
}

// Helper function to check if PAN is verified across both proof types
function isPanVerified(personalDocuments) {
  if (!personalDocuments) return false;
  
  const identityPanVerified = personalDocuments?.proofOfIdentity?.verificationData?.isPanDobMatched === true;
  const addressPanVerified = personalDocuments?.proofOfAddress?.verificationData?.isPanDobMatched === true;
  
  return identityPanVerified || addressPanVerified;
}

// Helper function to check if Aadhaar is verified across both proof types
function isAadhaarVerified(personalDocuments) {
  if (!personalDocuments) return false;
  
  const identityAadhaarVerified = personalDocuments?.proofOfIdentity?.verificationData?.isAadhaarDobMatched === true;
  const addressAadhaarVerified = personalDocuments?.proofOfAddress?.verificationData?.isAadhaarDobMatched === true;
  
  return identityAadhaarVerified || addressAadhaarVerified;
}

// Create a section for one person (Director or AUS)
function createPersonSection(person, index) {
  const section = document.createElement("div");
  section.className = "person-section";

  // Header
  const header = document.createElement("div");
  header.className = "person-header";

  const title = document.createElement("h3");
  title.textContent = `${person.type} ${index}`;

  const info = document.createElement("div");
  info.className = "person-info";

  // Add specific details based on type
  if (person.isDirector) {
    // For directors, add name to info as before
    const name = document.createElement("div");
    name.className = "person-name";
    name.textContent =
      person.data.fullName || person.data.name || "Unknown Name";
    info.appendChild(name);

    // Create director card layout
    section.className = "director-card";

    // Director header
    const directorHeader = document.createElement("div");
    directorHeader.className = "director-header";

    const directorTitle = document.createElement("h4");
    directorTitle.textContent = `${person.type} ${index}`;

    // Add verification labels to header based on individual document verification
    const panVerified = isPanVerified(person.data.personalDocuments);
    const aadhaarVerified = isAadhaarVerified(person.data.personalDocuments);

    // Only create verification container if at least one is verified
    if (panVerified || aadhaarVerified || person.data.isVerifiedByUser) {
      const verificationContainer = document.createElement("div");
      verificationContainer.className = "header-verification-labels";

      // Add DIN PAN Match label only if PAN is verified
      if (panVerified || person.data.isVerifiedByUser) {
        const dinPanLabel = document.createElement("div");
        dinPanLabel.className = "verification-label-small";
        dinPanLabel.innerHTML = `DIN PAN Match <span class="tick-icon">✓</span>`;
        verificationContainer.appendChild(dinPanLabel);
      }

      // Add DIN Aadhaar Match label only if Aadhaar is verified
      if (aadhaarVerified || person.data.isVerifiedByUser) {
        const dinAadhaarLabel = document.createElement("div");
        dinAadhaarLabel.className = "verification-label-small";
        dinAadhaarLabel.innerHTML = `DIN Aadhaar Match <span class="tick-icon">✓</span>`;
        verificationContainer.appendChild(dinAadhaarLabel);
      }

      directorHeader.appendChild(directorTitle);
      directorHeader.appendChild(verificationContainer);
    } else {
      directorHeader.appendChild(directorTitle);
    }

    // Director details container
    const directorDetails = document.createElement("div");
    directorDetails.className = "director-details";

    // Detail group 1: Name and Email
    const group1 = document.createElement("div");
    group1.className = "detail-group";

    const nameRow = document.createElement("div");
    nameRow.className = "detail-row";
    nameRow.innerHTML = `
      <span class="label">Full Name:</span>
      <span class="value">${
        person.data.fullName || person.data.name || "N/A"
      }</span>
    `;

    const emailRow = document.createElement("div");
    emailRow.className = "detail-row";
    emailRow.innerHTML = `
      <span class="label">Email Address:</span>
      <span class="value">${person.data.emailAddress || "N/A"}</span>
    `;

    group1.appendChild(nameRow);
    group1.appendChild(emailRow);

    // Detail group 2: DIN and PAN
    const group2 = document.createElement("div");
    group2.className = "detail-group";

    const dinRow = document.createElement("div");
    dinRow.className = "detail-row";
    dinRow.innerHTML = `
      <span class="label">DIN:</span>
      <span class="value">${person.data.din || "N/A"}</span>
    `;

    const panRow = document.createElement("div");
    panRow.className = "detail-row";
    panRow.innerHTML = `
      <span class="label">PAN:</span>
      <span class="value">${person.data.pan || "N/A"}</span>
    `;

    group2.appendChild(dinRow);
    group2.appendChild(panRow);

    // Detail group 3: Designation and Appointment Date
    const group3 = document.createElement("div");
    group3.className = "detail-group";

    const designationRow = document.createElement("div");
    designationRow.className = "detail-row";
    designationRow.innerHTML = `
      <span class="label">Designation:</span>
      <span class="value">${person.data.designation || "N/A"}</span>
    `;

    const appointmentRow = document.createElement("div");
    appointmentRow.className = "detail-row";
    appointmentRow.innerHTML = `
      <span class="label">Date of Appointment:</span>
      <span class="value">${person.data.dateOfAppointment || "N/A"}</span>
    `;

    group3.appendChild(designationRow);
    group3.appendChild(appointmentRow);

    // Append all groups to director details
    directorDetails.appendChild(group1);
    directorDetails.appendChild(group2);
    directorDetails.appendChild(group3);

    // Clear the section and append new structure
    section.innerHTML = "";
    section.appendChild(directorHeader);
    section.appendChild(directorDetails);

    return section;
  } else {
    // AUS details - Create name row with badge at same level
    header.appendChild(title);

    // Create name row with badge on the right
    const nameRow = document.createElement("div");
    nameRow.className = "person-name-row";

    const name = document.createElement("div");
    name.className = "person-name";
    name.textContent =
      person.data.fullName || person.data.name || "Unknown Name";

    nameRow.appendChild(name);

    // Add BR badge at name level if validated
    if (person.data.isValidatedAtBR === true) {
      const brBadge = document.createElement("div");
      brBadge.className = "verification-label-small";
      brBadge.innerHTML = `Validated at BR <span class="tick-icon">✓</span>`;
      nameRow.appendChild(brBadge);
    }

    info.appendChild(nameRow);

    // Add other contact details below name
    if (person.data.emailAddress) {
      const email = document.createElement("div");
      email.className = "person-email";
      email.textContent = person.data.emailAddress;
      info.appendChild(email);
    }

    if (person.data.phoneNumber) {
      const phone = document.createElement("div");
      phone.className = "person-detail";
      phone.textContent = `Phone: ${person.data.phoneNumber}`;
      info.appendChild(phone);
    }

    header.appendChild(info);
  }

  section.appendChild(header);

  // Only add documents table for AUS (Authorized Signatories), not for Directors
  if (!person.isDirector) {
    const table = createPersonDocumentsTable(person);
    section.appendChild(table);
  }

  return section;
}

// Create documents table for a person (only for AUS)
function createPersonDocumentsTable(person) {
  const table = document.createElement("table");
  table.className = "files-table person-table";

  // Table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
      <tr>
        <th>Files</th>
        <th>Status</th>
        <th>Validation</th>
        <th>Verified on</th>
      </tr>
  `;

  // Table body
  const tbody = document.createElement("tbody");

  // AUS - process personal documents
  if (!person.data.personalDocuments) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-gray">No documents found</td></tr>';
  } else {
    let hasDocuments = false;

    // Process personal documents
    Object.entries(person.data.personalDocuments).forEach(([key, doc]) => {
      // Skip documents that are just configuration objects without actual files
      if (shouldIncludeDocument(doc, key)) {
        const row = createPersonDocRow(doc, key);
        tbody.appendChild(row);
        hasDocuments = true;
      }
    });

    if (!hasDocuments) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center text-gray">No documents uploaded</td></tr>';
    }
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}

// Create a table row for a person's document
function createPersonDocRow(doc, docType) {
  const row = document.createElement("tr");

  // File name/type
  const fileCell = document.createElement("td");
  fileCell.textContent = getDocumentLabel(doc, docType);

  // Status
  const statusCell = document.createElement("td");
  const status = getPersonalDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;

  // Validation type
  const validationCell = document.createElement("td");
  validationCell.textContent = getPersonalDocValidationType(doc);

  // Verified date
  const dateCell = document.createElement("td");
  dateCell.textContent = formatDate(doc.uploadedAt || new Date());

  row.appendChild(fileCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);

  return row;
}

// Utility functions

function getReportType(applicationId) {
  if (!applicationId) return "KYC";

  const id = applicationId.toString().toUpperCase();

  // Check for RE-KYC patterns
  if (
    id.includes("REKYC") ||
    id.includes("RE-KYC") ||
    id.includes("REKYCAPP")
  ) {
    return "RE KYC";
  }

  // Default to KYC
  return "KYC";
}

function isPanOrGstinDocument(docType) {
  if (!docType) return false;

  const type = docType.toLowerCase();

  // PAN variations: pan, pan_card, personalpan
  const panPatterns = ["pan", "personalpan", "cin", "coi"];

  // GSTIN variations: gst, gst_certificate, gstin
  const gstinPatterns = ["gst", "gstin"];

  // Check for PAN patterns
  for (const pattern of panPatterns) {
    if (type.includes(pattern)) {
      return true;
    }
  }

  // Check for GSTIN patterns
  for (const pattern of gstinPatterns) {
    if (type.includes(pattern)) {
      return true;
    }
  }

  return false;
}

function getPersonIndex(person) {
  // This will be handled dynamically when we create the pages
  // For now, we'll use a simple counter
  if (!window.personCounter) {
    window.personCounter = { director: 0, aus: 0 };
  }

  if (person.isDirector) {
    return ++window.personCounter.director;
  } else {
    return ++window.personCounter.aus;
  }
}

function shouldIncludeDocument(doc, docType) {
  // Include if it's a direct document with fileName
  if (doc.fileName || doc.s3Url) {
    return true;
  }

  // Include if it's a configuration object with actual data
  if (doc.data && (doc.data.fileName || doc.data.s3Url)) {
    return true;
  }

  // Skip pure configuration objects without files
  return false;
}

function formatEntityType(entityType) {
  if (!entityType) return "";
  return entityType
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCINFromDocs(data) {
  // Check certificate_of_incorporation (your data structure)
  if (data.entityDocs?.certificate_of_incorporation?.extractedContent?.CIN) {
    return data.entityDocs.certificate_of_incorporation.extractedContent.CIN;
  }
  // Check coi alias
  if (data.entityDocs?.coi?.extractedContent?.CIN) {
    return data.entityDocs.coi.extractedContent.CIN;
  }
  if (data.entityDocs?.coi?.extractedContent?.cin) {
    return data.entityDocs.coi.extractedContent.cin;
  }
  // Check root level
  if (data.cin) {
    return data.cin;
  }
  return null;
}

function getGSTINFromDocs(data) {
  // Check gst_certificate (your data structure)
  if (data.entityDocs?.gst_certificate?.extractedContent?.GSTIN) {
    return data.entityDocs.gst_certificate.extractedContent.GSTIN;
  }
  // Check gst alias
  if (data.entityDocs?.gst?.extractedContent?.GSTIN) {
    return data.entityDocs.gst.extractedContent.GSTIN;
  }
  // Check root level
  if (data.gstin) {
    return data.gstin;
  }
  return null;
}

function getDocumentStatus(doc) {
  // 1. Check for Not Uploaded - no filename
  if (!doc.fileName) {
    return { class: "unverified", text: "Not Uploaded" };
  }

  // 2. Check for Mismatch - extraction errors
  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return { class: "mismatch", text: "Mismatch" };
  }

  // 3. Check if PAN/GSTIN document type for Verified vs Uploaded
  const docType = doc.type || doc.documentSubType || doc.selectedType || "";
  if (isPanOrGstinDocument(docType)) {
    return { class: "verified", text: "Validated" };
  }

  // 4. Default to Uploaded for non-PAN/GSTIN documents
  return { class: "verified", text: "Uploaded" };
  // return { class: "uploaded", text: "Uploaded" };
}

function getValidationType(doc) {
  if (doc.verificationData?.validationType) {
    return doc.verificationData.validationType;
  }

  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return "Protean";
  }

  return "MCA";
}

function getPersonalDocumentStatus(doc) {
  // 1. Check for Not Uploaded - no filename in data or direct object
  const hasFileName = doc.fileName || doc.data?.fileName;
  if (!hasFileName) {
    return { class: "unverified", text: "Not Uploaded" };
  }

  // 2. Check for Mismatch - extraction errors
  if (doc.extractedData?.error || doc.data?.extractedContent?.error) {
    return { class: "mismatch", text: "Mismatch" };
  }

  // 3. Check if PAN/GSTIN document type for Verified vs Uploaded
  const docType = doc.documentSubType || doc.selectedType || doc.type || "";
  if (isPanOrGstinDocument(docType)) {
    return { class: "verified", text: "Validated" };
  }

  // 4. Default to Uploaded for non-PAN/GSTIN documents
  return { class: "verified", text: "Uploaded" };
}

function getPersonalDocValidationType(doc) {
  if (
    doc.extractedData?.error ||
    (doc.data && doc.data.extractedContent?.error)
  ) {
    return "Protean";
  }
  return "Internal";
}

function getDocumentLabel(doc, docType) {
  // Handle configuration objects with explicit labels
  if (doc.label) {
    return doc.label;
  }

  // Prioritize document type mapping for better readability
  const typeLabels = {
    personalpan: "PAN",
    aadhar: "Aadhaar",
    "aadhaar-address": "Aadhaar",
    passport: "Passport",
    driving: "Driving License",
    electricity: "Address Proof: Electricity Bill",
    internet: "Address Proof: Internet Bill",
    gas: "Address Proof: Gas Bill",
    photograph: "Photograph",
    signature: "Specimen Signature",
    specimenSignature: "Specimen Signature",
    director_identification_number: "Director Identification Number",
    board_resolution: "Board Resolution",
  };

  // Check document subtype first
  if (doc.documentSubType && typeLabels[doc.documentSubType]) {
    return typeLabels[doc.documentSubType];
  }

  // Check docType parameter
  if (docType && typeLabels[docType]) {
    return typeLabels[docType];
  }

  // Fallback to file name if no type mapping found
  if (doc.fileName) {
    return doc.fileName;
  }

  // Final fallback
  return docType
    ? docType.charAt(0).toUpperCase() + docType.slice(1)
    : "Unknown Document";
}

function formatDate(dateInput) {
  if (!dateInput) return "";

  let date;

  // Handle MongoDB date format
  if (dateInput.$date) {
    date = new Date(dateInput.$date);
  } else if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return "";
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Format as "MAR 25, 2025 09:29 AM"
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", ", ");
}

// Set up message listeners for data injection from PDF generation
window.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "SET_FORM_DATA" && payload) {
    setReportFormData(payload);
  }
});

// Reset person counter for each report generation
window.addEventListener("beforeunload", () => {
  if (window.personCounter) {
    window.personCounter = { director: 0, aus: 0 };
  }
});

// Function to clear all dynamic content containers
function clearAllContainers() {
  console.log("Starting container cleanup for fresh PDF generation...");
  
  // Clear dynamic pages container
  const dynamicContainer = document.getElementById("dynamic-pages-container");
  if (dynamicContainer) {
    dynamicContainer.innerHTML = "";
    console.log("✓ Dynamic pages container cleared");
  }
  
  // Clear entity files table
  const entityFilesBody = document.getElementById("entityFilesBody");
  if (entityFilesBody) {
    entityFilesBody.innerHTML = "";
    console.log("✓ Entity files table cleared");
  }
  
  // Reset entity info fields
  const entityFields = ["entityName", "entityType", "cin", "gstin", "applicationId", "requestedOn", "completedOn"];
  entityFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.textContent = "";
    }
  });
  console.log("✓ Entity info fields reset");
  
  // Reset report header
  const reportHeader = document.getElementById("reportHeader");
  if (reportHeader) {
    reportHeader.textContent = "";
    console.log("✓ Report header reset");
  }
  
  // Force garbage collection hint (optional, for better memory management)
  if (window.gc) {
    window.gc();
  }
  
  console.log("✓ All containers cleared for fresh PDF generation");
}

console.log("Multi-page report JavaScript loaded successfully");
