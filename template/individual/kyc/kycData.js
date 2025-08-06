const reqInputs = [
  'entityCustId',
  'entityName',
  'entityPan',
  'entity-mailing-address',
  'entity-mailing-address-roadName',
  'entity-mailing-address-city',
  'entity-mailing-address-pincode',
  'entity-mailing-address-state',
  'entity-mailing-address-country',
  'entity-contact-address-roadName',
  'entity-contact-address-city',
  'entity-contact-address-pincode',
  'entity-contact-address-state',
  'entity-contact-address-country',
  'entity-contact-address-owned',
];
const directCheckBoxes = {
  // Marital Status - exactly one should be selected (REQUIRED)
  'married': ['data.married'],
  'unmarried': ['data.unmarried'],
  'othersMarital': ['data.othersMarital'],
  
  // Identification Type - at least one should be selected (REQUIRED)
  'passport': ['data.passport'],
  'drivingLicense': ['data.drivingLicense'],
  'aadhaarCard': ['data.aadhaarCard'],
  'electionCard': ['data.electionCard'],
  'nregaCard': ['data.nregaCard'],
  'nprLetter': ['data.nprLetter'],
  
  // Proof of Address - at least one should be selected (REQUIRED)
  'passportProof': ['data.passportProof'],
  'voterIdProof': ['data.voterIdProof'],
  'drivingLicenseProof': ['data.drivingLicenseProof'],
  'nregaJobCard': ['data.nregaJobCard'],
  'uidAadhaar': ['data.uidAadhaar'],
  'nprLetterProof': ['data.nprLetterProof'],
  
  // Occupation checkboxes - at least one should be selected
  'salaried': ['data.salaried'],
  'selfEmployed': ['data.selfEmployed'],
  'retired': ['data.retired'],
  'selfEmployedProfessional': ['data.selfEmployedProfessional'],
  'student': ['data.student'],
  'housewife': ['data.housewife'],
  'politician': ['data.politician'],
  'othersOccupation': ['data.othersOccupation'],
  
  // Residency Status - at least one should be selected
  'residentIndividual': ['data.residentIndividual'],
  'nonResidentIndian': ['data.nonResidentIndian'],
  'foreignNational': ['data.foreignNational'],
  'personOfIndianOrigin': ['data.personOfIndianOrigin'],
  
  // Form 60 checkbox (standalone if no PAN)
  'form60': ['data.form60'],
};

function sendSaveData() {
  window.parent.postMessage(
    {
      type: 'SAVE_DATA',
      source: 'kyc-form',
      payload: data || { message: 'nothing loaded yet' },
    },
    '*',
  );
}

function setFormData(payload) {
  console.log('=== setFormData called ===');
  console.log('Payload received:', payload);
  console.log('Payload type:', typeof payload);
  console.log('Payload keys:', payload ? Object.keys(payload) : 'No payload');

  // Simplify to just use the payload directly as form data
  data = payload || {};

  const { entityType } = data;

  console.log('entityType', entityType);
  console.log('Full data received:', data);
  console.log('Data structure:', JSON.stringify(data, null, 2));
  isProprietor = entityType?.toLowerCase()?.includes('prop');
  console.log('isProprietor:', isProprietor);

  // Call renderAll to populate the form with data
  if (typeof renderAll === 'function') {
    console.log('renderAll function found, calling it...');
    renderAll();
  } else {
    console.error('renderAll function not found');
  }
  disableEditAfterSubmit();
}

function disableEditAfterSubmit() {
  const status = data?.status || false;
  if (status) {
    document.querySelectorAll('input, select, textarea, button').forEach((element) => {
      element.disabled = true; // Disable all form elements
    });
    document.body.style.pointerEvents = 'none'; // Disable all interactions with the body
  }
}

