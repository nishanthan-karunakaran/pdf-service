// Individual KYC Form JavaScript - Consolidated from inline scripts

// Required fields validation configuration
const reqInputs = [
  // Individual KYC Required Fields
  'customerName',
  'dateOfBirth', 
  'firstName',
  'lastName',
  // 'panNumber', // Removed - PAN number is no longer required
  'email',        // Email is required
  'mobile',       // Mobile number is required
  // Mailing Address (required fields)
  'roadName',
  'city', 
  'pinCode',
  'state',
  'country',
  // Permanent Address (required fields) 
  'permRoadName',
  'permCity',
  'permPinCode', 
  'permState',
  'permCountry',
  // Extended KYC Information
  'fatherName',
  'identificationNumber',
  'nationality',
];

// Checkbox groups that require at least one selection
const directCheckBoxes = {
  // Marital Status - at least one required
  'marital-status': ['married', 'unmarried', 'othersMarital'],
  // Identification Type - at least one required (NOT including TIN)
  'identification-type': ['passport', 'drivingLicense', 'aadhaarCard', 'electionCard', 'nregaCard', 'nprLetter'],
  // Occupation - at least one required  
  'occupation': ['salaried', 'selfEmployed', 'retired', 'selfEmployedProfessional', 'student', 'housewife', 'politician', 'othersOccupation'],
  // Gross Annual Income - at least one required
  'gross-annual-income': ['income1', 'income2', 'income3', 'income4', 'income5', 'income6', 'income7', 'income8'],
  // Residence Type - at least one required
  'residence-type': ['owned', 'rentalFamily', 'companyProvided'],
  // Proof of Address - at least one required
  'proof-of-address': ['passportProof', 'voterIdProof', 'drivingLicenseProof', 'nregaJobCard', 'uidAadhaar', 'nprLetterProof'],
};

// Map checkbox groups to their section title text (exact match from form)
const sectionTitles = {
  'marital-status': 'Marital Status',
  'identification-type': 'Identification Type', // Will use smart detection to find the right one
  'occupation': 'Occupation (Financial employed with):',
  'gross-annual-income': 'Gross Annual Income (Please Tick):',
  'residence-type': 'Residence Type:',
  'proof-of-address': 'Proof of Address',
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupOthersCheckboxes();
  setupMutuallyExclusiveGroups();
  setupAddressCopyFunctionality();
});

// Handle Others checkbox functionality
function setupOthersCheckboxes() {
  const othersCheckboxes = [
    'othersOccupation',
    'othersEmployment', 
    'othersProfessional',
    'othersBusiness',
    'othersBusinessType',
    'othersIncome'
  ];

  othersCheckboxes.forEach(function(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const input = document.getElementById(checkboxId + 'Input');
    
    if (checkbox && input) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          input.style.display = 'inline-block';
          input.focus();
        } else {
          input.style.display = 'none';
          input.value = '';
        }
      });
    }
  });
}

// Setup mutually exclusive checkbox groups
function setupMutuallyExclusiveGroups() {
  const mutuallyExclusiveGroups = [
    // Occupation (Financial employed with)
    ['salaried', 'selfEmployed', 'retired', 'selfEmployedProfessional', 'student', 'housewife', 'politician', 'othersOccupation'],
    
    // Employment Type (second row)
    ['privateLimited', 'proprietorship', 'publicSector', 'multinational', 'partnership', 'publicLimited', 'government', 'othersEmployment'],
    
    // PEP section
    ['pepYes', 'pepNo'],
    
    // Marital Status
    ['married', 'unmarried', 'othersMarital'],
    
    // Identification Type
    ['passport', 'drivingLicense', 'aadhaarCard', 'electionCard', 'nregaCard', 'nprLetter'],
    
    // Tax purposes address (other than Mailing address)
    ['residentialBusiness', 'business', 'registeredOffice'],
    
    // Residency Details
    ['residentIndividual', 'nonResidentIndian', 'foreignNational', 'personOfIndianOrigin'],
    
    // Proof of Address
    ['passportProof', 'voterIdProof', 'drivingLicenseProof', 'nregaJobCard', 'uidAadhaar', 'nprLetterProof'],
    
    // Address Type (other than Residential)
    ['residentialBusinessAddress', 'businessAddress', 'registeredOfficeAddress'],
    
    // Nature of Business
    ['agriculture', 'stockBroker', 'realEstate', 'manufacturing', 'serviceProvider', 'trader', 'othersBusiness'],
    
    // Gross Annual Income
    ['income1', 'income2', 'income3', 'income4', 'income5', 'income6', 'income7', 'income8'],
    
    // Source of Income
    ['salary', 'agricultureIncome', 'businessIncome', 'investmentIncome', 'othersIncome'],
    
    // Type of Business/Firm
    ['partnershipBusiness', 'privateLimitedBusiness', 'publicLimitedBusiness', 'soleProprietorship', 'othersBusinessType'],
    
    // Self Employed Professional
    ['cacsicwacma', 'lawyer', 'doctor', 'architect', 'itConsultant', 'othersProfessional'],
    
    // Residence Type
    ['owned', 'rentalFamily', 'companyProvided'],
    
    // Address Change
    ['addressChange', 'noAddressChange']
  ];

  // Add mutually exclusive behavior to each group
  mutuallyExclusiveGroups.forEach(function(group) {
    group.forEach(function(checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      
      if (checkbox) {
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            // Uncheck all other checkboxes in the same group
            group.forEach(function(otherCheckboxId) {
              if (otherCheckboxId !== checkboxId) {
                const otherCheckbox = document.getElementById(otherCheckboxId);
                if (otherCheckbox) {
                  otherCheckbox.checked = false;
                  
                  // If it's an "others" checkbox, also hide its input
                  const otherInput = document.getElementById(otherCheckboxId + 'Input');
                  if (otherInput) {
                    otherInput.style.display = 'none';
                    otherInput.value = '';
                  }
                }
              }
            });
          }
        });
      }
    });
  });
}

