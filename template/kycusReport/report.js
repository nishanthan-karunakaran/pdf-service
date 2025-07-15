// Global data variable that will be set by the data injection
let reportData = null;

// Initialize the report when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Use sample data if available, otherwise wait for data injection
  if (typeof data !== 'undefined') {
    setReportFormData(data);
  }
});

// Main function to set report data and render the report
window.setReportFormData = function(inputData) {
  console.log('Setting report data:', inputData);
  reportData = inputData;
  
  // Reset person counter for each new report
  window.personCounter = { director: 0, aus: 0 };
  
  try {
    // Populate Page 1: Entity information and files
    populateEntityInfo(reportData);
    generateEntityFilesTable(reportData);
    
    // Generate additional pages for Directors and AUS
    generatePersonPages(reportData);
    
    // Mark as ready for PDF generation
    window.status = "ready";
    console.log('Multi-page report generation completed successfully');
  } catch (error) {
    console.error('Error generating report:', error);
    // Still mark as ready even on partial failure to prevent timeout
    window.status = "ready";
    console.log('Report generation completed with errors - marked as ready for PDF');
  }
};

// Populate basic entity information on Page 1
function populateEntityInfo(data) {
  // Entity basic info
  document.getElementById('entityName').textContent = data.entityName || 'N/A';
  document.getElementById('entityType').textContent = formatEntityType(data.entityType) || 'N/A';
  
  // Get CIN and GSTIN from entity docs if available
  const cin = getCINFromDocs(data) || data.cin || 'N/A';
  const gstin = getGSTINFromDocs(data) || data.gstin || 'N/A';
  
  document.getElementById('cin').textContent = cin;
  document.getElementById('gstin').textContent = gstin;
  
  // Application details
  document.getElementById('applicationId').textContent = `#${data.applicationId || 'N/A'}`;
  document.getElementById('requestedOn').textContent = formatDate(data.submittedAt);
  document.getElementById('completedOn').textContent = formatDate(data.updatedAt);
}

// Generate entity files table on Page 1
function generateEntityFilesTable(data) {
  const tableBody = document.getElementById('entityFilesBody');
  tableBody.innerHTML = '';
  
  if (!data.entityDocs) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No entity documents found</td></tr>';
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
  const row = document.createElement('tr');
  
  // File name/label
  const fileCell = document.createElement('td');
  fileCell.textContent = doc.label || doc.fileName || 'Unknown Document';
  
  // Status
  const statusCell = document.createElement('td');
  const status = getDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;
  
  // Validation type
  const validationCell = document.createElement('td');
  validationCell.textContent = getValidationType(doc);
  
  // Verified date
  const dateCell = document.createElement('td');
  dateCell.textContent = formatDate(doc.verificationData?.verifiedOn || doc.uploadedAt);
  
  row.appendChild(fileCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);
  
  return row;
}

// Generate pages for Directors and Authorized Signatories
function generatePersonPages(data) {
  const container = document.getElementById('dynamic-pages-container');
  container.innerHTML = '';
  
  // Collect all people: Directors first, then AUS
  const allPeople = [];
  
  // Add Directors
  if (data.directors && data.directors.length > 0) {
    data.directors.forEach(director => {
      allPeople.push({
        type: 'Director',
        data: director,
        isDirector: true
      });
    });
  }
  
  // Add Authorized Signatories
  if (data.authorizedSignatories && data.authorizedSignatories.length > 0) {
    data.authorizedSignatories.forEach(aus => {
      allPeople.push({
        type: 'Authorized Signatory',
        data: aus,
        isDirector: false
      });
    });
  }
  
  // Create pages with 2 people per page
  for (let i = 0; i < allPeople.length; i += 2) {
    const person1 = allPeople[i];
    const person2 = allPeople[i + 1] || null; // might be null for last page
    
    const page = createPersonPage(person1, person2, Math.floor(i / 2) + 2);
    container.appendChild(page);
  }
}

