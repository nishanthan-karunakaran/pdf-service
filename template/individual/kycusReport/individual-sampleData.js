const individualSampleData = {
  _id: "688e51c3d0adb06f43a75ceb",
  applicationId: "KYCAPP00150",
  entityName: "Vinodhan Gopinath",
  entityType: "INDIVIDUAL",
  cin: "",
  llpin: "",
  pan: "DNGPG7456I",
  customerId: "",
  reason: "KYC Application",

  authorizedSignatories: [
    {
      fullName: "Vinodhan Gopinath",
      emailAddress: "vinodhan.gopinath@example.com",
      phoneNumber: "9876543210",
      dateOfBirth: "1985-06-15",
      // title: "MR", // Will default to MR if not provided or if it's a generic description
      pan: "DNGPG7456I",
      personalDocuments: {
        proofOfIdentity: {
          data: {
            fileName: "Nishanthan Pan Card.pdf",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00150_documents",
            extractedContent: {
              name: "Vinodhan G",
              PAN_Number: "CXKPN9255M",
              dateOfBirth: "02/12/2001"
            },
            verificationData: {
              verifiedOn: "2025-08-05T19:36:57.745Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
          options: [
            {
              selectedType: "personalpan",
              label: "Proof of Identity",
              type: "proofOfIdentity",
              acceptedTypes: "pdf, jpg, jpeg, png"
            }
          ]
        },
        proofOfAddress: {
          data: {
            fileName: "vinodhan_aadhaar.pdf",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00150_document",
            extractedContent: {
              name: "Vinodhan Gopinath",
              address: "S/O: Gopinath, No 25, PERUMAL SOUTH STREET, Nagore (Kottagam), Nagapat",
              fatherName: "Gopinath",
              aadhaarNumber: "9956 9998 4385",
              dateOfBirth: "02/12/2001"
            },
            verificationData: {
              verifiedOn: "2025-08-05T19:36:57.745Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
          options: [
            {
              selectedType: "aadhar",
              label: "Proof of Address",
              type: "proofOfAddress",
              acceptedTypes: "pdf, jpg, jpeg, png"
            }
          ]
        },
        photograph: {
          data: {
            fileName: "vinodhan_photograph.jpg",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00150_photograph",
            verificationData: {
              verifiedOn: "2025-08-05T19:36:57.745Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
          label: "Upload Photograph",
          acceptedTypes: "jpg, jpeg, png",
          type: "photograph"
        },
        specimenSignature: {
          data: {
            fileName: "vinodhan_signature.jpg",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00150_signature",
            verificationData: {
              verifiedOn: "2025-08-05T19:36:57.745Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
          label: "Upload Specimen Signature",
          acceptedTypes: "jpg, jpeg, png",
          type: "signature"
        }
      }
    }
  ],

  entityDocs: {},

  mailingAddress: {
  roadName: "Plot No. 123, Sector 45",
  city: "Gurgaon",
  state: "Haryana",
  country: "India",
    pinCode: "122001"
  },

  registeredAddress: {
    roadName: "Plot No. 123, Sector 45",
    city: "Gurgaon",
    state: "Haryana",
    country: "India",
    pinCode: "122001"
  },

  stepper: [
    { key: 0, label: "Documents", isCompleted: true },
    { key: 1, label: "Form", isCompleted: true },
    { key: 2, label: "Complete", isCompleted: true }
  ],
  
  currentStep: 1,
  isEsignInitiated: true,
  isVkycInitiated: false,
  submittedByBankerId: "68762b6eaf70c4864d40fe5d",
  submittedByBankerName: "Vinoth",
  submittedByBankerEmail: "vinodhan.gopinath@ebitaus.com",
  submittedAt: "2025-01-15T12:58:27.597Z",
  updatedAt: "2025-01-15T16:40:00.426Z",
  reportS3Url: "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00150/report/kyc_form_175.pdf",
  toBeSignedReportS3Url: "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00150/report/toBeSigned/toBeSigned.pdf",
  esignDocId: "ac4f2fba-c9a1-4cd3-8977-13ca23ae675b",
  isSigningCompleted: false,
  esignType: "aadharEsign",

  esignUserDetails: {
    name: "Vinodhan Gopinath",
    mobile: "9876543210",
    email: "vinodhan.gopinath@example.com"
  },

  status: "ESIGN_PENDING",
  kycFormStatus: "Completed",
  _class: "com.ebitaus.kycus.features.banker.kyc.entity.KycApplication"
};

// Example with missing documents and phone number
const individualSampleDataIncomplete = {
  _id: "688e51c3d0adb06f43a75cec",
  applicationId: "KYCAPP00151",
  entityName: "Priya Sharma",
  entityType: "INDIVIDUAL",
  cin: "",
  llpin: "",
  pan: "ABCDE1234F",
  customerId: "",
  reason: "KYC Application",

  authorizedSignatories: [
    {
      fullName: "Priya Sharma",
      emailAddress: "priya.sharma@example.com",
      // phoneNumber: "", // No phone number provided
      dateOfBirth: "1990-03-20",
      // title: "MS", // Will default to MR if not provided or if it's a generic description
      pan: "ABCDE1234F",
      personalDocuments: {
        proofOfIdentity: {
          data: {
            fileName: "priya_pan_card.pdf",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00151_documents",
            extractedContent: {
              name: "Priya Sharma",
              PAN_Number: "ABCDE1234F",
              dateOfBirth: "20/03/1990"
            },
            verificationData: {
              verifiedOn: "2025-01-15T14:30:00.000Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
          options: [
            {
              selectedType: "personalpan",
              label: "Proof of Identity",
              type: "proofOfIdentity",
              acceptedTypes: "pdf, jpg, jpeg, png"
            }
          ]
        },
        proofOfAddress: {
          data: {
            fileName: "priya_aadhaar.pdf",
            s3Url: "https://ebi-kycus.s3.amazonaws.com/individual_kyc_KYCAPP00151_document",
            extractedContent: {
              name: "Priya Sharma",
              address: "Flat 2B, Green Heights, Mumbai, Maharashtra - 400001",
              fatherName: "Ramesh Sharma",
              aadhaarNumber: "1234 5678 9012",
              dateOfBirth: "15/05/1990"
            },
            verificationData: {
              verifiedOn: "2025-01-15T14:35:00.000Z",
              isVerified: true,
              validationType: "Internal"
            }
          },
                    options: [
            {
              selectedType: "aadhar",
              label: "Proof of Address",
              type: "proofOfAddress",
              acceptedTypes: "pdf, jpg, jpeg, png"
            }
          ]
        },
        photograph: {
          label: "Upload Photograph",
          acceptedTypes: "jpg, jpeg, png",
          type: "photograph"
          // No data object - will show as "Not Uploaded"
        },
        specimenSignature: {
          label: "Upload Specimen Signature",
          acceptedTypes: "jpg, jpeg, png",
          type: "signature"
          // No data object - will show as "Not Uploaded"
        }
      }
    }
  ],

  entityDocs: {},

  mailingAddress: {
  roadName: "Flat 2B, Green Heights",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
    pinCode: "400001"
  },

  registeredAddress: {
    roadName: "Flat 2B, Green Heights",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pinCode: "400001"
  },

  stepper: [
    { key: 0, label: "Documents", isCompleted: false },
    { key: 1, label: "Form", isCompleted: false },
    { key: 2, label: "Complete", isCompleted: false }
  ],
  
  currentStep: 0,
  isEsignInitiated: false,
  isVkycInitiated: false,
  submittedByBankerId: "68762b6eaf70c4864d40fe5d",
  submittedByBankerName: "Vinoth",
  submittedByBankerEmail: "vinodhan.gopinath@ebitaus.com",
  submittedAt: "2025-01-15T14:00:00.000Z",
  updatedAt: "2025-01-15T14:30:00.000Z",

  status: "IN_PROGRESS",
  kycFormStatus: "Pending",
  _class: "com.ebitaus.kycus.features.banker.kyc.entity.KycApplication"
};