// Setup address copy functionality
function setupAddressCopyFunctionality() {
  const sameAsPermAddressCheckbox = document.getElementById('sameAsPermAddress');
  const noAddressChangeCheckbox = document.getElementById('noAddressChange');
  
  if (sameAsPermAddressCheckbox) {
    sameAsPermAddressCheckbox.addEventListener('change', function() {
      if (this.checked) {
        copyPermanentToMailingAddress();
      } else {
        clearMailingAddressFields();
      }
    });
  }

  if (noAddressChangeCheckbox) {
    noAddressChangeCheckbox.addEventListener('change', function() {
      if (this.checked) {
        copyPermanentToMailingAddress();
      } else {
        clearMailingAddressFields();
      }
    });
  }

  // 🔧 FIX: Add real-time validation to remove red styling when user types
  // Set up real-time validation for required input fields
  reqInputs.forEach(function(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      // Add input event listener for real-time feedback
      inputElement.addEventListener('input', function() {
        const value = this.value.trim();
        if (value !== '') {
          // Remove red border when user enters text
          this.style.removeProperty('border-bottom');
        }
      });
      
      // Also handle blur event (when user leaves field)
      inputElement.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value === '') {
          // Add red border back if field is still empty
          this.style.setProperty('border-bottom', '2px solid red', 'important');
        } else {
          // Ensure red border is removed if field has content
          this.style.removeProperty('border-bottom');
        }
      });
    }
  });

  // 🔧 FIX: Add real-time validation for checkbox groups
  Object.keys(directCheckBoxes).forEach(function(groupName) {
    const checkboxIds = directCheckBoxes[groupName];
    
    checkboxIds.forEach(function(checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      if (checkbox) {
        checkbox.addEventListener('change', function() {
          // Check if any checkbox in this group is now checked
          const anyChecked = checkboxIds.some(function(id) {
            const cb = document.getElementById(id);
            return cb && cb.checked;
          });
          
          if (anyChecked) {
            // Remove red styling from section title when any checkbox is selected
            const sectionTitles = {
              'marital-status': 'Marital Status',
              'identification-type': 'Identification Type',
              'occupation': 'Occupation (Financial employed with):',
              'gross-annual-income': 'Gross Annual Income (Please Tick):',
              'residence-type': 'Residence Type:',
              'proof-of-address': 'Proof of Address'
            };
            
            const sectionTitle = sectionTitles[groupName];
            if (sectionTitle) {
              // Enhanced label finding logic for better matching
              const allLabels = [...document.querySelectorAll('.field-label, .section-label, .occupation-label')];
              let sectionLabelElement;
              
              // Try exact match first
              sectionLabelElement = allLabels.find(label => {
                const labelText = label.textContent || '';
                return labelText.includes(sectionTitle);
              });
              
              // If not found, try partial matching for special cases
              if (!sectionLabelElement) {
                if (groupName === 'occupation') {
                  sectionLabelElement = allLabels.find(label => {
                    const labelText = label.textContent || '';
                    return labelText.includes('Occupation (Financial employed with)');
                  });
                } else if (groupName === 'gross-annual-income') {
                  sectionLabelElement = allLabels.find(label => {
                    const labelText = label.textContent || '';
                    return labelText.includes('Gross Annual Income (Please Tick)');
                  });
                } else if (groupName === 'identification-type') {
                  // Find the main identification type section (with required asterisk)
                  sectionLabelElement = allLabels.find(label => {
                    const labelText = label.textContent || '';
                    return labelText.includes('Identification Type') && labelText.includes('*');
                  });
                }
              }
              
              if (sectionLabelElement) {
                sectionLabelElement.style.removeProperty('color');
                sectionLabelElement.style.removeProperty('font-weight');
              }
            }
          }
        });
      }
    });
  });
}

// Copy permanent address to mailing address
function copyPermanentToMailingAddress() {
  // Get permanent address data from stored data or read from form fields
  let permData = window.permanentAddressData;
  
  // If no stored data OR incomplete data (missing flatNumber/roadName), read directly from permanent address fields
  if (!permData || !permData.flatNumber || !permData.roadName) {
    permData = {
      flatNumber: document.getElementById('permFlatNo')?.value || '',
      roadName: document.getElementById('permRoadName')?.value || '',
      city: document.getElementById('permCity')?.value || '',
      state: document.getElementById('permState')?.value || '',
      pincode: document.getElementById('permPinCode')?.value || '',
      country: document.getElementById('permCountry')?.value || 'India'
    };
  }
  
  // Populate mailing address fields with permanent address data
  populateField('flatNo', permData.flatNumber);
  populateField('roadName', permData.roadName);
  populateField('city', permData.city);
  populateField('state', permData.state);
  populateField('pinCode', permData.pincode);
  populateField('country', permData.country);
}

// Clear mailing address fields
function clearMailingAddressFields() {
  clearField('flatNo');
  clearField('roadName');
  clearField('city');
  clearField('state');
  clearField('pinCode');
  clearField('country');
}

// Enhanced populateField function to handle all input types
function populateField(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field && (value !== null && value !== undefined && value !== '')) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      // For checkboxes and radio buttons, set the checked property
      field.checked = Boolean(value);
      if (field.checked) {
        field.classList.add('patched-field');
      }
    } else {
      // For text inputs, textareas, selects, set the value
      field.value = value;
      field.classList.add('patched-field');
    }
    return true;
  }
  return false;
}

// Enhanced clearField function to handle all input types
function clearField(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    if (field.type === 'checkbox' || field.type === 'radio') {
      // For checkboxes and radio buttons, uncheck them
      field.checked = false;
    } else {
      // For text inputs, textareas, selects, clear the value
      field.value = '';
    }
    field.classList.remove('patched-field');
  }
}

// Helper function to display photograph
function displayPhotograph(base64Data) {
  const photoBox = document.querySelector('.photo_box');
  if (photoBox && base64Data) {
    // Create image element
    const img = document.createElement('img');
    img.src = 'data:image/jpeg;base64,' + base64Data;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'fill';
    
    // Clear existing content and add image
    photoBox.innerHTML = '';
    photoBox.appendChild(img);
    return true;
  }
  return false;
}