// Create a page with 1 or 2 people
function createPersonPage(person1, person2, pageNumber) {
  const page = document.createElement('div');
  page.className = 'page';
  
  // Header
  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = '<h1>RE KYC - NON INDIVIDUALS</h1>';
  
  // Content
  const content = document.createElement('div');
  content.className = 'page-content two-person-layout';
  
  // Add first person
  const section1 = createPersonSection(person1, getPersonIndex(person1));
  content.appendChild(section1);
  
  // Add second person if exists
  if (person2) {
    const section2 = createPersonSection(person2, getPersonIndex(person2));
    content.appendChild(section2);
  }
  
  // Footer
  const footer = document.createElement('div');
  footer.className = 'page-footer';
  footer.innerHTML = 'Powered by <strong>Ebitaus</strong>';
  
  page.appendChild(header);
  page.appendChild(content);
  page.appendChild(footer);
  
  return page;
}

// Create a section for one person (Director or AUS)
function createPersonSection(person, index) {
  const section = document.createElement('div');
  section.className = 'person-section';
  
  // Header
  const header = document.createElement('div');
  header.className = 'person-header';
  
  const title = document.createElement('h3');
  title.textContent = `${person.type} ${index}`;
  
  const info = document.createElement('div');
  info.className = 'person-info';
  
  const name = document.createElement('div');
  name.className = 'person-name';
  name.textContent = person.data.fullName || person.data.name || 'Unknown Name';
  
  info.appendChild(name);
  
  // Add specific details based on type
  if (person.isDirector) {
    // Create director card layout
    section.className = 'director-card';
    
    // Director header
    const directorHeader = document.createElement('div');
    directorHeader.className = 'director-header';
    const directorTitle = document.createElement('h4');
    directorTitle.textContent = `${person.type} ${index}`;
    directorHeader.appendChild(directorTitle);
    
    // Director details container
    const directorDetails = document.createElement('div');
    directorDetails.className = 'director-details';
    
    // Detail group 1: Name and Email
    const group1 = document.createElement('div');
    group1.className = 'detail-group';
    
    const nameRow = document.createElement('div');
    nameRow.className = 'detail-row';
    nameRow.innerHTML = `
      <span class="label">Full Name:</span>
      <span class="value">${person.data.fullName || person.data.name || 'N/A'}</span>
    `;
    
    const emailRow = document.createElement('div');
    emailRow.className = 'detail-row';
    emailRow.innerHTML = `
      <span class="label">Email Address:</span>
      <span class="value">${person.data.emailAddress || 'N/A'}</span>
    `;
    
    group1.appendChild(nameRow);
    group1.appendChild(emailRow);
    
    // Detail group 2: DIN and PAN
    const group2 = document.createElement('div');
    group2.className = 'detail-group';
    
    const dinRow = document.createElement('div');
    dinRow.className = 'detail-row';
    dinRow.innerHTML = `
      <span class="label">DIN:</span>
      <span class="value">${person.data.din || 'N/A'}</span>
    `;
    
    const panRow = document.createElement('div');
    panRow.className = 'detail-row';
    panRow.innerHTML = `
      <span class="label">PAN:</span>
      <span class="value">${person.data.pan || 'N/A'}</span>
    `;
    
    group2.appendChild(dinRow);
    group2.appendChild(panRow);
    
    // Detail group 3: Designation and Appointment Date
    const group3 = document.createElement('div');
    group3.className = 'detail-group';
    
    const designationRow = document.createElement('div');
    designationRow.className = 'detail-row';
    designationRow.innerHTML = `
      <span class="label">Designation:</span>
      <span class="value">${person.data.designation || 'N/A'}</span>
    `;
    
    const appointmentRow = document.createElement('div');
    appointmentRow.className = 'detail-row';
    appointmentRow.innerHTML = `
      <span class="label">Date of Appointment:</span>
      <span class="value">${person.data.dateOfAppointment || 'N/A'}</span>
    `;
    
    group3.appendChild(designationRow);
    group3.appendChild(appointmentRow);
    
    // Append all groups to director details
    directorDetails.appendChild(group1);
    directorDetails.appendChild(group2);
    directorDetails.appendChild(group3);
    
    // Clear the section and append new structure
    section.innerHTML = '';
    section.appendChild(directorHeader);
    section.appendChild(directorDetails);
    
    return section;
  } else {
    // AUS details
    if (person.data.emailAddress) {
      const email = document.createElement('div');
      email.className = 'person-email';
      email.textContent = person.data.emailAddress;
      info.appendChild(email);
    }
    
    if (person.data.phoneNumber) {
      const phone = document.createElement('div');
      phone.className = 'person-detail';
      phone.textContent = `Phone: ${person.data.phoneNumber}`;
      info.appendChild(phone);
    }
  }
  
  header.appendChild(title);
  header.appendChild(info);
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
  const table = document.createElement('table');
  table.className = 'files-table person-table';
  
  // Table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
      <tr>
        <th>Files</th>
        <th>Status</th>
        <th>Validation</th>
        <th>Verified on</th>
      </tr>
  `;
  
  // Table body
  const tbody = document.createElement('tbody');
  
  // AUS - process personal documents
  if (!person.data.personalDocuments) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No documents found</td></tr>';
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
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No documents uploaded</td></tr>';
    }
  }
  
  table.appendChild(thead);
  table.appendChild(tbody);
  
  return table;
}

// Create a table row for a person's document
function createPersonDocRow(doc, docType) {
  const row = document.createElement('tr');
  
  // File name/type
  const fileCell = document.createElement('td');
  fileCell.textContent = getDocumentLabel(doc, docType);
  
  // Status
  const statusCell = document.createElement('td');
  const status = getPersonalDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;
  
  // Validation type
  const validationCell = document.createElement('td');
  validationCell.textContent = getPersonalDocValidationType(doc);
  
  // Verified date
  const dateCell = document.createElement('td');
  dateCell.textContent = formatDate(doc.uploadedAt || new Date());
  
  row.appendChild(fileCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);
  
  return row;
}

// Utility functions

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
  if (!entityType) return '';
  return entityType.replace(/_/g, ' ').toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return { class: 'mismatch', text: 'Mismatch' };
  }
  
  if (doc.verificationData?.isVerified) {
    return { class: 'verified', text: 'Verified' };
  }
  
  // Check if document has valid extracted content
  if (doc.extractedContent && Object.keys(doc.extractedContent).length > 0 && !doc.extractedContent.error) {
    return { class: 'verified', text: 'Verified' };
  }
  
  return { class: 'unverified', text: 'Unverified' };
}

function getValidationType(doc) {
  if (doc.verificationData?.validationType) {
    return doc.verificationData.validationType;
  }
  
  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return 'Protean';
  }
  
  return 'MCA';
}

function getPersonalDocumentStatus(doc) {
  // Handle configuration objects
  if (doc.data) {
    if (doc.data.fileName) {
      return { class: 'verified', text: 'Verified' };
    }
    return { class: 'unverified', text: 'Unverified' };
  }
  
  // Handle direct document objects
  if (doc.extractedData?.error) {
    return { class: 'mismatch', text: 'Mismatch' };
  }
  
  if (doc.fileName && doc.s3Url) {
    return { class: 'verified', text: 'Verified' };
  }
  
  return { class: 'unverified', text: 'Unverified' };
}

function getPersonalDocValidationType(doc) {
  if (doc.extractedData?.error || (doc.data && doc.data.extractedContent?.error)) {
    return 'Protean';
  }
  return 'Digilocker';
}

function getDocumentLabel(doc, docType) {
  // Handle configuration objects
  if (doc.label) {
    return doc.label;
  }
  
  // Handle direct document objects
  if (doc.fileName) {
    return doc.fileName;
  }
  
  // Fallback to document type mapping
  const typeLabels = {
    'personalpan': 'PAN',
    'aadhar': 'Aadhaar',
    'passport': 'Passport',
    'driving': 'Driving License',
    'electricity': 'Address Proof: Electricity Bill',
    'internet': 'Address Proof: Internet Bill',
    'gas': 'Address Proof: Gas Bill',
    'photograph': 'Photograph',
    'specimenSignature': 'Specimen Signature',
    'director_identification_number': 'Director Identification Number',
    'board_resolution': 'Board Resolution'
  };
  
  return typeLabels[docType] || docType.charAt(0).toUpperCase() + docType.slice(1);
}

function formatDate(dateInput) {
  if (!dateInput) return '';
  
  let date;
  
  // Handle MongoDB date format
  if (dateInput.$date) {
    date = new Date(dateInput.$date);
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '';
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Format as "MAR 25, 2025 09:29 AM"
  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options).replace(',', ', ');
}

// Set up message listeners for data injection from PDF generation
window.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  if (type === 'SET_FORM_DATA' && payload) {
    setReportFormData(payload);
  }
});

// Reset person counter for each report generation
window.addEventListener('beforeunload', () => {
  if (window.personCounter) {
    window.personCounter = { director: 0, aus: 0 };
  }
});

console.log('Multi-page report JavaScript loaded successfully');
