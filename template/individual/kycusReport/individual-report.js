// Global data variable that will be set by the data injection
let reportData = null;

// Initialize the report when the page loads
document.addEventListener('DOMContentLoaded', function() {
  if (typeof individualSampleData !== 'undefined') {
    setReportFormData(individualSampleData);
  } else {
    // Set initial ready status for parent component
    window.status = "ready";
  }
});

// Main function to set report data and render the report
window.setReportFormData = function(inputData) {
  console.log('Setting individual report data:', inputData);
  reportData = inputData;
  
  try {
    // Populate individual information and documents
    populateIndividualInfo(reportData);
    generateIndividualFilesTable(reportData);
    
    // Mark as ready for PDF generation
    window.status = "ready";
    console.log('Individual report generation completed successfully');
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
  const reportType = getReportType(data.applicationId);
  document.getElementById('reportHeader').textContent = `${reportType} - INDIVIDUAL`;
  
  // Get individual details from authorizedSignatories[0] or fallback to root level
  const individual = data.authorizedSignatories && data.authorizedSignatories.length > 0 
    ? data.authorizedSignatories[0] 
    : {};
  
  // Individual basic info
  const fullName = data.entityName || individual.fullName || individual.name || 'N/A';
  
  // Use title from API data only if it's a proper title (not "Individual Applicant" type), otherwise default to MR
  let title = 'MR'; // Default
  if (individual.title && !individual.title.toLowerCase().includes('applicant') && !individual.title.toLowerCase().includes('individual')) {
    title = individual.title;
  }
  
  // Set the prominent title display
  document.getElementById('individualTitle').textContent = `${title.toUpperCase()} ${fullName.toUpperCase()}`;
  document.getElementById('panNumber').textContent = data.pan || individual.pan || 'N/A';
  document.getElementById('applicationId').textContent = `#${data.applicationId || 'N/A'}`;
  
  // Personal details from individual object
  document.getElementById('dateOfBirth').textContent = individual.dateOfBirth || individual.dob || 'N/A';
  document.getElementById('email').textContent = individual.emailAddress || individual.email || 'N/A';
  document.getElementById('mobile').textContent = individual.phoneNumber || individual.mobile || individual.phone || 'N/A';
  
  // Application dates
  document.getElementById('requestedOn').textContent = formatDate(data.submittedAt);
  document.getElementById('completedOn').textContent = formatDate(data.updatedAt);
}

// Generate individual personal documents table
function generateIndividualFilesTable(data) {
  const tableBody = document.getElementById('individualFilesBody');
  tableBody.innerHTML = '';
  
  // Get individual from authorizedSignatories[0]
  const individual = data.authorizedSignatories && data.authorizedSignatories.length > 0 
    ? data.authorizedSignatories[0] 
    : {};
  
  if (!individual.personalDocuments) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No personal documents found</td></tr>';
    return;
  }
  
  // Check for PAN and Aadhaar DOB validation
  const dobValidation = checkDOBValidation(individual.personalDocuments);
  
  // Process proofOfIdentity, proofOfAddress, photograph, and specimenSignature
  const documentsToProcess = ['proofOfIdentity', 'proofOfAddress', 'photograph', 'specimenSignature'];
  let hasDocuments = false;
  
  documentsToProcess.forEach(docType => {
    const doc = individual.personalDocuments[docType];
    if (doc && shouldIncludeDocument(doc, docType)) {
      const row = createIndividualDocRow(doc, docType, dobValidation);
      tableBody.appendChild(row);
      hasDocuments = true;
    }
  });
  
  // If no valid documents were added, show empty message
  if (!hasDocuments) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray">No documents uploaded</td></tr>';
  }
}

