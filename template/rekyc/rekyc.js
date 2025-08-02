// ===== CONTENT FROM REKYC DATA JS =====
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
  'type-of-entity': ['data.entityType'],
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
  // Prevent multiple simultaneous renders
  if (isRendering) {
    console.log('renderAll already in progress, skipping...');
    return;
  }

  // Simplify to just use the payload directly as form data
  data = payload || {};

  const { entityType } = data;

  isProprietor = entityType?.toLowerCase()?.includes('prop');

  // Call renderAll to populate the form with data
  if (typeof renderAll === 'function') {
    isRendering = true;
    renderAll().finally(() => {
      isRendering = false;
      window.status = "ready";
    });
  } else {
    console.error('renderAll function not found');
  }
  disableEditAfterSubmit();
}

function disableEditAfterSubmit() {
  const status = data?.status || false;
  if (status) {
    document
      .querySelectorAll("input, select, textarea, button")
      .forEach((element) => {
        element.disabled = true; // Disable all form elements
      });
    document.body.style.pointerEvents = "none"; // Disable all interactions with the body
  }
}

function checkAllReqInputFilled() {
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

    const isFilled = inputElement.value?.trim() !== "";

    if (!isFilled) {
      inputElement.style.setProperty(
        "border-bottom",
        "2px solid red",
        "important"
      );
      allInputsFilled = false;

      if (!firstEmptyInput) {
        firstEmptyInput = inputElement;
      }
    } else {
      inputElement.style.removeProperty("border-bottom");
    }
  });

  // Check checkboxes using the values in the provided data object
  for (const [labelId, checkboxPaths] of Object.entries(directCheckBoxes)) {
    const labelElement = document.getElementById(labelId);
    const isChecked = checkboxPaths.some((path) => {
      const value = eval(path); // Using eval to access the value directly from the path
      return value && value.trim(); // Check if the value is non-empty or truthy
    });

    if (!isChecked) {
      labelElement.style.setProperty(
        "border-bottom",
        "2px solid red",
        "important"
      );
      allInputsFilled = false;

      if (!firstEmptyCheckboxLabel) {
        firstEmptyCheckboxLabel = labelElement;
      }
    } else {
      labelElement.style.removeProperty("border-bottom");
    }
  }

  if (firstEmptyInput) firstEmptyInput.focus();
  else if (firstEmptyCheckboxLabel)
    firstEmptyCheckboxLabel.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  window.parent.postMessage(
    {
      type: "CHECK_ALL_REQ_INPUT_FILLED_RESPONSE",
      source: "kyc-form",
      isFilled: allInputsFilled,
    },
    "*"
  );
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Tab" && isCheckedAllReqInputFilled) {
    const current = document.activeElement;

    const unfilledInputs = reqInputs
      .map((id) => document.getElementById(id))
      .filter((el) => el?.value?.trim() === "");

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

function getByPath(obj, pathArray) {
  return pathArray.reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    if (typeof key === "object" && key.findById !== undefined) {
      return Array.isArray(acc)
        ? acc.find((item) => item.ausNumber === key.findById)
        : undefined;
    }
    return acc[key];
  }, obj);
}

function setByPath(obj, pathArray, value) {
  pathArray.reduce((acc, key, index) => {
    if (index === pathArray.length - 1) {
      // Handling special case for finding by ID
      if (typeof key === "object" && key.findById !== undefined) {
        const item = acc.find((item) => item.ausNumber === key.findById);
        if (item) item[pathArray[index + 1]] = value; // Set the value on the specific field
      } else {
        acc[key] = value;
      }
    } else {
      if (typeof key === "object" && key.findById !== undefined) {
        const item = acc.find((item) => item.ausNumber === key.findById);
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
    if (typeof key === "object" && key.findById !== undefined) {
      return Array.isArray(acc)
        ? acc.find((item) => item.ausNumber === key.findById)
        : undefined;
    }
    return acc[key];
  }, obj);

  if (parent && parent[lastKey] !== undefined) {
    delete parent[lastKey];
  }
}

function decideColor(pathArray) {
  // Simplified color logic - just use default color for all fields
  return "#01327E"; // default color
}

function attachInputTracking(inputElement, pathArray) {
  // Set initial color on initial render
  const initialColor = decideColor(pathArray);
  inputElement.style.setProperty("color", initialColor, "important");

  inputElement.addEventListener("input", (e) => {
    const value = e.target.value.trim();

    // Update the data directly
    setByPath(data, pathArray, value);

    // Keep the color consistent
    const color = decideColor(pathArray);
    inputElement.style.setProperty("color", color, "important");
  });
}

function camelToTitleCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before capital letters
    .replace(/^./, (char) => char.toUpperCase()); // capitalize first letter
}
// ===== END CONTENT FROM REKYC DATA JS =====

let data = {};
let isCheckedAllReqInputFilled = false;
let showAnnexure1 = false;
let showAnnexure2 = false;
let isProprietor = false;
let isRendering = false; // Add flag to prevent multiple renderAll calls

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setupMessageListeners();

  // Add test function to global scope for manual testing
  window.testFormData = function () {
    const testData = {
      customerId: "TEST123",
      entityName: "Test Company",
      pan: "ABCDE1234F",
      entityType: "Proprietorship",
      entityDetails: {
        mailingAddress: {
          line1: "123 Test Street",
          city: "Test City",
          state: "Test State",
          country: "India",
          pin: "123456",
        },
      },
    };
    setFormData(testData);
  };
});

function setupMessageListeners() {
  window.addEventListener("message", (event) => {
    const { type, payload } = event.data || {};

    switch (type) {
      case "SET_FORM_DATA":
        if (typeof setFormData === "function") {
          setFormData(payload);
        } else {
          console.error("rekyc.js: setFormData function not found");
          console.error(
            "rekyc.js: Available global functions:",
            Object.keys(window).filter(
              (key) => typeof window[key] === "function"
            )
          );
        }
        break;
      case "TRIGGER_SAVE":
        if (typeof sendSaveData === "function") {
          sendSaveData();
        } else {
          console.error("sendSaveData function not found");
        }
        break;
      case "CHECK_ALL_REQ_INPUT_FILLED":
        if (typeof checkAllReqInputFilled === "function") {
          checkAllReqInputFilled();
        } else {
          console.error("checkAllReqInputFilled function not found");
        }
        break;
      default:
        break;
    }
  });
}

async function renderAll() {
  await entityBasicInfo();
  await entityMailingAddress();
  await entityRegisteredAddress();
  await entityType();
  await entitySubCategory();
  await selfEmployedProfessional();
  await natureOfBusiness();
  await natureOfIndustry();
  await businessDetails();
  await entityProofDeclaration();
  await extendedAnnexure();
  await boDetailsTable();
  await ausDetails();
  await extendedDeclaration();
  await annexure1();
  await annexure2();
  // await downloadPDF();
  console.log("renderAll done");
}

function entityBasicInfo() {
  if (!data) data = {};

  const entityCustId = document.getElementById("entityCustId");
  const entityName = document.getElementById("entityName");
  const entityPan = document.getElementById("entityPan");
  const propKartaCustId = document.getElementById("propKartaCustId");
  const propKartaPan = document.getElementById("propKartaPan");
  const propKartaCustName = document.getElementById("propKartaCustName");
  const propKartaName = document.getElementById("propKartaName");

  entityCustId.value = data.custId || "";
  entityName.value = data.entityName || "";
  entityPan.value = data.pan || "";
  propKartaCustId.value = data.propKartaCustId || "";
  propKartaPan.value = data.propKartaPan || "";
  propKartaCustName.value = data.propKartaCustName || "";
  propKartaName.value = data.propKartaName || "";

  // Attach tracking
  attachInputTracking(entityCustId, ["custId"]);
  attachInputTracking(entityName, ["entityName"]);
  attachInputTracking(entityPan, ["pan"]);
  attachInputTracking(propKartaCustId, ["propKartaCustId"]);
  attachInputTracking(propKartaPan, ["propKartaPan"]);
  attachInputTracking(propKartaCustName, ["propKartaCustName"]);
  attachInputTracking(propKartaName, ["propKartaName"]);

  const dateInputs = document.querySelectorAll("input#date-input");

  if (dateInputs.length > 0) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    dateInputs.forEach((input) => {
      input.value = formattedDate;
      input.readOnly = true;
      input.style.setProperty("color", "#01327E", "important");
    });
  }
}

