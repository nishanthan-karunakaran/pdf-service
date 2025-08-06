const data = {
  _id: "68762915af70c4864d40fe52",
  applicationId: "KYCAPP00063",
  entityName: "Ebitaus Private Limited",
  entityType: "PRIVATE_LIMITED",
  cin: "U62099TN2023PTC158659",
  pan: "CIXPN9255M",
  authorizedSignatories: [
    {
      ausId: "5d363a13-1648-4a81-9650-86e95e385888",
      fullName: "BORUGULA SURESH",
      emailAddress: "monesh.babu@ebitaus.com",
      phoneNumber: "9987654321",
      personalDocuments: {
        proofOfIdentity: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          options: [
            { text: "Pan Card", value: "personalpan", key: "personalpan" },
            { text: "Aadhar Card", value: "aadhar", key: "aadhar" },
            { text: "Driving Licence", value: "driving", key: "driving" },
            { text: "Passport", value: "passport", key: "passport" },
          ],
          selectedType: "personalpan",
          label: "Select Proof of identity",
        },
        proofOfAddress: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          options: [
            {
              text: "Electricity bill (Not more than 2 months)",
              value: "electricity",
              key: "electricity",
            },
            {
              text: "Internet bill (Not more than 2 months)",
              value: "internet",
              key: "internet",
            },
            {
              text: "Gas bill (Not more than 2 months)",
              value: "gas",
              key: "gas",
            },
            {
              text: "Landline bill (Not more than 2 months)",
              value: "landline",
              key: "landline",
            },
            { text: "Bank Statement", value: "bank", key: "bank" },
            { text: "Rental Agreement", value: "rental", key: "rental" },
            {
              text: "Property Tax Receipt",
              value: "property",
              key: "property",
            },
            { text: "Aadhar Card", value: "aadhar", key: "aadhar" },
          ],
          selectedType: "electricity",
          label: "Select Proof of address",
        },
        photograph: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          label: "Upload Photograph *",
          type: "photograph",
        },
        specimenSignature: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          label: "Upload Specimen Signature",
          type: "signature",
        },
        director_identification_number: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          label: "Director Identification Number (DIN)",
          type: "din",
        },
        board_resolution: {
          data: {
            fileName: null,
            s3Url: null,
            extractedContent: {},
          },
          label: "Board Resolution",
          type: "board_resolution",
        },
        personalpan: {
          fileName: "pan.jpg",
          s3Url:
            "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/personaldocs/BORUGULA%20SURESH-5d363a13-1648-4a81-9650-86e95e385888/pan.jpg",
          extractedData: {
            error:
              "AI extraction failed: Failed to resolve 'api.openai.com' [A(1), AAAA(28)] after 4 queries ",
            message: "Unexpected error during AI processing",
          },
        },
      },
    },
    {
      ausId: "52e9030f-135d-4e53-8b94-8db907309a8f",
      fullName: "Nish",
      emailAddress: "nishanthan.karunakaran@ebitaus.com",
      phoneNumber: "9863215884",
      personalDocuments: {
        proofOfIdentity: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          options: [
            { text: "Pan Card", value: "personalpan", key: "personalpan" },
            { text: "Aadhar Card", value: "aadhar", key: "aadhar" },
            { text: "Driving Licence", value: "driving", key: "driving" },
            { text: "Passport", value: "passport", key: "passport" },
          ],
          selectedType: "personalpan",
          label: "Select Proof of identity",
        },
        proofOfAddress: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          options: [
            {
              text: "Electricity bill (Not more than 2 months)",
              value: "electricity",
              key: "electricity",
            },
            {
              text: "Internet bill (Not more than 2 months)",
              value: "internet",
              key: "internet",
            },
            {
              text: "Gas bill (Not more than 2 months)",
              value: "gas",
              key: "gas",
            },
            {
              text: "Landline bill (Not more than 2 months)",
              value: "landline",
              key: "landline",
            },
            { text: "Bank Statement", value: "bank", key: "bank" },
            { text: "Rental Agreement", value: "rental", key: "rental" },
            {
              text: "Property Tax Receipt",
              value: "property",
              key: "property",
            },
            { text: "Aadhar Card", value: "aadhar", key: "aadhar" },
          ],
          selectedType: "electricity",
          label: "Select Proof of address",
        },
        photograph: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          label: "Upload Photograph *",
          type: "photograph",
        },
        specimenSignature: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          label: "Upload Specimen Signature",
          type: "signature",
        },
        director_identification_number: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          label: "Director Identification Number (DIN)",
          type: "din",
        },
        board_resolution: {
          data: {
            fileName: "",
            s3Url: "",
            extractedData: {},
          },
          label: "Board Resolution",
          type: "board_resolution",
        },
      },
    },
  ],
  beneficialOwners: [
    {
      boId: "bo-1752580712392",
      name: "Monesh B",
      addressLine: "monesh.babu@ebitaus.com",
      city: "Malajkhand",
      state: "Madhya Pradesh",
      country: "India",
      pinCode: "481116",
      pan: "ABCDE1234B",
      personalDocuments: {},
    },
  ],
  boAnswers: [3],
  directors: [
    {
      dirId: "5d000b5d-953e-4ab0-97a3-7032ef12d5da",
      fullName: "PITCHAI VENKATESH",
      din: "10061417",
      pan: "CIXKN9255M",
      aadhaar: "326234797734",
      dateOfAppointment: "03/03/2023",
      designation: "Director",
      isVerifiedByUser: true,
    },
    {
      dirId: "2896e7d2-70c8-43d1-be2e-b3616ff9099b",
      fullName: ". KOKILA",
      din: "10061418",
      pan: "ABCDE1234F",
      dateOfAppointment: "03/03/2023",
      designation: "Director",
    },
  ],
  entityDocs: {
    pan: {
      fileName: "1. PAN - Ebitaus.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/1.-PAN---Ebitaus.pdf",
      type: "pan",
      label: "PAN",
      extractedContent: {
        PAN: "AAHCE4484E",
        companyName: "EBITAUS PRIVATE LIMITED",
      },
      uploadedAt: "2025-07-15T15:44:55.835Z",
      verificationData: {
        verifiedOn: "2025-07-15T15:44:55.835Z",
        isVerified: true,
        validationType: "PAN",
      },
    },
    certificate_of_incorporation: {
      fileName: "4. Ebitaus P Ltd - Certificate of Incorporation.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/4.-Ebitaus-P-Ltd---Certificate-of-Incorporation.pdf",
      type: "coi",
      label: "Certificate of Incorporation",
      extractedContent: {
        TAN: "CHEE09826F",
        dateOfIncorporation: "03-03-2023",
        address:
          "AWFIS,No.143/1, Uthamar Gandhi Road,Nungambakkam,Chennai,Chennai-600034,Tamil Nadu",
        companyName: "EBITAUS PRIVATE LIMITED",
        CIN: "U62099TN2023PTC158659",
        PAN: "AAHCE4484E",
      },
      uploadedAt: "2025-07-15T15:46:22.252Z",
      verificationData: {
        verifiedOn: "2025-07-15T15:46:22.177Z",
        isVerified: true,
        validationType: "MCA",
      },
    },
    gst_certificate: {
      fileName: "2. GST Certificate 2024 .pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/2.-GST-Certificate-2024-.pdf",
      type: "gst",
      label: "GST Certificate",
      extractedContent: {
        GSTIN: "33AAHCE4484E1ZQ",
        address:
          "Floor No: III, Flat No.: 37, Building No: F1, Building/Flat name: PM Tower, Road/Street: Ganesha Road, City/Town/Village: Chennai, District: Chennai, State: Tamil Nadu, PIN Code: 600006",
        companyName: "EBITAUS PRIVATE LIMITED",
      },
      uploadedAt: "2025-07-15T15:47:25.495Z",
      verificationData: {
        verifiedOn: "2025-07-15T15:47:25.495Z",
        isVerified: true,
        validationType: "GSTIN",
      },
    },
    memorandum_of_association: {
      fileName: "Fresh - MoA.pdf.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/Fresh---MoA.pdf.pdf",
      type: "moa",
      label: "Memorandum of Association",
      extractedContent: {
        companyName: "Ebitaus Private Limited",
      },
      uploadedAt: "2025-07-15T15:47:36.303Z",
      verificationData: {
        verifiedOn: "2025-07-15T15:47:36.303Z",
        isVerified: true,
        validationType: "Internal",
      },
    },
    articles_of_association: {
      fileName: "AOA- altered (Ebitaus).pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/AOA--altered-(Ebitaus).pdf",
      type: "aoa",
      label: "Articles of Association",
      extractedContent: {
        companyName: "EBITAUS PRIVATE LIMITED",
      },
      uploadedAt: "2025-07-15T15:48:05.261Z",
      verificationData: {
        verifiedOn: "2025-07-15T15:48:05.222Z",
        isVerified: true,
        validationType: "Internal",
      },
    },
    board_resolution: {
      fileName: "form32.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/form32.pdf",
      type: "br",
      label: "Board Resolution",
      extractedContent: {
        error: "Not a valid Board Resolution Document",
        message: null,
      },
      uploadedAt: "2025-07-15T15:48:18.401Z",
      verificationData: {},
    },
    address_proof: {
      fileName: "Gas Bill May-2025.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00063/entitydocs/documents/Gas-Bill-May-2025.pdf",
      type: "address_proof",
      label: "Select Company Address Proof",
      extractedContent: {
        error:
          "AI extraction failed: Failed to resolve 'api.openai.com' [A(1), AAAA(28)] after 4 queries ",
        message: "Unexpected error during AI processing",
      },
      uploadedAt: "2025-07-15T17:52:04.448Z",
      selectedType: "gas",
      options: [
        {
          text: "Electricity Bill (Not more than 3 months)",
          value: "electricity",
          key: "electricity",
        },
        {
          text: "Internet Bill (Not more than 3 months)",
          value: "internet",
          key: "internet",
        },
        { text: "Gas Bill (Not more than 3 months)", value: "gas", key: "gas" },
        {
          text: "Water Bill (Not more than 3 months)",
          value: "water",
          key: "water",
        },
        {
          text: "Landline Bill (Not more than 3 months)",
          value: "landline",
          key: "landline",
        },
        {
          text: "Bank Statement",
          value: "bank_statement",
          key: "bank_statement",
        },
        {
          text: "Rental Agreement",
          value: "rental_agreement",
          key: "rental_agreement",
        },
        {
          text: "Property Tax Receipt",
          value: "property_tax",
          key: "property_tax",
        },
        { text: "Utility Bill", value: "utility_bill", key: "utility_bill" },
      ],
      verificationData: {},
    },
  },
  mailingAddress: {},
  registeredAddress: {
    addressLine:
      "AWFIS,No.143/1, Uthamar Gandhi Road,Nungambakkam,Chennai,Chennai-600034,Tamil Nadu",
    updatedFromCoi: true,
    updatedAt: "2025-07-15T15:46:22.177Z",
  },
  stepper: [
    { key: 0, label: "Welcome", isCompleted: true },
    { key: 1, label: "Entity Docs", isCompleted: true },
    { key: 2, label: "Personal Docs", isCompleted: false },
    { key: 3, label: "KYC Form", isCompleted: false },
    { key: 4, label: "eSign & Status", isCompleted: false },
  ],
  currentStep: 1,
  isEsignInitiated: false,
  isVkycInitiated: false,
  submittedByBankerId: "6860c98570dd7b6bfbe4693f",
  submittedByBankerName: "Monesh Babu",
  submittedByBankerEmail: "monesh.babu@ebitaus.com",
  submittedAt: "2025-07-15T10:10:29.116Z",
  updatedAt: "2025-07-15T12:20:52.023Z",
  isSigningCompleted: false,
  status: "IN_PROGRESS",
  kycFormStatus: "In Progress",
  _class: "com.ebitaus.kycus.features.banker.kyc.entity.KycApplication",
};