// Enhanced validation function with section title highlighting
function checkAllReqInputFilled() {
  let firstEmptyElement = null;
  let allInputsFilled = true;

  // Check regular inputs first
  reqInputs.forEach((inputId) => {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      allInputsFilled = false;
      return;
    }

    const isFilled = inputElement.value?.trim() !== '';

    if (!isFilled) {
      inputElement.style.setProperty('border-bottom', '2px solid red', 'important');
      allInputsFilled = false;

      // Track first empty element (input has priority)
      if (!firstEmptyElement) {
        firstEmptyElement = inputElement;
      }
    } else {
      inputElement.style.removeProperty('border-bottom');
    }
  });

  // Check checkboxes - at least one in each group must be selected
  for (const [groupName, checkboxIds] of Object.entries(directCheckBoxes)) {
    
    const isAnyChecked = checkboxIds.some((checkboxId) => {
      const checkbox = document.getElementById(checkboxId);
      const isChecked = checkbox && checkbox.checked;
      return isChecked;
    });

    if (!isAnyChecked) {
      allInputsFilled = false;
      
      // Find and highlight the SECTION TITLE instead of individual checkboxes
      const sectionTitle = sectionTitles[groupName];
      if (sectionTitle) {
        // For identification-type, we need to find the specific one with checkboxes nearby
        let sectionLabelElement;
        
        if (groupName === 'identification-type') {
          // Find the LEFT side "Identification Type" label that has document checkboxes
          const allIdentificationLabels = [...document.querySelectorAll('.field-label, .section-label')].filter(label => {
            return label.textContent && label.textContent.includes('Identification Type');
          });
          
          // Find the one that has DOCUMENT checkboxes (passport, driving license, etc.) - LEFT SIDE
          sectionLabelElement = allIdentificationLabels.find(label => {
            const section = label.closest('.section-a') || label.closest('.table-row');
            if (section) {
              // Look for specific document checkboxes that are on the LEFT side
              const hasDocumentCheckboxes = section.querySelector('#passport') || 
                                          section.querySelector('#drivingLicense') || 
                                          section.querySelector('#aadhaarCard') ||
                                          section.querySelector('#electionCard');
              return hasDocumentCheckboxes;
            }
            return false;
          });
          
          // If still not found, try to find by excluding the TIN one
          if (!sectionLabelElement) {
            sectionLabelElement = allIdentificationLabels.find(label => {
              const labelText = label.textContent || '';
              // Exclude the TIN section (right side) and find the pure "Identification Type" (left side)
              return labelText.includes('Identification Type') && 
                     !labelText.includes('TIN') && 
                     !labelText.includes('please specify');
            });
          }
        } else {
          // For other sections, check all possible label classes
          const allLabels = [...document.querySelectorAll('.field-label, .section-label, .occupation-label')];
          
          // Try exact match first
          sectionLabelElement = allLabels.find(label => {
            const labelText = label.textContent || '';
            return labelText.includes(sectionTitle);
          });
          
          // If not found, try partial match (sometimes there might be extra characters)
          if (!sectionLabelElement) {
            sectionLabelElement = allLabels.find(label => {
              const labelText = (label.textContent || '').toLowerCase();
              const searchText = sectionTitle.toLowerCase();
              const match = labelText.includes(searchText.split('(')[0].trim()); // Match before parentheses
              return match;
            });
          }
        }
        
        if (sectionLabelElement) {
          // Make the SECTION TITLE RED and BOLD only
          sectionLabelElement.style.setProperty('color', 'red', 'important');
          sectionLabelElement.style.setProperty('font-weight', 'bold', 'important');
          
          // Use section title for scrolling
          if (!firstEmptyElement) {
            firstEmptyElement = sectionLabelElement;
          }
        }
      }
    } else {
      // Remove red styling from the SECTION TITLE
      const sectionTitle = sectionTitles[groupName];
      if (sectionTitle) {
        let sectionLabelElement;
        
        if (groupName === 'identification-type') {
          // Find the LEFT side "Identification Type" label that has document checkboxes  
          const allIdentificationLabels = [...document.querySelectorAll('.field-label, .section-label')].filter(label => {
            return label.textContent && label.textContent.includes('Identification Type');
          });
          
          // Find the one that has DOCUMENT checkboxes (passport, driving license, etc.) - LEFT SIDE
          sectionLabelElement = allIdentificationLabels.find(label => {
            const section = label.closest('.section-a') || label.closest('.table-row');
            if (section) {
              // Look for specific document checkboxes that are on the LEFT side
              const hasDocumentCheckboxes = section.querySelector('#passport') || 
                                          section.querySelector('#drivingLicense') || 
                                          section.querySelector('#aadhaarCard') ||
                                          section.querySelector('#electionCard');
              return hasDocumentCheckboxes;
            }
            return false;
          });
          
          // If still not found, try to find by excluding the TIN one
          if (!sectionLabelElement) {
            sectionLabelElement = allIdentificationLabels.find(label => {
              const labelText = label.textContent || '';
              // Exclude the TIN section (right side) and find the pure "Identification Type" (left side)
              return labelText.includes('Identification Type') && 
                     !labelText.includes('TIN') && 
                     !labelText.includes('please specify');
            });
          }
        } else {
          // For other sections, check all possible label classes
          const allLabels = [...document.querySelectorAll('.field-label, .section-label, .occupation-label')];
          
          // Try exact match first
          sectionLabelElement = allLabels.find(label => {
            const labelText = label.textContent || '';
            return labelText.includes(sectionTitle);
          });
          
          // If not found, try enhanced matching for specific sections
          if (!sectionLabelElement) {
            if (groupName === 'occupation') {
              sectionLabelElement = allLabels.find(label => {
                const labelText = label.textContent || '';
                return labelText.includes('Occupation (Financial employed with)');
              });
            } else if (groupName === 'gross-annual-income') {
              sectionLabelElement = allLabels.find(label => {
                const labelText = label.textContent || '';
                return labelText.includes('Gross Annual Income (Please Tick)');
              });
            } else {
              // Fallback to partial match for other sections
              sectionLabelElement = allLabels.find(label => {
                const labelText = (label.textContent || '').toLowerCase();
                const searchText = sectionTitle.toLowerCase();
                return labelText.includes(searchText.split('(')[0].trim());
              });
            }
          }
        }
        
        if (sectionLabelElement) {
          sectionLabelElement.style.removeProperty('color');
          sectionLabelElement.style.removeProperty('font-weight');
        }
      }
    }
  }

  // Scroll to first empty element (input or checkbox)
  if (firstEmptyElement) {
    // Enhanced scrolling that works for both inputs and checkboxes
    firstEmptyElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    // Try to focus if it's a text input
    if (firstEmptyElement.tagName === 'INPUT' && firstEmptyElement.type === 'text') {
      firstEmptyElement.focus();
    }
  }

  // Send validation response
  window.parent.postMessage({
    type: 'CHECK_ALL_REQ_INPUT_FILLED_RESPONSE',
    source: 'kyc-form',
    isFilled: allInputsFilled,
    validationType: 'INDIVIDUAL_KYC',
  }, '*');
}

// Helper function to collect all form data
function collectFormData() {
  const formData = {};
  const inputs = document.querySelectorAll('input, select, textarea');

  inputs.forEach(function(input) {
    const fieldKey = input.id || input.name;
    if (fieldKey) { // Only include fields with ID or name
      if (input.type === 'checkbox' || input.type === 'radio') {
        formData[fieldKey] = input.checked;
      } else {
        formData[fieldKey] = input.value || '';
      }
    }
  });
  
  return formData;
}