function entityMailingAddress() {
  const mailingAddress = data.mailingAddress || {};

  // Checkbox elements
  const noChangeCheckbox = document.getElementById("noChangeInEmailAddress");
  const changeCheckbox = document.getElementById("changeInEmailAddress");

  // Set initial checkbox state
  const updateCheckboxState = () => {
    const type = mailingAddress.addressType;
    if (noChangeCheckbox) noChangeCheckbox.checked = type === "noChange";
    if (changeCheckbox) changeCheckbox.checked = type === "change";
  };

  updateCheckboxState();

  if (noChangeCheckbox) {
    noChangeCheckbox.onchange = () => {
      if (noChangeCheckbox.checked) {
        mailingAddress.addressType = "noChange";
        if (changeCheckbox) changeCheckbox.checked = false;
      } else if (!changeCheckbox?.checked) {
        mailingAddress.addressType = null;
      }
    };
  }

  if (changeCheckbox) {
    changeCheckbox.onchange = () => {
      if (changeCheckbox.checked) {
        mailingAddress.addressType = "change";
        if (noChangeCheckbox) noChangeCheckbox.checked = false;
      } else if (!noChangeCheckbox?.checked) {
        mailingAddress.addressType = null;
      }
    };
  }

  // Input field binding
  const fields = [
    "shopBidg",
    "roadName",
    "landmark",
    "city",
    "pincode",
    "state",
    "country",
    "telOff",
    "extNo",
    "faxNo",
    "telR",
    "mobNo",
    "emailID",
  ];

  const labelKey = {
    shopBidg: "buildingName",
    roadName: "line1",
    landmark: "landmark",
    city: "city",
    pincode: "pincode",
    state: "state",
    country: "country",
    telOff: "telOff",
    extNo: "extNo",
    faxNo: "faxNo",
    telR: "telR",
    mobNo: "mobNo",
    emailID: "email",
  };

  fields.forEach((field) => {
    const input = document.getElementById(`entity-mailing-address-${field}`);
    if (!input) return;

    input.value = mailingAddress[labelKey[field]] || "";

    const pathArray = ["mailingAddress", labelKey[field]];
    attachInputTracking(input, pathArray);

    // input.oninput = (e) => {
    //   mailingAddress[field] = e.target.value.trim();
    // };
  });
}

function entityRegisteredAddress() {
  // Ensure entityRegisteredAddress exists
  if (!data.registeredAddress) {
    data.registeredAddress = {};
  }

  let registeredAddress = data.registeredAddress;

  // Checkbox elements for "Owned", "Rented / Leased" and "Same as Mailing Address"
  const owned = document.getElementById("entity-contact-address-owned");
  const rented = document.getElementById("entity-contact-address-rentedLeased");
  const sameAsMailing = document.getElementById(
    "entity-contact-address-sameAsMailingAddress"
  );
  sameAsMailing.checked = registeredAddress.sameAsMailings;

  sameAsMailing.onchange = () => {
    if (sameAsMailing.checked) {
      data.registeredAddress = data.mailingAddress;
      data.registeredAddress.sameAsMailing = true;
      registeredAddress = data.registeredAddress;
      updateInputs();
    } else {
      data.registeredAddress.sameAsMailing = false;
    }
  };

  // Input field ids
  const fields = [
    "shopBidg",
    "roadName",
    "landmark",
    "city",
    "pincode",
    "state",
    "country",
  ];

  const labelKey = {
    shopBidg: "buildingName",
    roadName: "line1",
    landmark: "landmark",
    city: "city",
    pincode: "pincode",
    state: "state",
    country: "country",
  };

  function updateInputs() {
    fields.forEach((field) => {
      const input = document.getElementById(`entity-contact-address-${field}`);
      if (!input) return;

      input.value = registeredAddress[labelKey[field]] || "";

      const pathArray = ["registeredAddress", labelKey[field]];
      attachInputTracking(input, pathArray);

      input.oninput = () => {
        data.registeredAddress.sameAsMailing = false;
        sameAsMailing.checked = false;
      };
    });
  }

  // Initialize the input fields
  updateInputs();

  // Checkbox logic: Owned vs Rented
  const updateOwnershipCheckboxState = () => {
    const type = registeredAddress.addressType;
    if (owned) owned.checked = type === "owned";
    if (rented) rented.checked = type === "rented";
  };

  // Handle checkbox changes for "Owned"
  if (owned) {
    owned.onchange = () => {
      if (owned.checked) {
        registeredAddress.addressType = "owned";
        if (rented) rented.checked = false;
      } else if (!rented?.checked) {
        registeredAddress.addressType = null; // or leave it empty/null for clarity
      }
      updateOwnershipCheckboxState();
    };
  }

  // Handle checkbox changes for "Rented / Leased"
  if (rented) {
    rented.onchange = () => {
      if (rented.checked) {
        registeredAddress.addressType = "rented";
        if (owned) owned.checked = false;
      } else if (!owned?.checked) {
        registeredAddress.addressType = null;
      }
      updateOwnershipCheckboxState();
    };
  }

  // Checkbox logic: Same as mailing address
  // if (sameAsMailing) {
  //   sameAsMailing.onchange = () => {
  //     const isSame = sameAsMailing.checked;

  //     // Track the checkbox state in registeredAddress
  //     registeredAddress.sameAsMailing = isSame;

  //     // fields.forEach((field) => {
  //     //   const input = document.getElementById(`entity-contact-address-${field}`);
  //     //   if (!input) return;

  //     //   const key = labelKey[field];

  //     //   if (isSame) {
  //     //     // If checked, copy from mailingAddress and disable input
  //     //     input.value = mailingAddress[field] || '';
  //     //     registeredAddress[key] = mailingAddress[field] || '';
  //     //     // input.disabled = true;
  //     //     input.style.setProperty('color', '#01327E', 'important');
  //     //   } else {
  //     //     // If unchecked, restore value from registeredAddress and attach input tracking
  //     //     // input.disabled = false;
  //     //     input.value = registeredAddress[key] || '';
  //     //     input.style.setProperty('color', '#01327E', 'important');

  //     //     const pathArray = ['entityDetails', 'registeredOfficeAddress', key];
  //     //     attachInputTracking(input, pathArray);
  //     //   }
  //     // });
  //   };
  // }

  // Initialize checkbox states and inputs on page load
  updateOwnershipCheckboxState();

  // Initialize "Same as Mailing" checkbox based on the registeredAddress data
  if (sameAsMailing && registeredAddress.sameAsMailing !== undefined) {
    sameAsMailing.checked = registeredAddress.sameAsMailing;
  }
}

function entityType() {
  const entityTypes = [
    { id: "PROPRIETARY", label: "Proprietary" },
    { id: "SOLE_PROPRIETORSHIP", label: "Sole Proprietorship" },
    { id: "PARTNERSHIP", label: "Partnership" },
    { id: "LLP", label: "LLP" },
    { id: "PRIVATE_LIMITED", label: "Private Limited" },
    { id: "PUBLIC_LIMITED", label: "Public Limited" },
    { id: "HUF", label: "HUF" },
    { id: "GOVERNMENT_BODIES", label: "Government Bodies" },
    { id: "SOCIETY", label: "Society" },
    { id: "TRUST", label: "Trust" },
    { id: "FOREIGN_BODIES", label: "Foreign Bodies" },
    { id: "ASSOCIATION", label: "Association" },
    // { id: 'SINGLE_ENTRY', label: 'Single Entry' },
  ];

  const selectedEnum = data.entityType;
  const selector = "#entity-type .checkbox_container";
  const container = document.querySelector(selector);
  container.innerHTML = "";

  entityTypes.forEach(({ id, label }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox_wrapper";

    const labelDiv = document.createElement("div");
    const labelEl = document.createElement("p");
    labelEl.className = "text-nowrap";
    labelEl.textContent = label;
    labelDiv.appendChild(labelEl);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = id;
    input.id = id;
    input.checked = id === selectedEnum;

    wrapper.appendChild(input);
    wrapper.appendChild(labelDiv);
    container.appendChild(wrapper);

    input.addEventListener("change", () => {
      document
        .querySelectorAll(`${selector} input[type="checkbox"]`)
        .forEach((cb) => {
          if (cb !== input) cb.checked = false;
        });
      data.entityType = input.checked ? id : null;
    });
  });
}

