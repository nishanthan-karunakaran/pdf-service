// Global data variable that will be set by the data injection
let individualReportData = null;

// Initialize the report when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Use sample data if available, otherwise wait for data injection
  if (typeof individualData !== 'undefined') {
    setIndividualReportFormData(individualData);
  } else {
    // Set initial ready status for parent component
    window.status = "ready";
  }
});

// Main function to set report data and render the report
window.setIndividualReportFormData = function(inputData) {
  console.log('Setting individual report data:', inputData);
  individualReportData = inputData;
  
  try {
    // Populate Individual information and documents
    populateIndividualInfo(individualReportData);
    generateIndividualFilesTable(individualReportData);
    
    // Mark as ready for PDF generation
    window.status = "ready";
    console.log('Individual KYC report generation completed successfully');
  } catch (error) {
    console.error('Error generating individual report:', error);
    // Still mark as ready even on partial failure to prevent timeout
    window.status = "ready";
    console.log('Individual report generation completed with errors - marked as ready for PDF');
  }
};

// Populate basic individual information
function populateIndividualInfo(data) {
  // Set dynamic report header based on applicationId
  const reportType = getIndividualReportType(data.applicationId);
  document.getElementById('reportHeader').textContent = `${reportType} - INDIVIDUAL`;
  
  // Individual basic info
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.customerName || 'N/A';
  document.getElementById('individualName').textContent = fullName;
  
  // Individual details
  document.getElementById('panNumber').textContent = data.panNumber || 'N/A';
  document.getElementById('dateOfBirth').textContent = formatDate(data.dateOfBirth) || 'N/A';
  document.getElementById('email').textContent = data.email || 'N/A';
  document.getElementById('mobile').textContent = data.mobile || 'N/A';
  
  // Application details
  document.getElementById('applicationId').textContent = `#${data.applicationId || 'N/A'}`;
  document.getElementById('requestedOn').textContent = formatDate(data.submittedAt || data.createdAt);
  document.getElementById('completedOn').textContent = formatDate(data.updatedAt);
}



// Generate individual documents table
function generateIndividualFilesTable(data) {
  const tableBody = document.getElementById('individualFilesBody');
  tableBody.innerHTML = '';
  
  if (!data.documents) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No documents found</td></tr>';
    return;
  }
  
  // Process only proof of identity and proof of address
  const documentTypes = [
    { key: 'proofOfIdentity', label: 'Proof of Identity' },
    { key: 'proofOfAddress', label: 'Proof of Address' }
  ];
  
  documentTypes.forEach(docType => {
    const doc = data.documents[docType.key];
    if (doc && (doc.fileName || doc.s3Url)) {
      const row = createIndividualDocRow(doc, docType.label);
      tableBody.appendChild(row);
    } else {
      // Show row for missing documents
      const row = createEmptyDocRow(docType.label);
      tableBody.appendChild(row);
    }
  });
}

// Create a table row for an individual document
function createIndividualDocRow(doc, docLabel) {
  const row = document.createElement('tr');
  
  // Document Type (Files column) - with extracted content details
  const typeCell = document.createElement('td');
  typeCell.className = 'doc-type';
  
  // Create document type with extracted content details
  const docTypeContainer = document.createElement('div');
  docTypeContainer.innerHTML = `<span class="file-name">${docLabel}</span>`;
  
  
  typeCell.appendChild(docTypeContainer);
  
  // Status
  const statusCell = document.createElement('td');
  const status = getIndividualDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;
  
  // Validation type
  const validationCell = document.createElement('td');
  validationCell.className = 'validation-cell';
  validationCell.textContent = getIndividualValidationType(doc);
  
  // Verified date
  const dateCell = document.createElement('td');
  dateCell.className = 'date-cell';
  dateCell.textContent = formatDate(doc.uploadedAt || doc.verifiedOn);
  
  row.appendChild(typeCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);
  
  return row;
}

// Create a table row for missing document
function createEmptyDocRow(docLabel) {
  const row = document.createElement('tr');
  
  // Document Type (Files column)
  const typeCell = document.createElement('td');
  typeCell.className = 'doc-type';
  typeCell.textContent = docLabel;
  
  // Status
  const statusCell = document.createElement('td');
  statusCell.innerHTML = '<span class="status unverified">Not Uploaded</span>';
  
  // Validation type
  const validationCell = document.createElement('td');
  validationCell.className = 'validation-cell';
  validationCell.textContent = '-';
  
  // Verified date
  const dateCell = document.createElement('td');
  dateCell.className = 'date-cell';
  dateCell.textContent = '-';
  
  row.appendChild(typeCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);
  
  return row;
}

// Utility functions

// Mask Aadhaar number showing only last 4 digits
function maskAadhaarNumber(aadhaarNumber) {
  if (!aadhaarNumber) return '';
  // Remove all non-digits and spaces/hyphens
  const digits = aadhaarNumber.toString().replace(/\D/g, '');
  
  // Check if it's a valid 12-digit Aadhaar number
  if (digits.length !== 12) return aadhaarNumber;
  
  const lastFour = digits.slice(-4);
  return `xxxx-xxxx-${lastFour}`;
}

// Mask extracted content ONLY for Aadhaar number fields
function maskExtractedContent(extractedContent) {
  if (!extractedContent || typeof extractedContent !== 'object') {
    return extractedContent;
  }
  
  const maskedContent = { ...extractedContent };
  
  // Only mask fields that specifically contain Aadhaar numbers
  const aadhaarFields = [
    'aadhaarNumber', 
    'aadharNumber', 
    'uid', 
    'uidai',
    'aadhaar number',
    'aadhar number'
  ];
  
  // Only mask the Aadhaar number fields, leave everything else as-is
  aadhaarFields.forEach(field => {
    if (maskedContent[field]) {
      maskedContent[field] = maskAadhaarNumber(maskedContent[field]);
    }
  });
  
  return maskedContent;
}

function getIndividualReportType(applicationId) {
  // Always return KYC for Individual KYC reports
  return 'KYC';
}

function getIndividualDocumentStatus(doc) {
  // 1. Check for Not Uploaded - no filename
  if (!doc.fileName && !doc.s3Url) {
    return { class: 'unverified', text: 'Not Uploaded' };
  }
  
  // 2. Check for Mismatch - extraction errors
  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return { class: 'mismatch', text: 'Mismatch' };
  }
  
  // 3. Check verification status
  if (doc.isVerified === true || doc.verified === true) {
    return { class: 'verified', text: 'Verified' };
  }
  
  // 4. Default to Uploaded if file exists
  return { class: 'uploaded', text: 'Uploaded' };
}

function getIndividualValidationType(doc) {
  if (doc.extractedContent?.error || doc.extractedData?.error) {
    return 'OCR Error';
  }
  
  if (doc.validationType) {
    return doc.validationType;
  }
  
  return 'Digilocker';
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
    setIndividualReportFormData(payload);
  }
});

console.log('Individual KYC report JavaScript loaded successfully');