// Consolidated message handler for all iframe-parent communication
window.addEventListener('message', function(event) {
  const { type, source } = event.data;
  
  if (source !== 'parent') return; // Only handle messages from parent
  
  // Handle different message types
  switch (type) {
    case 'SET_FORM_DATA':
      try {
        const formData = event.data.payload; 
        
        // Populate form fields with data from API
        if (formData) {
          // Customer Information
          if (formData.customerId) {
            populateField('customerId', formData.customerId);
          }
          
          if (formData.customerName) {
            populateField('customerName', formData.customerName);
          }
          
          if (formData.accountNumber) {
            populateField('accountNumber', formData.accountNumber);
          }
          
          // Personal Information
          if (formData.firstName) {
            populateField('firstName', formData.firstName);
          }
          
          if (formData.lastName) {
            populateField('lastName', formData.lastName);
          }
          
          if (formData.panNumber) {
            populateField('panNumber', formData.panNumber);
          }
          
          if (formData.dateOfBirth) {
            populateField('dateOfBirth', formData.dateOfBirth);
          }
          
          // Contact Information
          if (formData.email) {
            populateField('email', formData.email);
          }
          
          if (formData.phone) {
            populateField('mobile', formData.phone);
          }
          
          // Permanent Address Components (extracted from API)
          if (formData.permFlatNo) {
            populateField('permFlatNo', formData.permFlatNo);
          }
          
          if (formData.permRoadName) {
            populateField('permRoadName', formData.permRoadName);
          }
          
          // Permanent Address Information (if available)
          if (formData.permanentAddress) {
            const permAddr = formData.permanentAddress;
            
            if (permAddr.city) {
              populateField('permCity', permAddr.city);
            }
            
            if (permAddr.state) {
              populateField('permState', permAddr.state);
            }
            
            if (permAddr.pincode) {
              populateField('permPinCode', permAddr.pincode);
            }
            
            if (permAddr.country) {
              populateField('permCountry', permAddr.country);
            }
          }
          
          // Store permanent address data for potential mailing address use
          window.permanentAddressData = {
            flatNumber: formData.flatNumber || '',
            roadName: formData.roadName || '',
            city: formData.permanentAddress?.city || '',
            state: formData.permanentAddress?.state || '',
            pincode: formData.permanentAddress?.pincode || '',
            country: formData.permanentAddress?.country || 'India'
          };
          
          // Handle photograph data (base64)
          if (formData.photographBase64) {
            displayPhotograph(formData.photographBase64);
          }
          
          // Extended KYC Information
          if (formData.fatherName) {
            populateField('fatherName', formData.fatherName);
          }
          
          if (formData.nationality) {
            populateField('nationality', formData.nationality);
          }
          
          if (formData.identificationNumber) {
            populateField('identificationNumber', formData.identificationNumber);
          }
          
          // Handle identification type checkboxes
          if (formData.identificationType) {
            const idTypeMapping = {
              'pancard': 'panCard', // Note: might need to find the PAN card checkbox
              'aadhaar': 'aadhaarCard',
              'driving': 'drivingLicense',
              'passport': 'passport',
              'election': 'electionCard',
              'nrega': 'nregaCard',
              'npr': 'nprLetter'
            };
            
            const checkboxId = idTypeMapping[formData.identificationType];
            if (checkboxId) {
              const checkbox = document.getElementById(checkboxId);
              if (checkbox) {
                checkbox.checked = true;
                checkbox.classList.add('patched-field');
              }
            }
          }
          
          // Handle proof of address type checkboxes
          if (formData.proofOfAddressType) {
            const addressTypeMapping = {
              'uidAadhaar': 'uidAadhaar',
              'driving': 'drivingLicenseProof',
              'passport': 'passportProof',
              'electricity': 'electricityBill',
              'internet': 'internetBill',
              'gas': 'gasBill',
              'landline': 'landlineBill',
              'bank': 'bankStatement',
              'npr': 'nprLetterProof'
            };
            
            const addressCheckboxId = addressTypeMapping[formData.proofOfAddressType];
            if (addressCheckboxId) {
              const checkbox = document.getElementById(addressCheckboxId);
              if (checkbox) {
                checkbox.checked = true;
                checkbox.classList.add('patched-field');
              }
            }
          }
          
          // Handle all checkbox fields
          const checkboxFields = [
            // Occupation checkboxes
            'salaried', 'selfEmployed', 'retired', 'selfEmployedProfessional', 'student', 'housewife', 'politician', 'othersOccupation',
            // Employment type
            'privateLimited', 'proprietorship', 'publicSector', 'multinational', 'partnership', 'publicLimited', 'government', 'othersEmployment',
            // PEP status
            'pepYes', 'pepNo',
            // Professional type
            'cacsicwacma', 'lawyer', 'doctor', 'architect', 'itConsultant', 'othersProfessional',
            // Business type
            'agriculture', 'stockBroker', 'realEstate', 'manufacturing', 'serviceProvider', 'trader', 'othersBusiness',
            // Business structure
            'partnershipBusiness', 'privateLimitedBusiness', 'publicLimitedBusiness', 'soleProprietorship', 'othersBusinessType',
            // Income ranges
            'income1', 'income2', 'income3', 'income4', 'income5', 'income6', 'income7', 'income8',
            // Income sources
            'salary', 'agricultureIncome', 'businessIncome', 'investmentIncome', 'othersIncome',
            // Residence type
            'owned', 'rentalFamily', 'companyProvided',
            // Marital status
            'married', 'unmarried', 'othersMarital',
            // Tax residency
            'taxResidentOutsideIndia',
            // Document types for identification
            'passport', 'drivingLicense', 'aadhaarCard', 'electionCard', 'nregaCard', 'nprLetter',
            // Address types for tax purposes
            'sameAsPermAddress', 'residentialBusiness', 'business', 'registeredOffice',
            // Residency details
            'residentIndividual', 'nonResidentIndian', 'foreignNational', 'personOfIndianOrigin',
            // Proof of address types
            'passportProof', 'voterIdProof', 'drivingLicenseProof', 'nregaJobCard', 'uidAadhaar', 'nprLetterProof',
            // Additional address types
            'residentialBusinessAddress', 'businessAddress', 'registeredOfficeAddress',
            // Form 60 checkbox
            'form60'
          ];
          
          checkboxFields.forEach(field => {
            if (formData[field] !== undefined) {
              populateField(field, formData[field]);
            }
          });

          // Address change options - IMPORTANT FIX
          if (formData.addressChange !== undefined) populateField('addressChange', formData.addressChange);
          if (formData.noAddressChange !== undefined) {
            populateField('noAddressChange', formData.noAddressChange);
            
            // CRITICAL FIX: If checkbox is checked via API, manually trigger address copy
            if (formData.noAddressChange === true) {
              copyPermanentToMailingAddress();
            }
          }
        }
        window.status = 'ready';
      } catch (error) {
        console.error('Error setting form data:', error);
      }
      break;
      
    case 'TRIGGER_SAVE':
      try {
        const formData = collectFormData();
        
        window.parent.postMessage({
          type: 'SAVE_DATA',
          source: 'kyc-form',
          payload: formData
        }, '*');
      } catch (error) {
        console.error('Error saving form data:', error);
      }
      break;
      
    case 'TRIGGER_SUBMIT':
      try {
        const formData = collectFormData();
        
        window.parent.postMessage({
          type: 'SUBMIT_DATA',
          source: 'kyc-form',
          payload: formData
        }, '*');
      } catch (error) {
        window.parent.postMessage({
          type: 'SUBMIT_DATA_ERROR',
          source: 'kyc-form',
          error: error.message
        }, '*');
      }
      break;
      
    case 'CHECK_ALL_REQ_INPUT_FILLED':
      // Use enhanced validation function that includes section title highlighting
      try {
        checkAllReqInputFilled();
      } catch (error) {
        console.error('Error in enhanced validation:', error);
        
        // Fallback to simple validation if enhanced function fails
        let allFilled = true;
        const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(function(input) {
          if (!input.value || input.value.trim() === '') {
            allFilled = false;
          }
        });
        
        window.parent.postMessage({
          type: 'CHECK_ALL_REQ_INPUT_FILLED_RESPONSE',
          source: 'kyc-form',
          isFilled: allFilled,
          validationType: 'INDIVIDUAL_KYC'
        }, '*');
      }
      break;
      
    case 'GET_RENDERED_HTML':
      try {
        const htmlContent = document.documentElement.outerHTML;
        
        window.parent.postMessage({
          type: 'RENDERED_HTML_RESPONSE',
          source: 'kyc-form',
          payload: htmlContent
        }, '*');
      } catch (error) {
        console.error('Error getting rendered HTML:', error);
      }
      break;
      
    default:
      // Ignore unknown message types
      break;
  }
});