const entitySubCategories = {
  pubPvtLtdCompany: ["Financial Services Company", "PSU", "Other"],
  association: [
    "Business Association",
    "Unregistered Association",
    "Other Association",
  ],
  government: [
    "Central",
    "State",
    "Local Authorities",
    "State Electricity Boards",
    "Quasi Government Bodies",
    "Other",
  ],
  foreignBodies: [
    "Foreign Govt",
    "Project Office",
    "Branch Office",
    "Liaison Office",
    "Consulates / Embassies",
    "Other",
  ],
  trust: [
    "Charitable Trust",
    "Public Trust",
    "Private Trust",
    "Religious Trust",
    "Educational Trust",
    "PF Trust",
  ],
  bank: [
    "Indian Commercial Bank",
    "Foreign Resident Bank",
    "Co-Operative Bank",
  ],
  societies: [
    "Credit Co-Operative",
    "Non Credit Co-Operative",
    "Proprietorship",
  ],
};

function entitySubCategory() {
  const container = document.querySelector("#entity-sub-category");
  if (!container) return;

  console.log("subCategory from backend:", data.subCategory);

  const allCheckboxes = container.querySelectorAll(
    '.checkbox_wrapper input[type="checkbox"]'
  );
  const preSelected = data?.subCategory || "";
  const [categoryRaw, valueRaw] = preSelected.split(":").map((s) => s.trim());
  const isOther = categoryRaw.includes("-others");
  const baseCategory = isOther
    ? categoryRaw.replace("-others", "")
    : categoryRaw;

  allCheckboxes.forEach((checkbox) => {
    const wrapper = checkbox.closest(".checkbox_wrapper");
    const textNode = wrapper?.querySelector(".text-nowrap");
    const inputEl = wrapper.querySelector('input[type="text"]');
    const checkboxContainer = checkbox.closest(".checkbox_container");
    const categoryWrapper = checkboxContainer?.parentElement;

    const categoryClass = [...(categoryWrapper?.classList || [])].find(
      (cls) =>
        cls !== "title" &&
        !cls.includes("container") &&
        !cls.includes("wrapper")
    );

    // Preselect
    if (categoryClass === baseCategory) {
      const labelText = textNode?.textContent?.trim();

      if (!isOther && labelText === valueRaw) {
        checkbox.checked = true;
      }

      if (isOther && inputEl) {
        checkbox.checked = true;
        inputEl.value = valueRaw;
      }
    }

    // Add change listener
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) {
            cb.checked = false;
            const otherInput = cb
              .closest(".checkbox_wrapper")
              ?.querySelector('input[type="text"]');
            if (otherInput) otherInput.value = "";
          }
        });

        const isOtherBox = !!inputEl;
        if (isOtherBox) {
          inputEl.focus();
          inputEl.addEventListener("input", () => {
            data.subCategory = `${categoryClass}-others: ${inputEl.value.trim()}`;
          });
        } else {
          data.subCategory = `${categoryClass}: ${textNode.textContent.trim()}`;
        }
      } else {
        const anyChecked = [...allCheckboxes].some((cb) => cb.checked);
        if (!anyChecked) {
          data.subCategory = null;
        }
      }
    });

    // If user types directly into input
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        checkbox.checked = true;
        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) {
            cb.checked = false;
            const otherInput = cb
              .closest(".checkbox_wrapper")
              ?.querySelector('input[type="text"]');
            if (otherInput) otherInput.value = "";
          }
        });

        data.subCategory = `${categoryClass}-others: ${inputEl.value.trim()}`;
      });
    }
  });
}

function selfEmployedProfessional() {
  const container = document.querySelector("#self-employeed-professional");
  if (!container) return;

  const allCheckboxes = container.querySelectorAll(
    '.checkbox_wrapper input[type="checkbox"]'
  );
  const allTextInputs = container.querySelectorAll(
    '.checkbox_wrapper input[type="text"]'
  );

  const preSelected = data?.selfEmployeedProfessional || "";

  // Reset initially
  allCheckboxes.forEach((cb) => (cb.checked = false));
  allTextInputs.forEach((input) => (input.value = ""));

  // Pre-select based on existing data
  allCheckboxes.forEach((checkbox) => {
    const wrapper = checkbox.closest(".checkbox_wrapper");
    const label = wrapper?.querySelector(".text-nowrap")?.textContent.trim();
    const inputEl = wrapper.querySelector('input[type="text"]');

    if (preSelected.startsWith("Others:") && inputEl) {
      checkbox.checked = true;
      inputEl.value = preSelected.split(":")[1].trim();
    } else if (label && label === preSelected) {
      checkbox.checked = true;
    }

    // Handle checkbox selection
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        // Uncheck all others
        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
        allTextInputs.forEach((input) => {
          if (input !== inputEl) input.value = "";
        });

        if (inputEl) {
          inputEl.focus();
          data.selfEmployeedProfessional = `Others: ${inputEl.value.trim()}`;
        } else {
          data.selfEmployeedProfessional = label;
        }
      } else {
        data.originalData.selfEmployeedProfessional = null;
      }
    });

    // Handle typing in "Others"
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        checkbox.checked = true;

        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
        allTextInputs.forEach((input) => {
          if (input !== inputEl) input.value = "";
        });

        data.originalData.selfEmployeedProfessional = `Others: ${inputEl.value.trim()}`;
      });
    }
  });
}

function natureOfBusiness() {
  const container = document.querySelector("#nature-of-business");
  if (!container) return;

  const allCheckboxes = container.querySelectorAll(
    '.checkbox_wrapper input[type="checkbox"]'
  );
  const allTextInputs = container.querySelectorAll(
    '.checkbox_wrapper input[type="text"]'
  );

  const preSelected = data?.natureOfBusiness || "";

  // Reset all checkboxes and inputs
  allCheckboxes.forEach((cb) => (cb.checked = false));
  allTextInputs.forEach((input) => (input.value = ""));

  allCheckboxes.forEach((checkbox) => {
    const wrapper = checkbox.closest(".checkbox_wrapper");
    const label = wrapper?.querySelector(".text-nowrap")?.textContent?.trim();
    const inputEl = wrapper.querySelector('input[type="text"]');

    // Pre-selection
    if (preSelected.startsWith("Others:") && inputEl) {
      checkbox.checked = true;
      inputEl.value = preSelected.split(":")[1].trim();
    } else if (label && label === preSelected) {
      checkbox.checked = true;
    }

    // Handle checkbox change
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
        allTextInputs.forEach((input) => {
          if (input !== inputEl) input.value = "";
        });

        if (inputEl) {
          inputEl.focus();
          data.natureOfBusiness = `Others: ${inputEl.value.trim()}`;
        } else {
          data.natureOfBusiness = label;
        }
      } else {
        data.originalData.natureOfBusiness = null;
      }
    });

    // Handle "Others" typing
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        checkbox.checked = true;

        allCheckboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });
        allTextInputs.forEach((input) => {
          if (input !== inputEl) input.value = "";
        });

        data.natureOfBusiness = `Others: ${inputEl.value.trim()}`;
      });

      // Handle blur: if input is empty, unselect it
      inputEl.addEventListener("blur", () => {
        if (inputEl.value.trim() === "") {
          checkbox.checked = false;
          data.natureOfBusiness = null;
        }
      });
    }
  });
}