function checkAllReqInputFilled() {
  // NOTE: This function is NOT used by individual KYC. See kyc.js instead.
  console.log('=== Starting validation ===');
  console.log('Current data object:', data);
  
  // Test if we can find any checkbox labels
  const testLabel = document.querySelector('label[for="married"]');
  console.log('Test: Can we find married label?', testLabel);
  
  // Test if we can find the directCheckBoxes
  console.log('directCheckBoxes object:', directCheckBoxes);
  
  let firstEmptyInput = null;
  let firstEmptyCheckboxLabel = null;
  let allInputsFilled = true;

  // Check regular inputs
  reqInputs.forEach((inputId) => {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.warn(`Missing input: ${inputId}`);
      allInputsFilled = false;
      return;
    }

    const isFilled = inputElement.value?.trim() !== '';

    if (!isFilled) {
      inputElement.style.setProperty('border-bottom', '2px solid red', 'important');
      allInputsFilled = false;

      if (!firstEmptyInput) {
        firstEmptyInput = inputElement;
      }
    } else {
      inputElement.style.removeProperty('border-bottom');
    }
  });

  // Check checkboxes using the values in the provided data object
  console.log('=== Checking checkboxes ===');
  console.log('directCheckBoxes:', directCheckBoxes);
  console.log('data object:', data);
  
  for (const [checkboxId, checkboxPaths] of Object.entries(directCheckBoxes)) {
    // Find the label element that corresponds to this checkbox
    const labelElement = document.querySelector(`label[for="${checkboxId}"]`);
    
    if (!labelElement) {
      console.warn(`Label element not found for checkbox: ${checkboxId}`);
      continue;
    }
    
    // Check both the data object AND the actual checkbox state
    const dataChecked = checkboxPaths.some((path) => {
      try {
        const value = eval(path); // Using eval to access the value directly from the path
        console.log(`Checking ${checkboxId} with path ${path}:`, value);
        return value && (value === true || (typeof value === 'string' && value.trim())); // Check if the value is truthy
      } catch (error) {
        console.error(`Error evaluating path ${path}:`, error);
        return false;
      }
    });
    
    // Also check the actual checkbox HTML element
    const checkboxElement = document.getElementById(checkboxId);
    const htmlChecked = checkboxElement ? checkboxElement.checked : false;
    
    // Consider it checked if either the data says it's checked OR the HTML checkbox is checked
    const isChecked = dataChecked || htmlChecked;
    console.log(`${checkboxId} - dataChecked: ${dataChecked}, htmlChecked: ${htmlChecked}, final: ${isChecked}`);

    if (!isChecked) {
      // Make checkbox labels red to show which ones are unchecked - HIGHLY VISIBLE
      labelElement.style.setProperty('color', 'red', 'important');
      labelElement.style.setProperty('border', '2px solid red', 'important');
      labelElement.style.setProperty('background-color', '#ffe6e6', 'important');
      labelElement.style.setProperty('padding', '2px 4px', 'important');
      labelElement.style.setProperty('border-radius', '3px', 'important');
      allInputsFilled = false;
      console.log(`✅ Setting RED styling for label of checkbox: ${checkboxId}`);

      if (!firstEmptyCheckboxLabel) {
        firstEmptyCheckboxLabel = labelElement;
      }
    } else {
      // Remove red styling when checkbox is checked
      labelElement.style.removeProperty('color');
      labelElement.style.removeProperty('border');
      labelElement.style.removeProperty('background-color');
      labelElement.style.removeProperty('padding');
      labelElement.style.removeProperty('border-radius');
      console.log(`✅ Removing red styling for label of checkbox: ${checkboxId}`);
    }
  }

  if (firstEmptyInput) firstEmptyInput.focus();
  else if (firstEmptyCheckboxLabel)
    firstEmptyCheckboxLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  window.parent.postMessage(
    {
      type: 'CHECK_ALL_REQ_INPUT_FILLED_RESPONSE',
      source: 'kyc-form',
      isFilled: allInputsFilled,
      validationType: 'INDIVIDUAL_KYC'
    },
    '*',
  );
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Tab' && isCheckedAllReqInputFilled) {
    const current = document.activeElement;

    const unfilledInputs = reqInputs
      .map((id) => document.getElementById(id))
      .filter((el) => el?.value?.trim() === '');

    if (unfilledInputs.length === 0) return; // All filled, allow default

    const currentIndex = unfilledInputs.indexOf(current);

    e.preventDefault();

    if (currentIndex === -1 || currentIndex === unfilledInputs.length - 1) {
      // Not in list or last item — loop to first unfilled
      unfilledInputs[0].focus();
    } else {
      // Move to next unfilled
      unfilledInputs[currentIndex + 1].focus();
    }
  }
});

// Message handling moved to rekyc.js for better organization

function getByPath(obj, pathArray) {
  return pathArray.reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    if (typeof key === 'object' && key.findById !== undefined) {
      return Array.isArray(acc) ? acc.find((item) => item.ausId === key.findById) : undefined;
    }
    return acc[key];
  }, obj);
}

function setByPath(obj, pathArray, value) {
  pathArray.reduce((acc, key, index) => {
    if (index === pathArray.length - 1) {
      // Handling special case for finding by ID
      if (typeof key === 'object' && key.findById !== undefined) {
        const item = acc.find((item) => item.ausId === key.findById);
        if (item) item[pathArray[index + 1]] = value; // Set the value on the specific field
      } else {
        acc[key] = value;
      }
    } else {
      if (typeof key === 'object' && key.findById !== undefined) {
        const item = acc.find((item) => item.ausId === key.findById);
        if (item) return item;
        else return {};
      }
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }
  }, obj);
}

function deleteByPath(obj, pathArray) {
  if (pathArray.length === 0) return;
  const lastKey = pathArray[pathArray.length - 1];
  const parent = pathArray.slice(0, -1).reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    if (typeof key === 'object' && key.findById !== undefined) {
      return Array.isArray(acc) ? acc.find((item) => item.ausId === key.findById) : undefined;
    }
    return acc[key];
  }, obj);

  if (parent && parent[lastKey] !== undefined) {
    delete parent[lastKey];
  }
}

function decideColor(pathArray) {
  // Simplified color logic - just use default color for all fields
  return '#01327E'; // default color
}

function attachInputTracking(inputElement, pathArray) {
  // Set initial color on initial render
  const initialColor = decideColor(pathArray);
  inputElement.style.setProperty('color', initialColor, 'important');

  inputElement.addEventListener('input', (e) => {
    const value = e.target.value.trim();

    // Update the data directly
    setByPath(data, pathArray, value);

    // Keep the color consistent
    const color = decideColor(pathArray);
    inputElement.style.setProperty('color', color, 'important');
  });
}

function camelToTitleCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // capitalize first letter
}
