const data = {
    _id: { timestamp: 1753865859, date: "2025-07-30T08:57:39.000+00:00" },
    applicationId: "KYCAPP00129",
    entityName: "Ebitaus Private Limited",
    entityType: "PARTNERSHIP",
    cin: "",
    llpin: "",
    pan: "AAAFM1234B",
    reason: "KYC Application",
    authorizedSignatories: [
      {
        ausId: "a5c9216c-0edf-489e-997c-833f869c75c7",
        fullName: "BORUGULA SURESH",
        emailAddress: "monesh.babu@ebitaus.com",
        phoneNumber: "9874563210",
        personalDocuments: {
          proofOfAddress: {
            data: { extractedContent: {} },
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
              {
                text: "Rental Agreement/Lease Agreement",
                value: "rental",
                key: "rental",
              },
              {
                text: "Property Tax Receipt",
                value: "property",
                key: "property",
              },
              {
                text: "Aadhaar Card",
                value: "aadhaar-address",
                key: "aadhaar-address",
              },
            ],
            selectedType: "electricity",
            label: "Select Proof of address",
            type: "proofOfAddress",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          proofOfIdentity: {
            documentSubType: "personalpan",
            fileName: "P PAN.jpg",
            s3Url:
              "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/personaldocs/BORUGULA SURESH-a5c9216c-0edf-489e-997c-833f869c75c7/P_PAN.jpg",
            verificationData: {},
            extractedData: { error: "Person name mismatch with PAN Card" },
            selectedType: "personalpan",
          },
        },
      },
    ],
    partners: [
      {
        partnerId: "cd2b71fa-9feb-4511-bd7c-be445d8f4f40",
        fullName: "Kamaldeep Singh",
        dateOfAppointment: "2025-07-31T17:47:22.608996600",
        designation: "Partner",
        personalDocuments: {
          proofOfIdentity: {
            data: { extractedContent: {} },
            options: [
              { text: "Pan Card", value: "personalpan", key: "personalpan" },
              {
                text: "Aadhaar Card",
                value: "aadhaar-identity",
                key: "aadhaar-identity",
              },
              { text: "Driving Licence", value: "driving", key: "driving" },
              { text: "Passport", value: "passport", key: "passport" },
            ],
            selectedType: "personalpan",
            label: "Select Proof of identity",
            type: "proofOfIdentity",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          proofOfAddress: {
            data: { extractedContent: {} },
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
              {
                text: "Rental Agreement/Lease Agreement",
                value: "rental",
                key: "rental",
              },
              {
                text: "Property Tax Receipt",
                value: "property",
                key: "property",
              },
              {
                text: "Aadhaar Card",
                value: "aadhaar-address",
                key: "aadhaar-address",
              },
            ],
            selectedType: "electricity",
            label: "Select Proof of address",
            type: "proofOfAddress",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          photograph: {
            data: { extractedContent: {} },
            label: "Upload Photograph",
            acceptedTypes: "jpg, jpeg, png",
            type: "photograph",
          },
          specimenSignature: {
            data: { extractedContent: {} },
            label: "Upload Specimen Signature",
            type: "signature",
            acceptedTypes: "jpg, jpeg, png",
          },
        },
      },
      {
        partnerId: "9cfec374-ef4a-48a9-b316-90860744a50f",
        fullName: "Parminder Kumar",
        dateOfAppointment: "2025-07-31T17:47:22.608996600",
        designation: "Partner",
        personalDocuments: {
          proofOfIdentity: {
            data: { extractedContent: {} },
            options: [
              { text: "Pan Card", value: "personalpan", key: "personalpan" },
              {
                text: "Aadhaar Card",
                value: "aadhaar-identity",
                key: "aadhaar-identity",
              },
              { text: "Driving Licence", value: "driving", key: "driving" },
              { text: "Passport", value: "passport", key: "passport" },
            ],
            selectedType: "personalpan",
            label: "Select Proof of identity",
            type: "proofOfIdentity",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          proofOfAddress: {
            data: { extractedContent: {} },
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
              {
                text: "Rental Agreement/Lease Agreement",
                value: "rental",
                key: "rental",
              },
              {
                text: "Property Tax Receipt",
                value: "property",
                key: "property",
              },
              {
                text: "Aadhaar Card",
                value: "aadhaar-address",
                key: "aadhaar-address",
              },
            ],
            selectedType: "electricity",
            label: "Select Proof of address",
            type: "proofOfAddress",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          photograph: {
            data: { extractedContent: {} },
            label: "Upload Photograph",
            acceptedTypes: "jpg, jpeg, png",
            type: "photograph",
          },
          specimenSignature: {
            data: { extractedContent: {} },
            label: "Upload Specimen Signature",
            type: "signature",
            acceptedTypes: "jpg, jpeg, png",
          },
        },
      },
      {
        partnerId: "ea8902b4-1833-4364-9b2d-77a78bff1d0f",
        fullName: "Gurmeet Singh",
        dateOfAppointment: "2025-07-31T17:47:22.608996600",
        designation: "Partner",
        personalDocuments: {
          proofOfIdentity: {
            data: { extractedContent: {} },
            options: [
              { text: "Pan Card", value: "personalpan", key: "personalpan" },
              {
                text: "Aadhaar Card",
                value: "aadhaar-identity",
                key: "aadhaar-identity",
              },
              { text: "Driving Licence", value: "driving", key: "driving" },
              { text: "Passport", value: "passport", key: "passport" },
            ],
            selectedType: "personalpan",
            label: "Select Proof of identity",
            type: "proofOfIdentity",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          proofOfAddress: {
            data: { extractedContent: {} },
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
              {
                text: "Rental Agreement/Lease Agreement",
                value: "rental",
                key: "rental",
              },
              {
                text: "Property Tax Receipt",
                value: "property",
                key: "property",
              },
              {
                text: "Aadhaar Card",
                value: "aadhaar-address",
                key: "aadhaar-address",
              },
            ],
            selectedType: "electricity",
            label: "Select Proof of address",
            type: "proofOfAddress",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          photograph: {
            data: { extractedContent: {} },
            label: "Upload Photograph",
            acceptedTypes: "jpg, jpeg, png",
            type: "photograph",
          },
          specimenSignature: {
            data: { extractedContent: {} },
            label: "Upload Specimen Signature",
            type: "signature",
            acceptedTypes: "jpg, jpeg, png",
          },
        },
      },
      {
        partnerId: "8f1cc29e-4b1e-4e46-9230-81853d5837d7",
        fullName: "Neelam Rani",
        dateOfAppointment: "2025-07-31T17:47:22.608996600",
        designation: "Partner",
        personalDocuments: {
          proofOfIdentity: {
            data: { extractedContent: {} },
            options: [
              { text: "Pan Card", value: "personalpan", key: "personalpan" },
              {
                text: "Aadhaar Card",
                value: "aadhaar-identity",
                key: "aadhaar-identity",
              },
              { text: "Driving Licence", value: "driving", key: "driving" },
              { text: "Passport", value: "passport", key: "passport" },
            ],
            selectedType: "personalpan",
            label: "Select Proof of identity",
            type: "proofOfIdentity",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          proofOfAddress: {
            data: { extractedContent: {} },
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
              {
                text: "Rental Agreement/Lease Agreement",
                value: "rental",
                key: "rental",
              },
              {
                text: "Property Tax Receipt",
                value: "property",
                key: "property",
              },
              {
                text: "Aadhaar Card",
                value: "aadhaar-address",
                key: "aadhaar-address",
              },
            ],
            selectedType: "electricity",
            label: "Select Proof of address",
            type: "proofOfAddress",
            acceptedTypes: "pdf, jpg, jpeg, png",
          },
          photograph: {
            data: { extractedContent: {} },
            label: "Upload Photograph",
            acceptedTypes: "jpg, jpeg, png",
            type: "photograph",
          },
          specimenSignature: {
            data: { extractedContent: {} },
            label: "Upload Specimen Signature",
            type: "signature",
            acceptedTypes: "jpg, jpeg, png",
          },
        },
      },
    ],
    entityDocs: {
      partnership_deed: {
        fileName: "Partnership_Deed.pdf",
        s3Url:
          "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/entitydocs/documents/Partnership_Deed.pdf",
        type: "partnership_deed",
        label: "Partnership Deed",
        isRequired: false,
        extractedContent: {
          firmName: "M/s B & B Flour Mill",
          partners:
            "Kamaldeep Singh, Parminder Kumar, Gurmeet Singh, Neelam Rani",
          deedDate: "27th day of February, 2013",
          deedNumber: "E 704562",
          extractedSummary: {
            partners:
              "Kamaldeep Singh, Parminder Kumar, Gurmeet Singh, Neelam Rani",
          },
          verificationData: {
            isVerified: true,
            validationType: "AI",
            verifiedOn: "2025-07-31T17:47:22.649454100",
            partnersExtracted: true,
            firmNameExtracted: false,
            deedDateExtracted: false,
            deedNumberExtracted: false,
          },
        },
        uploadedAt: "2025-07-31T17:47:22.765462400",
        verificationData: {
          isVerified: true,
          validationType: "AI",
          verifiedOn: "2025-07-31T17:47:22.649454100",
          partnersExtracted: true,
          firmNameExtracted: false,
          deedDateExtracted: false,
          deedNumberExtracted: false,
        },
      },
      pan: {
        fileName: "1. PAN - Ebitaus - Copy.pdf",
        s3Url:
          "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/entitydocs/documents/1.-PAN---Ebitaus---Copy.pdf",
        type: "pan",
        label: "PAN",
        isRequired: false,
        extractedContent: {
          PAN: "AAHCE4484E",
          entityName: "Ebitaus Pvt Ltd",
          verificationData: {
            verifiedOn: "2025-07-31T17:47:40.985686800",
            isVerified: true,
            validationType: "AI",
          },
        },
        uploadedAt: "2025-07-31T17:47:40.985686800",
        verificationData: {
          verifiedOn: "2025-07-31T17:47:40.985686800",
          isVerified: true,
          validationType: "AI",
        },
      },
      gst_certificate: {
        fileName: "2. GST Certificate 2024 .pdf",
        s3Url:
          "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/entitydocs/documents/2.-GST-Certificate-2024-.pdf",
        type: "gst",
        label: "GST Certificate",
        isRequired: false,
        extractedContent: {
          companyName:
            "YObvOTBpytHI9oVEi37ACeDlvc334goBkpyNCUXt+zWktS0AeQCqI/FrENH77KjzvBQn",
          GSTIN: "ctnBHPhe8PYbqKho0l9ypCWduE79SAEiv13g8YnzJX0ZfJoiTGgjjmPEMQ==",
          address:
            "9th Floor, No.37 PM Tower, Greams Road, Chennai, Tamil Nadu - 600006",
        },
        uploadedAt: "2025-07-31T15:45:43.583357",
        verificationData: {
          addressExtracted: true,
          verifiedOn: "2025-07-31T15:45:43.578140900",
          isVerified: true,
          validationType: "AI",
        },
      },
      registration_certificate: {
        fileName: "Partnership_Registration_Certificate_Ebitaus.pdf",
        s3Url:
          "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/entitydocs/documents/Partnership_Registration_Certificate_Ebitaus.pdf",
        type: "registration_certificate",
        label: "Registration Certificate",
        isRequired: false,
        extractedContent: {
          firmName: "Ebitaus Traders",
          registrationNumber: "TN-2025-5678",
          registrationDate: "15/07/2025",
          businessAddress:
            "No. 12, 3rd Cross Street, Anna Nagar, Chennai, Tamil Nadu – 600040",
          verificationData: {
            isVerified: true,
            validationType: "AI",
            verifiedOn: "2025-07-31T17:48:07.360168",
          },
        },
        uploadedAt: "2025-07-31T17:48:08.146421300",
        verificationData: {
          isVerified: true,
          validationType: "AI",
          verifiedOn: "2025-07-31T17:48:07.360168",
        },
      },
      address_proof: {
        fileName: "Proprietorship_Bank_Statement_July2025_Updated.pdf",
        s3Url:
          "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/entitydocs/documents/Proprietorship_Bank_Statement_July2025_Updated.pdf",
        type: "address_proof",
        label: "Select Company Address Proof",
        isRequired: false,
        extractedContent: {
          companyname:
            "Kxd3kOOVE5lTYcul7Ye0Aj7j/ZgJ2Rp7mWDuwGHw95PCC0CTLVpd4Gqs/ayskb1TuIfr",
          bankName: "Axis Bank",
          statementDate: "30-Jul-2025",
          address: "Branch: Anna Nagar, Chennai",
          verificationData: {
            isVerified: true,
            validationType: "Internal",
            verifiedOn: "2025-07-31T17:48:58.994792500",
            serviceType: "bank_statement",
            nameMatchStatus:
              "Not checked - Entity name validation commented out",
            dateValidationStatus: "Not checked",
            addressExtracted: true,
          },
        },
        uploadedAt: "2025-07-31T17:48:59.000585800",
        selectedType: "bank_statement",
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
          {
            text: "Gas Bill (Not more than 3 months)",
            value: "gas",
            key: "gas",
          },
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
        ],
        verificationData: {
          isVerified: true,
          validationType: "Internal",
          verifiedOn: "2025-07-31T17:48:58.994792500",
          serviceType: "bank_statement",
          nameMatchStatus: "Not checked - Entity name validation commented out",
          dateValidationStatus: "Not checked",
          addressExtracted: true,
        },
      },
    },
    mailingAddress: {
      line1: "Branch: Anna Nagar, Chennai",
      city: "dsfg",
      pincode: "dsf",
      state: "sd",
      country: "dsf",
      sameAsMailing: true,
    },
    registeredAddress: {
      line1: "Branch: Anna Nagar, Chennai",
      city: "dsfg",
      pincode: "dsf",
      state: "sd",
      country: "dsf",
      sameAsMailing: true,
    },
    stepper: [
      { key: 0, label: "Welcome", isCompleted: true },
      { key: 1, label: "Entity Docs", isCompleted: true },
      { key: 2, label: "Personal Docs", isCompleted: true },
      { key: 3, label: "KYC Form", isCompleted: true },
      { key: 4, label: "eSign & Status", isCompleted: false },
    ],
    currentStep: 4,
    isEsignInitiated: true,
    isVkycInitiated: false,
    submittedByBankerId: "6860c98570dd7b6bfbe4693f",
    submittedByBankerName: "Monesh Babu",
    submittedByBankerEmail: "monesh.babu@ebitaus.com",
    submittedAt: "2025-07-30T08:57:39.948+00:00",
    updatedAt: "2025-08-02T06:38:14.484+00:00",
    reportS3Url:
      "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/report/kyc_form_1754116688283.pdf",
    toBeSignedReportS3Url:
      "https://ebi-kycus.s3.amazonaws.com/kyc/KYCAPP00129/report/toBeSigned/toBe_signed_report_1754116688284.pdf",
    esignDocId: "34b08a8e-db74-4bcf-870f-4dc972803230",
    isSigningCompleted: false,
    esignType: "aadharEsign",
    esignUserDetails: {
      users: [
        {
          redirectUrl:
            "https://uat.esign-proteantech.in/esign/esign-verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNpcGllbnRJZCI6IjdiMjRjMDQyLTQ1NDYtNGQzOC04Njc2LTc4MTgwZTYxOWE3MCIsImlzUGF5bWVudEFwcGxpY2FibGUiOmZhbHNlLCJpYXQiOjE3NTQwNDU2ODEsImV4cCI6MTc1NDEzMjA4MX0.lJcgqiMOgKKo6SuiCKx9gs2S33xCP5jHyr7JDfIQgWc",
          recipientId: "7b24c042-4546-4d38-8676-78180e619a70",
          emailId: "monesh.babu@ebitaus.com",
          status: "",
        },
      ],
    },
    status: "ESIGN_PENDING",
    kycFormStatus: "Completed",
    _class: "com.ebitaus.kycus.features.banker.kyc.entity.KycApplication",
  }