// Create a table row for an individual document
function createIndividualDocRow(doc, docType, dobValidation) {
  const row = document.createElement('tr');
  
  // File name/label with validation badge if applicable
  const fileCell = document.createElement('td');
  fileCell.className = 'doc-type';
  
  // Add validation badge only for PAN document when PAN and Aadhaar DOB matches
  if (dobValidation.isValid && docType === 'proofOfIdentity') {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'validation-badge';
    badgeDiv.innerHTML = `<span class="badge-text">PAN Aadhaar Validated</span> <span class="tick-icon">✓</span>`;
    fileCell.appendChild(badgeDiv);
  }
  
  const fileName = getDocumentLabel(doc, docType);
  
  // Create file name container
  const fileNameDiv = document.createElement('div');
  fileNameDiv.className = 'file-name';
  fileNameDiv.textContent = fileName;
  
  fileCell.appendChild(fileNameDiv);
  
  // Status
  const statusCell = document.createElement('td');
  const status = getPersonalDocumentStatus(doc);
  statusCell.innerHTML = `<span class="status ${status.class}">${status.text}</span>`;
  
  // Validation type
  const validationCell = document.createElement('td');
  validationCell.className = 'validation-cell';
  validationCell.textContent = getPersonalDocValidationType(doc, docType);
  
  // Verified date
  const dateCell = document.createElement('td');
  dateCell.className = 'date-cell';
  const verifiedDate = doc.data?.verificationData?.verifiedOn || doc.verificationData?.verifiedOn || doc.uploadedAt || doc.data?.uploadedAt;
  dateCell.textContent = formatDate(verifiedDate);
  
  row.appendChild(fileCell);
  row.appendChild(statusCell);
  row.appendChild(validationCell);
  row.appendChild(dateCell);
  
  return row;
}

// Check DOB validation between PAN and Aadhaar documents
function checkDOBValidation(personalDocuments) {
  const proofOfIdentity = personalDocuments.proofOfIdentity;
  const proofOfAddress = personalDocuments.proofOfAddress;
  
  if (!proofOfIdentity || !proofOfAddress) {
    return { isValid: false };
  }
  
  // Get DOB from PAN (proofOfIdentity)
  const panDOB = proofOfIdentity.data?.extractedContent?.dateOfBirth;
  
  // Get DOB from Aadhaar (proofOfAddress)
  const aadhaarDOB = proofOfAddress.data?.extractedContent?.dateOfBirth;
  
  if (panDOB && aadhaarDOB) {
    // Compare dates (normalize format differences)
    const normalizedPanDOB = normalizeDateString(panDOB);
    const normalizedAadhaarDOB = normalizeDateString(aadhaarDOB);
    
    return {
      isValid: normalizedPanDOB === normalizedAadhaarDOB,
      panDOB: panDOB,
      aadhaarDOB: aadhaarDOB
    };
  }
  
  return { isValid: false };
}

// Normalize date strings for comparison
function normalizeDateString(dateStr) {
  if (!dateStr) return '';
  
  // Handle different date formats: DD/MM/YYYY, DD-MM-YYYY, etc.
  const cleaned = dateStr.replace(/[-\/]/g, '/');
  
  try {
    // Try to parse as DD/MM/YYYY
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    console.warn('Error normalizing date:', dateStr);
  }
  
  return dateStr;
}

// Utility functions