function businessDetails() {
  const section = document.querySelector("#business-details");
  if (!section) return;

  const detailsOfActivityInput = section.querySelector("#detailsOfActivity");
  const dateOfIncorporationInput = section.querySelector(
    "#dateOfIncorporation"
  );
  const annualTurnOverFiguresInput = section.querySelector(
    "#annualTurnOverFigures"
  );
  const annualTurnOverWordsInput = section.querySelector(
    "#annualTurnOverWords"
  );
  const importCheckbox = section.querySelector("#import");
  const exportCheckbox = section.querySelector("#export");

  // Pre-fill if any data exists
  const dataSet = data?.businessDetails || {};

  detailsOfActivityInput.value = dataSet.detailsOfActivity || "";
  dateOfIncorporationInput.value = dataSet.dateOfIncorporation || "";
  annualTurnOverFiguresInput.value = dataSet.annualTurnOverFigures || "";
  annualTurnOverWordsInput.value = dataSet.annualTurnOverWords || "";

  // Set color for inputs only
  const inputs = [
    detailsOfActivityInput,
    dateOfIncorporationInput,
    annualTurnOverFiguresInput,
    annualTurnOverWordsInput,
  ];
  // inputs.forEach((input) => {
  //   if (input) {
  //     input.style.setProperty('color', 'red', 'important');
  //   }
  // });

  if (dataSet.involvedIn === "Import") importCheckbox.checked = true;
  else if (dataSet.involvedIn === "Export") exportCheckbox.checked = true;

  attachInputTracking(detailsOfActivityInput, [
    "businessDetails",
    "detailsOfActivity",
  ]);
  attachInputTracking(dateOfIncorporationInput, [
    "businessDetails",
    "dateOfIncorporation",
  ]);
  attachInputTracking(annualTurnOverFiguresInput, [
    "businessDetails",
    "annualTurnOverFigures",
  ]);
  attachInputTracking(annualTurnOverWordsInput, [
    "businessDetails",
    "annualTurnOverWords",
  ]);

  // Checkbox logic (like radio)
  importCheckbox.addEventListener("change", () => {
    if (importCheckbox.checked) {
      exportCheckbox.checked = false;
      data.businessDetails.involvedIn = "Import";
    } else {
      data.businessDetails.involvedIn = "";
    }
  });

  exportCheckbox.addEventListener("change", () => {
    if (exportCheckbox.checked) {
      importCheckbox.checked = false;
      data.businessDetails.involvedIn = "Export";
    } else {
      data.businessDetails.involvedIn = "";
    }
  });
}
function natureOfIndustry() {
  const labels = [
    "Automobile",
    "Restaurants",
    "IT/Software/BPO",
    "Agricultural Commodities",
    "Petrol Pump",
    "Forex Dealer/Bullion",
    "Media / Entertainment",
    "Leasing & Hire Purchase",
    "Contractors",
    "Chit Funds",
    "Construction",
    "Housing Finance",
    "Oil",
    "Fisheries/Poultry",
    "Steel/Hardware",
    "Fertilizers-Chemicals-Seeds-pesticides",
    "Consultancy",
    "Cements/Paints",
    "Dairy/food processing",
    "Electronics-computer hardware",
    "Education",
    "Engineering Goods",
    "Shroff",
    "Issue & Portfolio Management",
    "NBFC",
    "Pharmaceuticals",
    "Textile/Garments",
    "Hospital/Nursing Home/Clinics",
    "Retail Jewelry",
    "Hotels/Resorts",
    "Printing/publishing",
    "FMCG",
    "Furniture/Timber",
    "Consumer Durables",
    "Travel/Touring Agency",
    "Term Lending Institutions",
    "Broking",
    "Money Lender",
    "Marble/Granite",
    "Auto Finance",
    "Advt. Agencies",
    "Transportation / Logistics",
    "Others",
  ];

  const container = document.querySelector(
    "#nature-of-industry .checkbox_container"
  );
  container.innerHTML = ""; // ✅ Prevent duplication

  const selectedValue = data?.natureOfIndustry || "";
  let othersInput = null;

  labels.forEach((label, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox_wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `industry`;
    checkbox.id = `industry-${i}`;

    const labelDiv = document.createElement("div");
    const labelText = document.createElement("p");
    labelText.className = "text-nowrap";
    labelText.textContent = label;

    labelDiv.appendChild(labelText);
    wrapper.appendChild(checkbox);
    wrapper.appendChild(labelDiv);
    container.appendChild(wrapper);

    // Prefill logic
    const isCustomOthers =
      label === "Others" && selectedValue && !labels.includes(selectedValue);
    if (selectedValue === label || isCustomOthers) {
      checkbox.checked = true;
      if (isCustomOthers) {
        createAndAttachOthersInput(wrapper, selectedValue);
      }
    }

    checkbox.addEventListener("change", function () {
      const allCheckboxes = container.querySelectorAll(
        'input[type="checkbox"]'
      );
      allCheckboxes.forEach((cb) => {
        if (cb !== checkbox) cb.checked = false;
      });

      if (othersInput && label !== "Others") {
        othersInput.remove();
        othersInput = null;
      }

      if (checkbox.checked) {
        if (label === "Others") {
          createAndAttachOthersInput(wrapper);
          data.natureOfIndustry = "";
        } else {
          data.natureOfIndustry = label;
        }
      } else {
        data.originalData.natureOfIndustry = "";
        if (othersInput) {
          othersInput.remove();
          othersInput = null;
        }
      }
    });
  });

  function createAndAttachOthersInput(wrapper, prefill = "") {
    othersInput = document.createElement("input");
    othersInput.type = "text";
    othersInput.placeholder = "Please specify...";
    othersInput.className = "others-industry-input";
    othersInput.style.marginTop = "4px";
    othersInput.value = prefill;

    wrapper.appendChild(othersInput);
    othersInput.focus();

    othersInput.addEventListener("input", () => {
      data.originalData.natureOfIndustry = othersInput.value.trim();
    });

    othersInput.addEventListener("blur", () => {
      if (!othersInput.value.trim()) {
        const othersCheckbox = wrapper.querySelector('input[type="checkbox"]');
        if (othersCheckbox) othersCheckbox.checked = false;
        data.originalData.natureOfIndustry = "";
        othersInput.remove();
        othersInput = null;
      }
    });
  }
}