// =====================================================
// INLINE SCRIPT CONTENT MOVED FROM HTML
// =====================================================

// Additional DOMContentLoaded handler for Others checkbox functionality (from inline script)
document.addEventListener('DOMContentLoaded', function() {
  const inlineOthersCheckboxes = [
    'othersOccupation',
    'othersEmployment', 
    'othersProfessional',
    'othersBusiness',
    'othersBusinessType',
    'othersIncome'
  ];

  inlineOthersCheckboxes.forEach(function(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const input = document.getElementById(checkboxId + 'Input');
    
    if (checkbox && input) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          input.style.display = 'inline-block';
          input.focus();
        } else {
          input.style.display = 'none';
          input.value = '';
        }
      });
    }
  });

  // Mutually exclusive checkbox groups (from inline script)
  const inlineMutuallyExclusiveGroups = [
    // Occupation (Financial employed with)
    ['salaried', 'selfEmployed', 'retired', 'selfEmployedProfessional', 'student', 'housewife', 'politician', 'othersOccupation'],
    
    // Employment Type (second row)
    ['privateLimited', 'proprietorship', 'publicSector', 'multinational', 'partnership', 'publicLimited', 'government', 'othersEmployment'],
    
    // PEP section
    ['pepYes', 'pepNo'],
    
    // Marital Status
    ['married', 'unmarried', 'othersMarital'],
    
    // Identification Type
    ['passport', 'drivingLicense', 'aadhaarCard', 'electionCard', 'nregaCard', 'nprLetter'],
    
    // Tax purposes address (other than Mailing address)
    ['residentialBusiness', 'business', 'registeredOffice'],
    
    // Residency Details
    ['residentIndividual', 'nonResidentIndian', 'foreignNational', 'personOfIndianOrigin'],
    
    // Proof of Address
    ['passportProof', 'voterIdProof', 'drivingLicenseProof', 'nregaJobCard', 'uidAadhaar', 'nprLetterProof'],
    
    // Address Type (other than Residential)
    ['residentialBusinessAddress', 'businessAddress', 'registeredOfficeAddress'],
    
    // Nature of Business
    ['agriculture', 'stockBroker', 'realEstate', 'manufacturing', 'serviceProvider', 'trader', 'othersBusiness'],
    
    // Gross Annual Income
    ['income1', 'income2', 'income3', 'income4', 'income5', 'income6', 'income7', 'income8'],
    
    // Source of Income
    ['salary', 'agricultureIncome', 'businessIncome', 'investmentIncome', 'othersIncome'],
    
    // Type of Business/Firm
    ['partnershipBusiness', 'privateLimitedBusiness', 'publicLimitedBusiness', 'soleProprietorship', 'othersBusinessType'],
    
    // Self Employed Professional
    ['cacsicwacma', 'lawyer', 'doctor', 'architect', 'itConsultant', 'othersProfessional'],
    
    // Residence Type
    ['owned', 'rentalFamily', 'companyProvided'],
    
    // Address Change
    ['addressChange', 'noAddressChange']
  ];

  // Add mutually exclusive behavior to each group
  inlineMutuallyExclusiveGroups.forEach(function(group) {
    group.forEach(function(checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      
      if (checkbox) {
        checkbox.addEventListener('change', function() {
          if (this.checked) {
            // Uncheck all other checkboxes in the same group
            group.forEach(function(otherCheckboxId) {
              if (otherCheckboxId !== checkboxId) {
                const otherCheckbox = document.getElementById(otherCheckboxId);
                if (otherCheckbox) {
                  otherCheckbox.checked = false;
                  
                  // If it's an "others" checkbox, also hide its input
                  const otherInput = document.getElementById(otherCheckboxId + 'Input');
                  if (otherInput) {
                    otherInput.style.display = 'none';
                    otherInput.value = '';
                  }
                }
              }
            });
          }
        });
      }
    });
  });
});