function getReportType(applicationId) {
  if (!applicationId) return 'KYC';
  
  const id = applicationId.toString().toUpperCase();
  
  // Check for RE-KYC patterns
  if (id.includes('REKYC') || id.includes('RE-KYC') || id.includes('REKYCAPP')) {
    return 'RE KYC';
  }
  
  // Default to KYC
  return 'KYC';
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

function getPersonalDocumentStatus(doc) {
  // 1. Check for Not Uploaded - no filename in data or direct object
  const hasFileName = doc.fileName || doc.data?.fileName;
  if (!hasFileName) {
    return { class: 'unverified', text: 'Not Uploaded' };
  }
  
  // 2. Check for Mismatch - extraction errors
  if (doc.extractedData?.error || doc.data?.extractedContent?.error) {
    return { class: 'mismatch', text: 'Mismatch' };
  }
  
  // 3. Check if PAN document type for Verified
  const docType = doc.documentSubType || doc.selectedType || doc.type || '';
  if (isPanDocument(docType)) {
    return { class: 'verified', text: 'Verified' };
  }
  
  // 4. Default to Uploaded for non-PAN documents
  return { class: 'verified', text: 'Uploaded' };
}

function isPanDocument(docType) {
  if (!docType) return false;
  
  const type = docType.toLowerCase();
  const panPatterns = ['pan', 'personalpan'];
  
  // Check for PAN patterns
  for (const pattern of panPatterns) {
    if (type.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

function getPersonalDocValidationType(doc, docType) {
  // Check for errors first
  if (doc.extractedData?.error || (doc.data && doc.data.extractedContent?.error)) {
    return 'Internal';
  }
  
  // Determine validation type based on document type and content
  if (docType === 'proofOfAddress') {
    // Aadhaar documents use UIDAI
    return 'UIDAI';
  } else if (docType === 'proofOfIdentity') {
    // PAN documents use PAN
    return 'PAN';
  } else if (docType === 'photograph' || docType === 'specimenSignature') {
    // Photograph and signature use Internal
    return 'Internal';
  }
  
  // Default to Internal for others
  return 'Internal';
}

function getDocumentLabel(doc, docType) {
  // Try to get label from options array
  if (doc.options && doc.options.length > 0) {
    const selectedOption = doc.options.find(option => option.selectedType === doc.selectedType);
    if (selectedOption && selectedOption.label) {
      return selectedOption.label;
    }
  }
  
  // Handle direct label
  if (doc.label) {
    return doc.label;
  }
  
  // Handle nested data fileName
  if (doc.data && doc.data.fileName) {
    return doc.data.fileName;
  }
  
  // Handle direct fileName
  if (doc.fileName) {
    return doc.fileName;
  }
  
  // Fallback to document type mapping
  const typeLabels = {
    'proofOfIdentity': 'Proof of Identity',
    'proofOfAddress': 'Proof of Address',
    'photograph': 'Upload Photograph',
    'specimenSignature': 'Upload Specimen Signature',
    'personalpan': 'PAN Card',
    'aadhar': 'Aadhaar Card',
    'passport': 'Passport',
    'driving': 'Driving License',
    'electricity': 'Electricity Bill',
    'internet': 'Internet Bill',
    'gas': 'Gas Bill',
    'water': 'Water Bill',
    'telephone': 'Telephone Bill',
    'bankStatement': 'Bank Statement'
  };
  
  return typeLabels[docType] || docType.charAt(0).toUpperCase() + docType.slice(1);
}

function getExtractedContent(doc) {
  let extractedData = null;
  
  // Check different possible locations for extracted data
  if (doc.extractedData) {
    extractedData = doc.extractedData;
  } else if (doc.data && doc.data.extractedContent) {
    extractedData = doc.data.extractedContent;
  } else if (doc.extractedContent) {
    extractedData = doc.extractedContent;
  }
  
  if (!extractedData) return null;
  
  // Handle error cases
  if (extractedData.error) {
    return `Error: ${extractedData.error}`;
  }
  
  // Build extracted content display
  const parts = [];
  
  // PAN specific fields
  if (extractedData.PAN || extractedData.pan) {
    parts.push(`PAN: ${extractedData.PAN || extractedData.pan}`);
  }
  
  // Name fields
  if (extractedData.Name || extractedData.name || extractedData.fullName) {
    parts.push(`Name: ${extractedData.Name || extractedData.name || extractedData.fullName}`);
  }
  
  // Date of Birth
  if (extractedData.DOB || extractedData.dob || extractedData.dateOfBirth) {
    parts.push(`DOB: ${extractedData.DOB || extractedData.dob || extractedData.dateOfBirth}`);
  }
  
  // Father's name
  if (extractedData.fatherName || extractedData.father_name) {
    parts.push(`Father: ${extractedData.fatherName || extractedData.father_name}`);
  }
  
  // Aadhaar number
  if (extractedData.aadhaar || extractedData.aadhaarNumber) {
    parts.push(`Aadhaar: ${extractedData.aadhaar || extractedData.aadhaarNumber}`);
  }
  
  // Address
  if (extractedData.address) {
    parts.push(`Address: ${extractedData.address}`);
  }
  
  return parts.length > 0 ? parts.join(' | ') : null;
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
  
  // Format as "Jan 15, 2025, 03:30 PM"
  const options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
}

// Set up message listeners for data injection from PDF generation
window.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  if (type === 'SET_FORM_DATA' && payload) {
    setReportFormData(payload);
  }
});

console.log('Individual report JavaScript loaded successfully');