function entityProofDeclaration() {
  const section = document.querySelector("#entity-proof-declaration");

  const inputs = section.querySelectorAll("input");

  // Destructure and assign fields from your data object
  const { identityProof = "" } = data.entityProofDeclaration || {};

  const panDoc = data.pan;
  const coiDoc = data.cin;
  const addressProofDoc =
    data?.originalData?.entityDetails?.documents?.entityAddressProof;

  // Prefill values
  inputs[0].value = `PAN - ${panDoc}` || "";
  inputs[1].value = `CIN - ${coiDoc}` || "";
  inputs[2].value = camelToTitleCase(addressProofDoc?.selectedType || "") || "";
  inputs[3].value = identityProof;

  // Clear input fields if they are empty
  inputs.forEach((input) => {
    input.disabled = true;
  });

  const date = document.querySelector("#date-input");
  if (date) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    date.value = `${day}-${month}-${year}`;
    date.readOnly = true;
    date.style.setProperty("color", "#01327E", "important");
  }

  // Handle image sources for authorized signatories
  const signatoryImages = section.querySelectorAll(".aus_sign_img");

  signatoryImages.forEach((imgContainer, index) => {
    const signatoryData = data.authorizedSignatories?.[index];
    if (signatoryData) {
      const imageUrl = `data:image/jpeg;base64,${signatoryData.personalDocuments.specimenSignature.base64}`;

      if (signatoryData.personalDocuments.specimenSignature.base64) {
        // If URL exists, create the img element and set the src attribute
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Signature of Authorized Signatory ${index + 1}`; // Alt text for better accessibility

        // Append the img to the container
        imgContainer.appendChild(img);
      }
    }
  });
}

function extendedAnnexure() {
  if (!data?.extendedAnnexure) {
    data.extendedAnnexure = {
      basicDetails: {
        entityName: data?.entityName || "",
        entityCustId: data?.custId || "",
        aofNo: data?.aofNo || "",
      },
      docEntity: {
        cin: data?.cin || "",
        reg: "",
        trust: "",
        moa: "",
      },
      mailAddress: {
        cin: data?.cin || "",
        reg: "",
      },
    };
  }

  const extended = data.extendedAnnexure;

  const basicLabelKey = {
    aofNo: "aofNo",
    nameOfEntity: "entityName",
    custId: "entityCustId",
  };

  const docEntityLabel = {
    coi: "cin",
    reg: "reg",
    trust: "trust",
    moa: "moa",
  };

  const mailAddressLabel = {
    coi: "cin",
    reg: "reg",
  };

  // Correct input color handling based on original vs edited
  const basicDetailsInputColor = (input, key) => {
    const originalValue = extended.basicDetails[basicLabelKey[key]] || "";
    const currentValue = input.value || "";

    if (originalValue !== currentValue) {
      input.style.setProperty("color", "#FF8754", "important"); // modified
    } else {
      input.style.setProperty("color", "#01327E", "important"); // untouched
    }
  };

  // Prefill + bind basic details
  const basicFields = ["date", "aofNo", "nameOfEntity", "custId"];
  basicFields.forEach((key) => {
    const input = document.getElementById(`basic-${key}`);
    if (input) {
      input.value = extended.basicDetails[basicLabelKey[key]] || "";

      basicDetailsInputColor(input, key); // Set initial color

      input.addEventListener("input", () => {
        extended.basicDetails[basicLabelKey[key]] = input.value;

        basicDetailsInputColor(input, key); // Check color again after typing
      });
    }
  });

  // Prefill + bind document entity
  const docEntityFields = ["coi", "reg", "trust", "moa"];
  docEntityFields.forEach((key) => {
    const input = document.getElementById(`docEntity-${key}`);
    const check = document.getElementById(`docEntity-${key}-check`);

    const labelKey = docEntityLabel[key];

    if (typeof extended.docEntity[labelKey] !== "undefined") {
      if (check) check.checked = !!extended.docEntity[labelKey];
      if (input && typeof extended.docEntity[labelKey] === "string") {
        input.value = extended.docEntity[labelKey];
      }
    }

    if (check) {
      check.addEventListener("change", () => {
        if (!check.checked) {
          extended.docEntity[labelKey] = "";
          if (input) input.value = "";
        } else {
          extended.docEntity[labelKey] = input ? input.value || true : true;
        }
      });
    }

    if (input) {
      input.addEventListener("input", () => {
        if (check?.checked) {
          extended.docEntity[labelKey] = input.value;
        }
      });
    }
  });

  // Prefill + bind mailing address
  const mailFields = ["coi", "reg", "other"];
  mailFields.forEach((key) => {
    const input = document.getElementById(`mailAddress-${key}`);
    const check = document.getElementById(`mailAddress-${key}-check`);

    const labelKey = mailAddressLabel[key];

    if (check) check.checked = !!extended.mailAddress[labelKey];
    if (input && typeof extended.mailAddress[labelKey] === "string") {
      input.value = extended.mailAddress[labelKey];
    }

    if (check) {
      check.addEventListener("change", () => {
        if (!check.checked) {
          extended.mailAddress[labelKey] = "";
          if (input) input.value = "";
        } else {
          extended.mailAddress[labelKey] = input ? input.value : "";
        }
      });
    }

    if (input) {
      input.addEventListener("input", () => {
        if (check?.checked) {
          extended.mailAddress[labelKey] = input.value;
        }
      });
    }
  });
}

function boDetailsTable() {
  data.beneficialOwners = data?.beneficialOwners || [{}, {}];

  const boDetailsTemp = data?.beneficialOwners || [{}, {}]; // Assuming data.boDetails contains the details
  const boDetails = [...boDetailsTemp];
  // const boDetails = [...boDetailsTemp, ...boDetailsTemp, ...boDetailsTemp, ...boDetailsTemp];
  const container = document.querySelector("#extended-annexure");
  const detailsContainer = document.querySelector(".bo_details");
  // detailsContainer.innerHTML = '';

  const boContainer = document.createElement("div");
  boContainer.classList.add("bo_container");

  const boLength = boDetails.length || 2;

  // Loop for half the length of boDetails
  for (let i = 0; i < Math.ceil(boLength / 2); i += 2) {
    const boWrapper = document.createElement("div");
    boWrapper.classList.add("bo_wrapper");

    // Define columns with descriptions and keys
    const columns = [
      { label: "Name of Beneficial Owner", key: "name" },
      { label: "Address - Line", key: "addressLine" },
      { label: "Address - City", key: "city" },
      { label: "Address - State", key: "state" },
      { label: "Address - Country", key: "country" },
      { label: "Address - Pincode", key: "pinCode" },
    ];

    // Helper to get deep value safely (if needed later)
    function getValueByPath(obj, path) {
      return path.split(".").reduce((acc, part) => acc?.[part], obj);
    }

    // Loop over BOs
    const currentBo = boDetails[i] || {};
    const nextBo = boDetails[i + 1] || {};

    columns.forEach((col) => {
      const row = document.createElement("div");
      row.classList.add("row");

      const descDiv = document.createElement("div");
      descDiv.classList.add("desc");
      const label = document.createElement("p");
      label.innerText = col.label;
      descDiv.appendChild(label);

      // Handle input1 (currentBO)
      const valueDiv1 = document.createElement("div");
      valueDiv1.classList.add("value");
      const input1 = document.createElement("input");
      input1.type = "text";
      input1.value = currentBo?.[col.key] || "";

      // Attach manual input tracking for input1
      input1.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        const trueOriginalValue1 =
          data.beneficialOwners?.find((bo) => bo.boId === currentBo.boId)?.[
            col.key
          ] ?? "";

        // Handle editedData for input1
        if (trueOriginalValue1 === "") {
          if (value) {
            setByPath(
              data,
              ["beneficialOwners", currentBo.boId, col.key],
              "own"
            );
          } else {
            deleteByPath(data, ["beneficialOwners", currentBo.boId, col.key]);
          }
        } else {
          if (value !== trueOriginalValue1) {
            setByPath(
              data,
              ["beneficialOwners", currentBo.boId, col.key],
              "modified"
            );
          } else {
            deleteByPath(data, ["beneficialOwners", currentBo.boId, col.key]);
          }
        }

        // Set color for input1
        if (trueOriginalValue1 === "") {
          input1.style.setProperty(
            "color",
            value ? "#4b4b4d" : "#4b4b4d",
            "important"
          ); // Grey if Own
        } else {
          // Check if the value is different from the original value and update color
          input1.style.setProperty(
            "color",
            value !== trueOriginalValue1 ? "#D97706" : "#01327E",
            "important"
          ); // Orange if Modified, Blue if Same
        }

        // Update local object for input1
        if (currentBo) currentBo[col.key] = value;

        // Update originalData for input1
        const boIndex = data.beneficialOwners.findIndex(
          (bo) => bo.boId === currentBo.boId
        );
        if (boIndex !== -1) {
          data.beneficialOwners[boIndex][col.key] = value;
        }
      });

      // Set Initial Color for input1
      const trueOriginalValue1 =
        data.beneficialOwners?.find((bo) => bo.boId === currentBo.boId)?.[
          col.key
        ] ?? "";
      const trueEditedValue1 =
        data.beneficialOwners?.[currentBo.boId]?.[col.key] ?? ""; // Get the value from editedData

      // Adjust logic: If value is modified in `editedData`, color should be orange (modified)
      if (trueEditedValue1 === "modified") {
        input1.style.setProperty("color", "#D97706", "important"); // Orange if Modified
      } else if (trueOriginalValue1 === "") {
        input1.style.setProperty(
          "color",
          input1.value ? "#4b4b4d" : "#4b4b4d",
          "important"
        ); // Grey if Own
      } else {
        input1.style.setProperty(
          "color",
          input1.value !== trueOriginalValue1 ? "#D97706" : "#01327E",
          "important"
        ); // Orange if Modified, Blue if Same
      }

      valueDiv1.appendChild(input1);

      // Handle input2 (nextBo)
      const valueDiv2 = document.createElement("div");
      valueDiv2.classList.add("value");
      const input2 = document.createElement("input");
      input2.type = "text";

      if (nextBo) {
        input2.value = nextBo[col.key] || "";

        // Attach manual input tracking for input2
        input2.addEventListener("input", (e) => {
          const value = e.target.value.trim();
          const trueOriginalValue2 =
            data.beneficialOwners?.find((bo) => bo.boId === nextBo.boId)?.[
              col.key
            ] ?? "";

          // Handle editedData for input2
          if (trueOriginalValue2 === "") {
            if (value) {
              setByPath(
                data,
                ["beneficialOwners", nextBo.boId, col.key],
                "own"
              );
            } else {
              deleteByPath(data, ["beneficialOwners", nextBo.boId, col.key]);
            }
          } else {
            if (value !== trueOriginalValue2) {
              setByPath(
                data,
                ["beneficialOwners", nextBo.boId, col.key],
                "modified"
              );
            } else {
              deleteByPath(data, ["beneficialOwners", nextBo.boId, col.key]);
            }
          }

          // Set color for input2
          if (trueOriginalValue2 === "") {
            input2.style.setProperty(
              "color",
              value ? "#4b4b4d" : "#4b4b4d",
              "important"
            ); // Grey if Own
          } else {
            // Check if the value is different from the original value and update color
            input2.style.setProperty(
              "color",
              value !== trueOriginalValue2 ? "#D97706" : "#01327E",
              "important"
            ); // Orange if Modified, Blue if Same
          }

          // Update local object for input2
          if (nextBo) nextBo[col.key] = value;

          // Update originalData for input2
          const boIndex2 = data.beneficialOwners.findIndex(
            (bo) => bo.boId === nextBo.boId
          );
          if (boIndex2 !== -1) {
            data.beneficialOwners[boIndex2][col.key] = value;
          }
        });
      } else {
        input2.disabled = true;
      }

      // Set Initial Color for input2
      const trueOriginalValue2 =
        data.beneficialOwners?.find((bo) => bo.boId === nextBo.boId)?.[
          col.key
        ] ?? "";
      const trueEditedValue2 =
        data.beneficialOwners?.[nextBo.boId]?.[col.key] ?? ""; // Get the value from editedData

      // Adjust logic: If value is modified in `editedData`, color should be orange (modified)
      if (trueEditedValue2 === "modified") {
        input2.style.setProperty("color", "#D97706", "important"); // Orange if Modified
      } else if (trueOriginalValue2 === "") {
        input2.style.setProperty(
          "color",
          input2.value ? "#4b4b4d" : "#4b4b4d",
          "important"
        ); // Grey if Own
      } else {
        input2.style.setProperty(
          "color",
          input2.value !== trueOriginalValue2 ? "#D97706" : "#01327E",
          "important"
        ); // Orange if Modified, Blue if Same
      }

      valueDiv2.appendChild(input2);

      // Final assembly for the row
      row.appendChild(descDiv);
      row.appendChild(valueDiv1);
      row.appendChild(valueDiv2);
      boWrapper.appendChild(row);
    });

    if (i < 2) {
      // Append the wrapper to the boContainer
      boContainer.appendChild(boWrapper);

      // Append boContainer to the detailsContainer
      detailsContainer.appendChild(boContainer);
    } else {
      const pdfPage = document.createElement("div");
      pdfPage.classList.add("pdf-page");

      const section = document.createElement("section");
      section.classList.add("form-section");
      section.id = "extended-annexure";

      const boDetailsDiv = document.createElement("div");
      boDetailsDiv.classList.add("bo_details");

      const boContainerDiv = document.createElement("div");
      boContainerDiv.classList.add("bo_container");

      boContainerDiv.appendChild(boWrapper);
      boDetailsDiv.appendChild(boContainerDiv);
      section.appendChild(boDetailsDiv);
      pdfPage.appendChild(section);

      document.body.appendChild(pdfPage);
    }
  }
}

function ausDetails() {
  // document.querySelectorAll('.ausDetail').forEach((el) => el.remove());
  const ausData = data?.authorizedSignatories || [];
  const labels = [
    "Name of the Authorised Signatory",
    "Father's name",
    "Proof of Identity",
    "Proof of Address",
    "Address - Line",
    "Address - City",
    "Address - State",
    "Address - Country",
    "Address - Pincode",
    "Signature",
    "Photograph",
  ];
  const labelKey = {
    "Name of the Authorised Signatory": "fullName",
    "Father's name": "fatherName",
    "Proof of Identity": "personalDocuments.proofOfIdentity.selectedType",
    "Proof of Address": "personalDocuments.proofOfAddress.selectedType",
    "Address - Line": "line1",
    "Address - City": "city",
    "Address - State": "state",
    "Address - Country": "country",
    "Address - Pincode": "pincode",
    Signature: "signature",
    Photograph: "photo",
  };

  const toKey = (label) => label.toLowerCase().replace(/[^a-z0-9]/gi, "");

  function getValueByPath(obj, path) {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }

  for (let i = 0; i < ausData.length; i += 2) {
    const aus1 = ausData[i];
    const aus2 = ausData[i + 1];

    const pdfPage = document.createElement("div");
    pdfPage.classList.add("pdf-page", "ausDetail");

    const section = document.createElement("section");
    section.id = "aus-details";
    section.classList.add("form_section");

    const header = document.createElement("div");
    header.classList.add("header", "text-center");
    const h4 = document.createElement("h4");
    h4.classList.add("text-black");
    h4.textContent = "Authorised Signatories details";
    const p = document.createElement("p");
    p.textContent = "{All fields are mandatory}";
    header.appendChild(h4);
    header.appendChild(p);
    section.appendChild(header);

    const container = document.createElement("div");
    container.classList.add("aus_container");

    const table = document.createElement("table");
    table.classList.add("table");
    const tbody = document.createElement("tbody");

    labels.forEach((label, rowIndex) => {
      const tr = document.createElement("tr");

      // Label Column
      const labelTd = document.createElement("td");
      labelTd.innerHTML = `<p>${label}</p>`;
      tr.appendChild(labelTd);
      tr.style.minHeight = "60px";

      tr.appendChild(createAusCell(aus1, label, rowIndex));
      tr.appendChild(createAusCell(aus2, label, rowIndex));

      // Function to create an input or static media display
      function createAusCell(ausData, label, rowIndex) {
        const td = document.createElement("td");
        const div = document.createElement("div");

        if (rowIndex === 9) {
          // Signature row
          div.className = "sign_container";

          const wrapper = document.createElement("div");
          wrapper.className = "sign_wrapper";

          const isHaveSignature =
            ausData?.personalDocuments?.specimenSignature?.base64 ||
            ausData?.personalDocuments?.specimenSignature?.url;

          if (isHaveSignature) {
            const img = document.createElement("img");
            img.src =
              `data:image/jpeg;base64,${ausData.personalDocuments.specimenSignature.base64}` ||
              ausData.personalDocuments.specimenSignature.url;
            wrapper.appendChild(img);
          }

          div.appendChild(wrapper);
        } else if (rowIndex === 10) {
          // Photo row
          div.className = "photo_container";

          const wrapper = document.createElement("div");
          wrapper.className = "photo_wrapper";

          const isHavePhoto =
            ausData?.personalDocuments?.photograph?.base64 ||
            ausData?.personalDocuments?.photograph?.url;

          console.log(isHavePhoto);

          if (isHavePhoto) {
            const img = document.createElement("img");
            img.src =
              `data:image/jpeg;base64,${ausData.personalDocuments.photograph.base64}` ||
              ausData.personalDocuments.photograph.url;
            wrapper.appendChild(img);
          }

          div.appendChild(wrapper);
        } else {
          // Input field for other rows01327E
          const input = document.createElement("input");
          input.type = "text";

          const key = labelKey[label];

          // Capture true original value once (important)
          const trueOriginalValue = getValueByPath(ausData, key) ?? "";

          if (label === "Proof of Identity" || label === "Proof of Address") {
            // const selectedType = ausData?.personalDetailspersonalDocuments[key]?.type || '';
            // const docNumber =
            //   ausData?.personalDetailspersonalDocuments[key]?.number || 'Number not extracted';
            // // Set initial input value
            // input.value = `${selectedType} - ${docNumber}`;
            input.value = trueOriginalValue.toUpperCase();
          } else {
            // Set initial input value
            input.value = trueOriginalValue;
          }

          function updateColor(value) {
            const editedAus = data.authorizedSignatories?.find(
              (aus) => aus?.ausNumber === ausData?.ausNumber
            );

            // Add null check for editedAus
            const status = editedAus?.[key];

            if (status === "own") {
              input.style.setProperty("color", "#4B4B4D", "important"); // Grey for own
            } else if (status === "modified") {
              input.style.setProperty("color", "#D97706", "important"); // Orange for modified
            } else {
              input.style.setProperty("color", "#01327E", "important"); // Blue if not edited
            }
          }

          // Set initial color
          updateColor(input.value.trim());

          input.addEventListener("input", (e) => {
            const value = e.target.value.trim();

            // 1. Update color immediately
            updateColor(value);

            // 2. Update manually
            let editedAus = data.authorizedSignatories?.find(
              (aus) => aus.ausNumber === ausData.ausNumber
            );

            if (!editedAus) {
              editedAus = { ausNumber: ausData.ausNumber, personalDetails: {} };
              data.authorizedSignatories = data.authorizedSignatories || [];
              data.authorizedSignatories.push(editedAus);
            }

            if (trueOriginalValue === "") {
              if (value) {
                editedAus[key] = "own";
              } else {
                delete editedAus[key];
              }
            } else {
              if (value !== trueOriginalValue) {
                editedAus[key] = "modified";
              } else {
                delete editedAus[key];
              }
            }

            // Clean if no keys left
            if (editedAus && Object.keys(editedAus).length === 0) {
              const idx = data.authorizedSignatories.indexOf(editedAus);
              if (idx !== -1) {
                data.authorizedSignatories.splice(idx, 1);
              }
            }

            // 3. Update both ausData and originalData
            if (ausData) {
              ausData = ausData || {};
              const keyParts = key.split(".");
              let current = ausData;

              for (let i = 0; i < keyParts.length - 1; i++) {
                if (!current[keyParts[i]]) {
                  current[keyParts[i]] = {};
                }
                current = current[keyParts[i]];
              }
              current[keyParts[keyParts.length - 1]] = value;
            }

            const ausIndex = data.authorizedSignatories?.findIndex(
              (aus) => aus.ausNumber === ausData?.ausNumber
            );

            if (ausIndex !== -1) {
              let originalAus = data.authorizedSignatories[ausIndex];
              originalAus = originalAus || {};

              const keyParts = key.split(".");
              let current = originalAus;

              for (let i = 0; i < keyParts.length - 1; i++) {
                if (!current[keyParts[i]]) {
                  current[keyParts[i]] = {};
                }
                current = current[keyParts[i]];
              }
              current[keyParts[keyParts.length - 1]] = value;
            }
          });

          div.appendChild(input);
        }

        td.appendChild(div);
        return td;
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
    section.appendChild(container);
    pdfPage.appendChild(section);
    const extended = document.querySelector(".extended-declaration-div");
    extended.parentNode.insertBefore(pdfPage, extended);
  }
}

function extendedDeclaration() {
  const section = document.querySelector("#extended-declaration");

  const aofNo = document.querySelector("#aof-no");
  aofNo.value = data?.aofNo || "";
  attachInputTracking(aofNo, ["entityDetails", "aofNo"]);

  const entityName = section.querySelector("#entityName");
  entityName.value = data?.entityName || "";
  attachInputTracking(entityName, ["entityName"]);

  const custId = section.querySelector("#custId");
  custId.value = data?.customerId || "";
  attachInputTracking(custId, ["custId"]);

  const countryCin = section.querySelector("#countryCin");
  countryCin.value = data?.registeredAddress?.country || "";
  attachInputTracking(countryCin, ["entityDetails", "country"]);

  const cityCin = section.querySelector("#cityCin");
  cityCin.value = data?.registeredAddress?.city || "";
  attachInputTracking(cityCin, ["entityDetails", "cityCin"]);

  const commencementBusiness = section.querySelector("#commencementBusiness");
  commencementBusiness.value = data?.commencementBusiness || "";
  attachInputTracking(commencementBusiness, [
    "entityDetails",
    "commencementBusiness",
  ]);

  handleEitherCheckbox(
    "taxableOutsideIndia",
    "nonTaxableOutsideIndia",
    "taxOutsideIndia"
  );
  handleEitherCheckbox("usResident", "nonUSResident", "usResident");
  handleEitherCheckbox("ownedByMany", "nonOwnedByMany", "ownedBy");
  handleEitherCheckbox(
    "financialInstitution",
    "nonFinancialInstitution",
    "financialInstitution"
  );
  handleEitherCheckbox("publicTraded", "nonPublicTraded", "publicTraded");
  handleEitherCheckbox(
    "relatedPublicTraded",
    "nonRelatedPublicTraded",
    "relatedPublicTraded"
  );
  handleEitherCheckbox("subsidiary", "controlled", "relationNature");
  handleEitherCheckbox(
    "ultimateBeneficialOwner",
    "nonUltimateBeneficialOwner",
    "ultimateBeneficialOwner"
  );

  function handleEitherCheckbox(cb1, cb2, cbKey) {
    const c1 = section.querySelector(`#${cb1}`);
    const c2 = section.querySelector(`#${cb2}`);
    updateCheckBoxValue();

    c1.onchange = () => {
      if (c1.checked) {
        data[cbKey] = cb1;
        c2.checked = false; // Ensure the other checkbox is unchecked
      } else {
        data[cbKey] = null;
      }

      updateCheckBoxValue();
    };

    c2.onchange = () => {
      if (c2.checked) {
        data[cbKey] = cb2;
        c1.checked = false; // Ensure the other checkbox is unchecked
      } else {
        data[cbKey] = null;
      }

      updateCheckBoxValue();
    };

    function updateCheckBoxValue() {
      c1.checked = data?.[cbKey] === cb1;
      c2.checked = data?.[cbKey] === cb2;
    }
  }

  const stockExchange = section.querySelector("#stockExchange");
  stockExchange.value = data?.stockExchange || "";
  attachInputTracking(stockExchange, ["stockExchange"]);

  const listedCompany = section.querySelector("#listedCompany");
  listedCompany.value = data?.listedCompany || "";
  attachInputTracking(listedCompany, ["listedCompany"]);

  const listedStockExchange = section.querySelector("#listedStockExchange");
  listedStockExchange.value = data?.listedStockExchange || "";
  attachInputTracking(listedStockExchange, ["listedStockExchange"]);
}

function fatcaCRS() {
  if (!data?.fatcaCRS) {
    data.fatcaCRS = {};
  }

  const section = document.querySelector("#fatca-crs");

  const name = section.querySelector("#name");
  name.value = data?.fatcaCRS?.name || "";
  attachInputTracking(name, ["fatcaCRS", "name"]);

  const designation = section.querySelector("#designation");
  designation.value = data?.fatcaCRS?.designation || "";
  attachInputTracking(designation, ["fatcaCRS", "designation"]);
}

function annexure1() {
  if (isProprietor) {
    // document.querySelectorAll('[id^="annexure"]').forEach((el) => el.remove());
    // console.log('a 1 removed');
    return;
  }

  // Update data.originalData.annexure1 for the current checkbox
  if (!data.annexure1) {
    data.annexure1 = {};
  }

  const section = document.querySelector("#annexure-1");

  const entityName = section.querySelector("#entityName");
  entityName.value = data.entityName || "";
  attachInputTracking(entityName, ["entityName"]);

  const aofNo = section.querySelector("#aof-no");
  aofNo.value = data?.aofNo || "";
  attachInputTracking(aofNo, ["aofNo"]);

  const checkBoxIds = [
    "cin",
    "globalEntityIdentificationNo",
    "tin",
    "other-checkbox",
  ];

  checkBoxIds.forEach((id) => {
    const checkbox = section.querySelector(`#${id}`);
    if (!checkbox) return;

    // Set initial state based on data.originalData.annexure1
    checkbox.checked = !!data.annexure1?.[id];

    // Add change event listener
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        // Uncheck all other checkboxes
        checkBoxIds.forEach((otherId) => {
          if (otherId !== id) {
            const otherCheckbox = section.querySelector(`#${otherId}`);
            if (otherCheckbox) {
              otherCheckbox.checked = false;
              if (data.annexure1) {
                data.annexure1[otherId] = false;
              }
            }
          }
        });

        data.annexure1[id] = true;

        if (id === "other-checkbox") {
          otherInput.focus();
        }
      } else {
        // If unchecked, update data.originalData.annexure1
        if (data.annexure1) {
          data.annexure1[id] = false;
        }

        if (id !== "other-checkbox") {
          otherInput.focus();
        }
      }
    });
  });

  const otherInput = section.querySelector("#other");
  otherInput.value = data.annexure1.identificationNoOtherInput || "";
  attachInputTracking(otherInput, ["annexure1", "identificationNoOtherInput"]);

  const idNo = section.querySelector("#idNo");
  idNo.value = data.annexure1.idNo || "";
  attachInputTracking(idNo, ["annexure1", "idNo"]);

  const idNoIssuingCountry = section.querySelector("#idNoIssuingCountry");
  idNoIssuingCountry.value = data.annexure1.idNoIssuingCountry || "";
  attachInputTracking(idNoIssuingCountry, ["annexure1", "idNoIssuingCountry"]);

  const addressCheckBoxIds = ["taxAddressReg", "taxAddressMail"];
  const addressCheckBoxType = [
    "resiBusiness",
    "residential",
    "business",
    "regOffice",
  ];

  // Ensure only one checkbox from addressCheckBoxIds can be selected
  addressCheckBoxIds.forEach((id) => {
    const checkbox = section.querySelector(`#${id}`);
    if (!checkbox) return;

    // Set initial state based on data.originalData.annexure1
    checkbox.checked = !!data.annexure1?.[id];

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        addressCheckBoxIds.forEach((otherId) => {
          if (otherId !== id) {
            const otherCheckbox = section.querySelector(`#${otherId}`);
            if (otherCheckbox) otherCheckbox.checked = false;
            if (data.annexure1) {
              data.annexure1[otherId] = false;
            }
          }
        });
        data.annexure1[id] = true;
      } else {
        if (data.annexure1) {
          data.annexure1[id] = false;
        }
      }
    });
  });

  // Ensure only one checkbox from addressCheckBoxType can be selected
  addressCheckBoxType.forEach((id) => {
    const checkbox = section.querySelector(`#${id}`);
    if (!checkbox) return;

    // Set initial state based on data.originalData.annexure1
    checkbox.checked = !!data.annexure1?.[id];

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        addressCheckBoxType.forEach((otherId) => {
          if (otherId !== id) {
            const otherCheckbox = section.querySelector(`#${otherId}`);
            if (otherCheckbox) otherCheckbox.checked = false;
            if (data.annexure1) {
              data.annexure1[otherId] = false;
            }
          }
        });
        data.annexure1[id] = true;
      } else {
        if (data.annexure1) {
          data.annexure1[id] = false;
        }
      }
    });
  });

  const entityExcemptionCode = section.querySelector("#entityExcemptionCode");
  entityExcemptionCode.value = data.annexure1.entityExcemptionCode || "";
  attachInputTracking(entityExcemptionCode, [
    "annexure1",
    "entityExcemptionCode",
  ]);

  const personType = ["usPerson", "nonUSPerson"];

  // Ensure only one checkbox from personType can be selected
  personType.forEach((id) => {
    const checkbox = section.querySelector(`#${id}`);
    if (!checkbox) return;

    // Set initial state based on data.originalData.annexure1
    checkbox.checked = !!data.annexure1?.[id];

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        personType.forEach((otherId) => {
          if (otherId !== id) {
            const otherCheckbox = section.querySelector(`#${otherId}`);
            if (otherCheckbox) otherCheckbox.checked = false;
            if (data.annexure1) {
              data.annexure1[otherId] = false;
            }
          }
        });
        data.annexure1[id] = true;

        // Disable and clear entityExcemptionCode if usPerson is selected
        if (id === "usPerson") {
          entityExcemptionCode.value = "";
          entityExcemptionCode.disabled = true;
          data.annexure1.entityExcemptionCode = "";
        } else {
          entityExcemptionCode.disabled = false;
        }
      } else {
        if (data.annexure1) {
          data.annexure1[id] = false;
        }
      }
    });
  });

  const institutionType = ["financialInstitution", "directReporting"];

  // Ensure only one checkbox from institutionType can be selected
  institutionType.forEach((id) => {
    const checkbox = section.querySelector(`#${id}`);
    if (!checkbox) return;

    // Set initial state based on data.originalData.extendedDeclaration
    checkbox.checked = !!data.annexure1?.[id];

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        institutionType.forEach((otherId) => {
          if (otherId !== id) {
            const otherCheckbox = section.querySelector(`#${otherId}`);
            if (otherCheckbox) otherCheckbox.checked = false;
            if (data.annexure1) {
              data.annexure1[otherId] = false;
            }
          }
        });
        data.annexure1[id] = true;
      } else {
        if (data.annexure1) {
          data.annexure1[id] = false;
        }
      }
    });
  });
}