// Additional message handler for SET_FORM_DATA (from inline script)
window.addEventListener('message', function(event) {
  if (event.data.type === 'SET_FORM_DATA') {
    const formData = event.data.payload;

    
    // Populate form fields with data from API
    if (formData) {
      // Enhanced helper function to populate ALL field types including checkboxes
      function populateFieldInline(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && (value !== null && value !== undefined && value !== '')) {
          if (field.type === 'checkbox' || field.type === 'radio') {
            // For checkboxes and radio buttons, set the checked property
            field.checked = Boolean(value);
            if (field.checked) {
              field.classList.add('patched-field');
            }
  
          } else {
            // For text inputs, textareas, selects, set the value
            field.value = value;
            field.classList.add('patched-field');
  
          }
          return true;
        } else {

        }
        return false;
      }

      // Helper function to display photograph
      function displayPhotographInline(base64Data) {
        const photoBox = document.querySelector('.photo_box');
        if (photoBox && base64Data) {
          // Create image element
          const img = document.createElement('img');
          img.src = 'data:image/jpeg;base64,' + base64Data;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'fill';
          
          // Clear existing content and add image
          photoBox.innerHTML = '';
          photoBox.appendChild(img);
          return true;
        }
        return false;
      }
      
      // Customer Information
      if (formData.customerId) {
        populateFieldInline('customerId', formData.customerId);
      }
      
      if (formData.customerName) {
        populateFieldInline('customerName', formData.customerName);
      }
      
      if (formData.accountNumber) {
        populateFieldInline('accountNumber', formData.accountNumber);
      }
      
      // Personal Information
      if (formData.firstName) {
        populateFieldInline('firstName', formData.firstName);
      }
      
      if (formData.lastName) {
        populateFieldInline('lastName', formData.lastName);
      }
      
      if (formData.panNumber) {
        populateFieldInline('panNumber', formData.panNumber);
      }
      
      if (formData.dateOfBirth) {
        populateFieldInline('dateOfBirth', formData.dateOfBirth);
      }
      
      // Contact Information
      if (formData.email) {
        populateFieldInline('email', formData.email);
      }
      
      if (formData.phone) {
        populateFieldInline('mobile', formData.phone);
      }
      
      // Permanent Address Components (extracted from API)
      if (formData.permFlatNo) {
        populateFieldInline('permFlatNo', formData.permFlatNo);
      }
      
      if (formData.permRoadName) {
        populateFieldInline('permRoadName', formData.permRoadName);
      }
      
      // Permanent Address Information (if available)
      if (formData.permanentAddress) {
        const permAddr = formData.permanentAddress;
        
        if (permAddr.city) {
          populateFieldInline('permCity', permAddr.city);
        }
        
        if (permAddr.state) {
          populateFieldInline('permState', permAddr.state);
        }
        
        if (permAddr.pincode) {
          populateFieldInline('permPinCode', permAddr.pincode);
        }
        
        if (permAddr.country) {
          populateFieldInline('permCountry', permAddr.country);
        }
      }
      
      // Store permanent address data for potential mailing address use
      window.permanentAddressData = {
        flatNumber: formData.flatNumber || '',
        roadName: formData.roadName || '',
        city: formData.permanentAddress?.city || '',
        state: formData.permanentAddress?.state || '',
        pincode: formData.permanentAddress?.pincode || '',
        country: formData.permanentAddress?.country || 'India'
      };
      

      
      // Handle photograph data (base64)
      if (formData.photographBase64) {
        displayPhotographInline(formData.photographBase64);

      }
      
      // Extended KYC Information
      if (formData.fatherName) {
        populateFieldInline('fatherName', formData.fatherName);
      }
      
      if (formData.nationality) {
        populateFieldInline('nationality', formData.nationality);
      }
      
      if (formData.identificationNumber) {
        populateFieldInline('identificationNumber', formData.identificationNumber);
      }
      
      // Handle identification type checkboxes
      if (formData.identificationType) {
        const idTypeMapping = {
          'pancard': 'panCard', // Note: might need to find the PAN card checkbox
          'aadhaar': 'aadhaarCard',
          'driving': 'drivingLicense',
          'passport': 'passport',
          'election': 'electionCard',
          'nrega': 'nregaCard',
          'npr': 'nprLetter'
        };
        
        const checkboxId = idTypeMapping[formData.identificationType];
        if (checkboxId) {
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.checked = true;
            checkbox.classList.add('patched-field');

          }
        }
      }
      
      // Handle proof of address type checkboxes
      if (formData) {
        const addressTypeMapping = {
          'uidAadhaar': 'uidAadhaar',
          'driving': 'drivingLicenseProof',
          'passport': 'passportProof', // might need to find this ID
          'electricity': 'electricityBill', // might need to find this ID
          'internet': 'internetBill', // might need to find this ID
          'gas': 'gasBill', // might need to find this ID
          'landline': 'landlineBill', // might need to find this ID
          'bank': 'bankStatement', // might need to find this ID
          'npr': 'nprLetterProof'
        };
        
        const addressCheckboxId = addressTypeMapping[formData.proofOfAddressType];
        if (addressCheckboxId) {
          const checkbox = document.getElementById(addressCheckboxId);
          if (checkbox) {
            checkbox.checked = true;
            checkbox.classList.add('patched-field');

          }
        }
      }
      
      // ALL CHECKBOX FIELDS - Handle boolean values for checkboxes

      
      // Occupation checkboxes
      if (formData.salaried !== undefined) {
        populateFieldInline('salaried', formData.salaried);

      }
      if (formData.selfEmployed !== undefined) populateFieldInline('selfEmployed', formData.selfEmployed);
      if (formData.retired !== undefined) populateFieldInline('retired', formData.retired);
      if (formData.selfEmployedProfessional !== undefined) populateFieldInline('selfEmployedProfessional', formData.selfEmployedProfessional);
      if (formData.student !== undefined) populateFieldInline('student', formData.student);
      if (formData.housewife !== undefined) populateFieldInline('housewife', formData.housewife);
      if (formData.politician !== undefined) populateFieldInline('politician', formData.politician);
      if (formData.othersOccupation !== undefined) populateFieldInline('othersOccupation', formData.othersOccupation);

      // Employment type
      if (formData.privateLimited !== undefined) populateFieldInline('privateLimited', formData.privateLimited);
      if (formData.proprietorship !== undefined) populateFieldInline('proprietorship', formData.proprietorship);
      if (formData.publicSector !== undefined) populateFieldInline('publicSector', formData.publicSector);
      if (formData.multinational !== undefined) populateFieldInline('multinational', formData.multinational);
      if (formData.partnership !== undefined) populateFieldInline('partnership', formData.partnership);
      if (formData.publicLimited !== undefined) populateFieldInline('publicLimited', formData.publicLimited);
      if (formData.government !== undefined) populateFieldInline('government', formData.government);
      if (formData.othersEmployment !== undefined) populateFieldInline('othersEmployment', formData.othersEmployment);

      // PEP status
      if (formData.pepYes !== undefined) populateFieldInline('pepYes', formData.pepYes);
      if (formData.pepNo !== undefined) populateFieldInline('pepNo', formData.pepNo);

      // Professional type
      if (formData.cacsicwacma !== undefined) populateFieldInline('cacsicwacma', formData.cacsicwacma);
      if (formData.lawyer !== undefined) populateFieldInline('lawyer', formData.lawyer);
      if (formData.doctor !== undefined) populateFieldInline('doctor', formData.doctor);
      if (formData.architect !== undefined) populateFieldInline('architect', formData.architect);
      if (formData.itConsultant !== undefined) populateFieldInline('itConsultant', formData.itConsultant);
      if (formData.othersProfessional !== undefined) populateFieldInline('othersProfessional', formData.othersProfessional);

      // Business type
      if (formData.agriculture !== undefined) populateFieldInline('agriculture', formData.agriculture);
      if (formData.stockBroker !== undefined) populateFieldInline('stockBroker', formData.stockBroker);
      if (formData.realEstate !== undefined) populateFieldInline('realEstate', formData.realEstate);
      if (formData.manufacturing !== undefined) populateFieldInline('manufacturing', formData.manufacturing);
      if (formData.serviceProvider !== undefined) populateFieldInline('serviceProvider', formData.serviceProvider);
      if (formData.trader !== undefined) populateFieldInline('trader', formData.trader);
      if (formData.othersBusiness !== undefined) populateFieldInline('othersBusiness', formData.othersBusiness);

      // Business structure
      if (formData.partnershipBusiness !== undefined) populateFieldInline('partnershipBusiness', formData.partnershipBusiness);
      if (formData.privateLimitedBusiness !== undefined) populateFieldInline('privateLimitedBusiness', formData.privateLimitedBusiness);
      if (formData.publicLimitedBusiness !== undefined) populateFieldInline('publicLimitedBusiness', formData.publicLimitedBusiness);
      if (formData.soleProprietorship !== undefined) populateFieldInline('soleProprietorship', formData.soleProprietorship);
      if (formData.othersBusinessType !== undefined) populateFieldInline('othersBusinessType', formData.othersBusinessType);

      // Income ranges
      if (formData.income1 !== undefined) populateFieldInline('income1', formData.income1);
      if (formData.income2 !== undefined) populateFieldInline('income2', formData.income2);
      if (formData.income3 !== undefined) populateFieldInline('income3', formData.income3);
      if (formData.income4 !== undefined) populateFieldInline('income4', formData.income4);
      if (formData.income5 !== undefined) populateFieldInline('income5', formData.income5);
      if (formData.income6 !== undefined) populateFieldInline('income6', formData.income6);
      if (formData.income7 !== undefined) populateFieldInline('income7', formData.income7);
      if (formData.income8 !== undefined) populateFieldInline('income8', formData.income8);

      // Income sources
      if (formData.salary !== undefined) populateFieldInline('salary', formData.salary);
      if (formData.agricultureIncome !== undefined) populateFieldInline('agricultureIncome', formData.agricultureIncome);
      if (formData.businessIncome !== undefined) populateFieldInline('businessIncome', formData.businessIncome);
      if (formData.investmentIncome !== undefined) populateFieldInline('investmentIncome', formData.investmentIncome);
      if (formData.othersIncome !== undefined) populateFieldInline('othersIncome', formData.othersIncome);

      // Residence type
      if (formData.owned !== undefined) populateFieldInline('owned', formData.owned);
      if (formData.rentalFamily !== undefined) populateFieldInline('rentalFamily', formData.rentalFamily);
      if (formData.companyProvided !== undefined) populateFieldInline('companyProvided', formData.companyProvided);

      // Address change options - IMPORTANT FIX
      if (formData.addressChange !== undefined) populateFieldInline('addressChange', formData.addressChange);
      if (formData.noAddressChange !== undefined) {
        populateFieldInline('noAddressChange', formData.noAddressChange);

        
        // CRITICAL FIX: If checkbox is checked via API, manually trigger address copy
        if (formData.noAddressChange === true) {

          
          // Get permanent address data from stored data or read from form fields
          let permData = window.permanentAddressData;

          
          // If no stored data OR incomplete data (missing flatNumber/roadName), read directly from permanent address fields
          if (!permData || !permData.flatNumber || !permData.roadName) {

            permData = {
              flatNumber: document.getElementById('permFlatNo')?.value || '',
              roadName: document.getElementById('permRoadName')?.value || '',
              city: document.getElementById('permCity')?.value || '',
              state: document.getElementById('permState')?.value || '',
              pincode: document.getElementById('permPinCode')?.value || '',
              country: document.getElementById('permCountry')?.value || 'India'
            };

          } else {

          }
          
          // Populate mailing address fields with permanent address data


          populateFieldInline('flatNo', permData.flatNumber);
          populateFieldInline('roadName', permData.roadName);
          populateFieldInline('city', permData.city);
          populateFieldInline('state', permData.state);
          populateFieldInline('pinCode', permData.pincode);
          populateFieldInline('country', permData.country);
          

        }
      }

      // Marital status
      if (formData.married !== undefined) populateFieldInline('married', formData.married);
      if (formData.unmarried !== undefined) populateFieldInline('unmarried', formData.unmarried);
      if (formData.othersMarital !== undefined) populateFieldInline('othersMarital', formData.othersMarital);

      // Tax residency
      if (formData.taxResidentOutsideIndia !== undefined) populateFieldInline('taxResidentOutsideIndia', formData.taxResidentOutsideIndia);

      // Document types for identification
      if (formData.passport !== undefined) populateFieldInline('passport', formData.passport);
      if (formData.drivingLicense !== undefined) populateFieldInline('drivingLicense', formData.drivingLicense);
      if (formData.aadhaarCard !== undefined) populateFieldInline('aadhaarCard', formData.aadhaarCard);
      if (formData.electionCard !== undefined) populateFieldInline('electionCard', formData.electionCard);
      if (formData.nregaCard !== undefined) populateFieldInline('nregaCard', formData.nregaCard);
      if (formData.nprLetter !== undefined) populateFieldInline('nprLetter', formData.nprLetter);

      // Address types for tax purposes
      if (formData.sameAsPermAddress !== undefined) populateFieldInline('sameAsPermAddress', formData.sameAsPermAddress);
      if (formData.residentialBusiness !== undefined) populateFieldInline('residentialBusiness', formData.residentialBusiness);
      if (formData.business !== undefined) populateFieldInline('business', formData.business);
      if (formData.registeredOffice !== undefined) populateFieldInline('registeredOffice', formData.registeredOffice);

      // Residency details
      if (formData.residentIndividual !== undefined) populateFieldInline('residentIndividual', formData.residentIndividual);
      if (formData.nonResidentIndian !== undefined) populateFieldInline('nonResidentIndian', formData.nonResidentIndian);
      if (formData.foreignNational !== undefined) populateFieldInline('foreignNational', formData.foreignNational);
      if (formData.personOfIndianOrigin !== undefined) populateFieldInline('personOfIndianOrigin', formData.personOfIndianOrigin);

      // Proof of address types - IMPORTANT FIX
      if (formData.passportProof !== undefined) populateFieldInline('passportProof', formData.passportProof);
      if (formData.voterIdProof !== undefined) populateFieldInline('voterIdProof', formData.voterIdProof);
      if (formData.drivingLicenseProof !== undefined) populateFieldInline('drivingLicenseProof', formData.drivingLicenseProof);
      if (formData.nregaJobCard !== undefined) populateFieldInline('nregaJobCard', formData.nregaJobCard);
      if (formData.uidAadhaar !== undefined) {
        populateFieldInline('uidAadhaar', formData.uidAadhaar);

      }
      if (formData.nprLetterProof !== undefined) populateFieldInline('nprLetterProof', formData.nprLetterProof);

      // Additional address types
      if (formData.residentialBusinessAddress !== undefined) populateFieldInline('residentialBusinessAddress', formData.residentialBusinessAddress);
      if (formData.businessAddress !== undefined) populateFieldInline('businessAddress', formData.businessAddress);
      if (formData.registeredOfficeAddress !== undefined) populateFieldInline('registeredOfficeAddress', formData.registeredOfficeAddress);

      // Form 60 checkbox
      if (formData.form60 !== undefined) populateFieldInline('form60', formData.form60);


    }
  }
});

// Additional DOMContentLoaded handler for "Same as permanent address" checkbox functionality (from inline script)
document.addEventListener('DOMContentLoaded', function() {
  const sameAsPermAddressCheckbox = document.getElementById('sameAsPermAddress');
  const noAddressChangeCheckbox = document.getElementById('noAddressChange');
  
  if (sameAsPermAddressCheckbox) {
    sameAsPermAddressCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Get permanent address data from stored data or read from form fields
        let permData = window.permanentAddressData;
        
        // If no stored data, read directly from permanent address fields
        if (!permData) {
          permData = {
            flatNumber: document.getElementById('permFlatNo')?.value || '',
            roadName: document.getElementById('permRoadName')?.value || '',
            city: document.getElementById('permCity')?.value || '',
            state: document.getElementById('permState')?.value || '',
            pincode: document.getElementById('permPinCode')?.value || '',
            country: document.getElementById('permCountry')?.value || 'India'
          };

        } else {

        }
        
        // Populate mailing address fields
        populateFieldInline2('flatNo', permData.flatNumber);
        populateFieldInline2('roadName', permData.roadName);
        populateFieldInline2('city', permData.city);
        populateFieldInline2('state', permData.state);
        populateFieldInline2('pinCode', permData.pincode);
        populateFieldInline2('country', permData.country);
        

      } else {
        // Clear mailing address fields when unchecked
        clearFieldInline2('flatNo');
        clearFieldInline2('roadName');
        clearFieldInline2('city');
        clearFieldInline2('state');
        clearFieldInline2('pinCode');
        clearFieldInline2('country');
        

      }
    });
  }

  // Handle "No change in mailing & permanent address" checkbox
  if (noAddressChangeCheckbox) {
    noAddressChangeCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Get permanent address data from stored data or read from form fields
        let permData = window.permanentAddressData;

        
        // If no stored data OR incomplete data (missing flatNumber/roadName), read directly from permanent address fields
        if (!permData || !permData.flatNumber || !permData.roadName) {

          // Debug: Check if fields exist and have values
          const permFlatNoField = document.getElementById('permFlatNo');
          const permRoadNameField = document.getElementById('permRoadName');


          
          permData = {
            flatNumber: document.getElementById('permFlatNo')?.value || '',
            roadName: document.getElementById('permRoadName')?.value || '',
            city: document.getElementById('permCity')?.value || '',
            state: document.getElementById('permState')?.value || '',
            pincode: document.getElementById('permPinCode')?.value || '',
            country: document.getElementById('permCountry')?.value || 'India'
          };

        } else {

        }
        
        // Populate mailing address fields


        populateFieldInline2('flatNo', permData.flatNumber);
        populateFieldInline2('roadName', permData.roadName);
        populateFieldInline2('city', permData.city);
        populateFieldInline2('state', permData.state);
        populateFieldInline2('pinCode', permData.pincode);
        populateFieldInline2('country', permData.country);
        

      } else {
        // Clear mailing address fields when unchecked
        clearFieldInline2('flatNo');
        clearFieldInline2('roadName');
        clearFieldInline2('city');
        clearFieldInline2('state');
        clearFieldInline2('pinCode');
        clearFieldInline2('country');
        

      }
    });
  }
  
  // Enhanced clearField function to handle all input types
  function clearFieldInline2(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        // For checkboxes and radio buttons, uncheck them
        field.checked = false;
      } else {
        // For text inputs, textareas, selects, clear the value
        field.value = '';
      }
      field.classList.remove('patched-field');
    }
  }
  
  // Enhanced populateField function to handle all input types
  function populateFieldInline2(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && (value !== null && value !== undefined && value !== '')) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        // For checkboxes and radio buttons, set the checked property
        field.checked = Boolean(value);
        if (field.checked) {
          field.classList.add('patched-field');
        }
      } else {
        // For text inputs, textareas, selects, set the value
        field.value = value;
        field.classList.add('patched-field');
      }
      return true;
    }
    return false;
  }
});