function annexure2() {
  if (isProprietor) {
    // document.querySelector('.annexure-2-div-1')?.remove();
    // console.log('a 2 removed');

    const pages = document.querySelectorAll(".pdf-page");
    const annexurePages = [pages[pages.length - 1], pages[pages.length - 2]];
    // console.log('annexurePages', annexurePages);
    // annexurePages?.slice(-2)?.forEach((el) => el?.remove());

    return;
  }

  const boLength = data?.beneficialOwners?.length || 2;

  const fields = {
    "Name of the controlling person (mandatory)": "name",
    "Entity Type (mandatory)": "entityType",
    "Controlling person type code (mandatory)": "controllingPersonTypeCode",
    "Date of birth (mandatory)": "dob",
    "PAN (mandatory)": "pan",
    "Customer ID (if applicable)": "custId",
    "Percentage of ownership/capital/profits(mandatory)": "sharePercentage",
    "Place / City of Birth (mandatory)": "placeOfBirth",
    "Country of Birth (mandatory)": "countryOfBirth",
    "Gender (mandatory)": "gender",
    "Marital Status (mandatory)": "maritalStatus",
    "Father’s name (mandatory)": "fatherName",
    "Nationality (Please specify country) (mandatory)": "nationality",
    "Aadhaar No (Optional)": "aadhaarNo",
    "Mother’s Name (optional)": "motherName",
    "Maiden Name (if any)": "maidenName",
    "Country of tax residence* (Mandatory)": "taxResidenceCountry",
    "Tax identification number (or functional equivalent of country other than India) %":
      "taxIdNumber",
    "Tax identification number type (for country other than India)":
      "taxIdType",
    "Address - Line (Mandatory)": "addressLine",
    "Address - City (Mandatory)": "city",
    "Address - State (Mandatory)": "state",
    "Address - Country (Mandatory)": "country",
    "Address - Pin Code (Mandatory)": "pincode",
    "Address Type for above (Mandatory)": "addressType",
    "Mobile Number (Mandatory)": "mobileNo",
    "Telephone Number (with ISD &STD code)": "teleNo",
    "Occupation Type (Mandatory)": "occupationType",
    "Proof of Identity (Mandatory)": "identityProof",
    "Proof of Address (Mandatory)": "addressProof",
    "Spouse’s name (Optional)": "spouseName",
    "Recent colour Photographs (Photo is Non- mandatory for Account opening)":
      "photograph",
  };

  for (let index = 0; index < boLength; index += 2) {
    let wholeContainer = null;
    let section = null;
    let content = null;
    if (index < 2) {
      wholeContainer = document.querySelector(`.annexure-2-div-${index + 1}`);
      section = document.querySelector("#annexure-2");
      content = section.querySelector(".content");
    } else {
      wholeContainer = document.createElement("div");
      wholeContainer.classList.add(`annexure-2-div-${index + 1}`);
      wholeContainer.classList.add("pdf-page");
      section = document.createElement("section");
      section.id = "#annexure-2";
      content = document.createElement("div");
      content.classList.add("content");
    }
    const table = document.createElement("table");
    table.classList.add("bo-annexure-table");
    const tbody = document.createElement("tbody");

    const newPage = document.createElement("div");
    newPage.classList.add("pdf-page");
    const newSection = document.createElement("div");
    newSection.classList.add("#annexure-2");
    const table2 = document.createElement("table");
    table2.classList.add("bo-annexure-table");
    const tbody2 = document.createElement("tbody");

    Object.entries(fields).map(([key, value], i) => {
      const tr = document.createElement("tr");

      const siNo = document.createElement("td");
      siNo.classList.add("text-black");
      siNo.innerText = i + 1;

      const rowField = document.createElement("td");
      rowField.classList.add("text-black");
      rowField.innerText = key;

      const bo1 = document.createElement("td");
      const innerDiv1 = document.createElement("div");
      const input1 = document.createElement("input");
      input1.style.width = "96%";
      input1.type = "text";
      input1.value =
        (data?.beneficialOwners[index] &&
          data?.beneficialOwners[index][value]) ||
        "";

      input1.addEventListener("input", () => {
        data.beneficialOwners[index][value] = input1.value.trim();
      });

      innerDiv1.appendChild(input1);
      bo1.append(innerDiv1);

      const bo2 = document.createElement("td");
      const innerDiv2 = document.createElement("div");
      const input2 = document.createElement("input");
      input2.style.width = "96%";
      input2.type = "text";
      input2.value =
        (data?.beneficialOwners[index + 1] &&
          data?.beneficialOwners[index + 1][value]) ||
        "";

      input2.addEventListener("input", () => {
        data.beneficialOwners[index + 1][value] = input2.value.trim();
      });

      innerDiv2.appendChild(input2);
      bo2.append(innerDiv2);

      tr.appendChild(siNo);
      tr.appendChild(rowField);
      tr.appendChild(bo1);
      tr.appendChild(bo2);
      if (i <= 18) {
        tbody.appendChild(tr);
      } else {
        tbody2.appendChild(tr);
      }
    });

    table.appendChild(tbody);
    content.appendChild(table);

    table2.appendChild(tbody2);
    newSection.appendChild(table2);
    newPage.appendChild(newSection);

    if (index < 2) {
      wholeContainer.parentNode.insertBefore(
        newPage,
        wholeContainer.nextSibling
      );
    } else {
      section.appendChild(content);
      wholeContainer.appendChild(section);
      document.body.appendChild(wholeContainer);
      document.body.appendChild(newPage);
      // wholeContainer.parentNode.insertBefore(newPage, wholeContainer.nextSibling);
    }
  }
}

function downloadPDF() {
  fetch("http://localhost:3000/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify({ data }), // Convert the data object to a JSON string
  })
    .then((response) => {
      if (response.ok) {
        return response.blob(); // Get the PDF file as a Blob
      }
      throw new Error("Failed to generate PDF");
    })
    .then((blob) => {
      // Create a link element to download the file
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = "report.pdf"; // Set the file name for the download
      link.click(); // Trigger the download
      window.URL.revokeObjectURL(url); // Clean up the object URL
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