// Additional consolidated message handler for all iframe-parent communication (from inline script)
window.addEventListener('message', function(event) {
  const { type, source } = event.data;

  
  if (source !== 'parent') return; // Only handle messages from parent
  
  // Helper function to collect all form data
  function collectFormDataInline() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');

    
    inputs.forEach(function(input) {
      const fieldKey = input.id || input.name;
      if (fieldKey) { // Only include fields with ID or name
        if (input.type === 'checkbox' || input.type === 'radio') {
          formData[fieldKey] = input.checked;
        } else {
          formData[fieldKey] = input.value || '';
        }
      }
    });
    
    return formData;
  }
  
  // Handle different message types
  switch (type) {
    case 'TRIGGER_SAVE':

      try {
        const formData = collectFormDataInline();

        
        window.parent.postMessage({
          type: 'SAVE_DATA',
          source: 'kyc-form',
          payload: formData
        }, '*');
      } catch (error) {

      }
      break;
      
    case 'TRIGGER_SUBMIT':

      try {
        const formData = collectFormDataInline();


        
        window.parent.postMessage({
          type: 'SUBMIT_DATA',
          source: 'kyc-form',
          payload: formData
        }, '*');
        

      } catch (error) {

        window.parent.postMessage({
          type: 'SUBMIT_DATA_ERROR',
          source: 'kyc-form',
          error: error.message
        }, '*');
      }
      break;
      
    case 'CHECK_ALL_REQ_INPUT_FILLED':
      // Use enhanced validation function that includes section title highlighting
      try {
        checkAllReqInputFilled();
      } catch (error) {
        
        // Fallback to simple validation if enhanced function fails
        let allFilled = true;
        const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(function(input) {
          if (!input.value || input.value.trim() === '') {
            allFilled = false;
          }
        });
        
        window.parent.postMessage({
          type: 'CHECK_ALL_REQ_INPUT_FILLED_RESPONSE',
          source: 'kyc-form',
          isFilled: allFilled,
          validationType: 'INDIVIDUAL_KYC'
        }, '*');
      }
      break;
      
    case 'GET_RENDERED_HTML':

      try {
        const htmlContent = document.documentElement.outerHTML;

        
        window.parent.postMessage({
          type: 'RENDERED_HTML_RESPONSE',
          source: 'kyc-form',
          payload: htmlContent
        }, '*');
      } catch (error) {

      }
      break;
      
    default:
      // Ignore unknown message types
      break;
  }
});
