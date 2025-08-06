const individualData = {
  _id: "68762915af70c4864d40fe52",
  applicationId: "INDIVIDUAL-KYC00123",
  
  // Personal Information
  customerName: "Rajesh Kumar Sharma",
  firstName: "Rajesh",
  lastName: "Sharma",
  fatherName: "Suresh Kumar Sharma",
  dateOfBirth: "1985-06-15T00:00:00.000Z",
  email: "rajesh.sharma@example.com",
  mobile: "9876543210",
  panNumber: "ABCDE1234F",
  nationality: "Indian",
  
  // Address Information
  roadName: "Plot No. 123, Sector 45",
  city: "Gurgaon",
  state: "Haryana",
  country: "India",
  pinCode: "122001",
  
  // Permanent Address
  permRoadName: "House No. 456, MG Road",
  permCity: "Delhi",
  permState: "Delhi",
  permCountry: "India",
  permPinCode: "110001",
  
  // Personal Details - Marital Status (one will be true)
  married: true,
  single: false,
  divorced: false,
  widowed: false,
  
  // Financial Details - Gross Annual Income (one will be true)
  income0to1lakh: false,
  income1to5lakh: false,
  income5to10lakh: true,
  income10to25lakh: false,
  incomeAbove25lakh: false,
  
  // Occupation Details (one will be true)
  service: true,
  business: false,
  professional: false,
  selfEmployed: false,
  retired: false,
  housewife: false,
  student: false,
  others: false,
  
  // Residence Type (one will be true)
  owned: true,
  rented: false,
  parental: false,
  company: false,
  
  // Identification Type checkboxes
  passport: false,
  drivingLicense: false,
  aadhaarCard: true,
  electionCard: false,
  nregaCard: false,
  nprLetter: false,
  
  // Proof of Address checkboxes
  uidAadhaar: true,
  drivingLicenseProof: false,
  passportProof: false,
  electricityBill: false,
  internetBill: false,
  gasBill: false,
  landlineBill: false,
  bankStatement: false,
  nprLetterProof: false,
  
  // Documents
  documents: {
    proofOfIdentity: {
      fileName: "aadhaar_card_rajesh.pdf",
      s3Url: "https://ebi-kycus.s3.amazonaws.com/individual-kyc/INDIVIDUAL-KYC00123/documents/aadhaar_card_rajesh.pdf",
      uploadedAt: "2025-01-15T10:30:00.000Z",
      isVerified: true,
      validationType: "Digilocker",
      extractedContent: {
        name: "Rajesh Kumar Sharma",
        fatherName: "Suresh Kumar Sharma",
        dateOfBirth: "15/06/1985",
        address: "Plot No. 123, Sector 45, Gurgaon, Haryana - 122001",
        aadhaarNumber: "123456789012"
      }
    },
    proofOfAddress: {
      fileName: "aadhaar_address_proof.pdf",
      s3Url: "https://ebi-kycus.s3.amazonaws.com/individual-kyc/INDIVIDUAL-KYC00123/documents/aadhaar_address_proof.pdf",
      uploadedAt: "2025-01-15T10:35:00.000Z",
      isVerified: true,
      validationType: "Digilocker",
      extractedContent: {
        name: "Rajesh Kumar Sharma",
        address: "Plot No. 123, Sector 45, Gurgaon, Haryana - 122001",
        aadhaarNumber: "123456789012"
      }
    }
  },
  
  // Application timestamps
  submittedAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T11:00:00.000Z",
  createdAt: "2025-01-15T09:30:00.000Z",
  
  // Application status
  status: "COMPLETED",
  currentStep: "complete",
  isEsignCompleted: true,
  
  // Stepper information
  stepper: [
    { key: 0, label: "Documents", isCompleted: true },
    { key: 1, label: "Form", isCompleted: true },
    { key: 2, label: "Complete", isCompleted: true }
  ],
  
  // Additional metadata
  submittedByBankerId: "6860c98570dd7b6bfbe4693f",
  submittedByBankerName: "Bank Officer Name",
  submittedByBankerEmail: "officer@bank.com",
  
  _class: "com.ebitaus.kycus.features.banker.individual.kyc.entity.IndividualKycApplication"
};

// Example with missing documents
const individualDataIncomplete = {
  _id: "68762915af70c4864d40fe53",
  applicationId: "INDIVIDUAL-KYC00124",
  
  // Personal Information
  customerName: "Priya Patel",
  firstName: "Priya",
  lastName: "Patel",
  fatherName: "Ramesh Patel",
  dateOfBirth: "1990-03-20T00:00:00.000Z",
  email: "priya.patel@example.com",
  mobile: "9876543211",
  panNumber: "XYZAB5678C",
  nationality: "Indian",
  
  // Address Information
  roadName: "Flat 2B, Green Heights",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  pinCode: "400001",
  
  // Permanent Address (same as mailing)
  permRoadName: "Flat 2B, Green Heights",
  permCity: "Mumbai",
  permState: "Maharashtra",
  permCountry: "India",
  permPinCode: "400001",
  
  // Personal Details
  single: true,
  married: false,
  divorced: false,
  widowed: false,
  
  // Financial Details
  income1to5lakh: true,
  income0to1lakh: false,
  income5to10lakh: false,
  income10to25lakh: false,
  incomeAbove25lakh: false,
  
  // Occupation
  professional: true,
  service: false,
  business: false,
  selfEmployed: false,
  retired: false,
  housewife: false,
  student: false,
  others: false,
  
  // Residence Type
  rented: true,
  owned: false,
  parental: false,
  company: false,
  
  // Documents - Only one document uploaded
  documents: {
    proofOfIdentity: {
      fileName: "pan_card_priya.pdf",
      s3Url: "https://ebi-kycus.s3.amazonaws.com/individual-kyc/INDIVIDUAL-KYC00124/documents/pan_card_priya.pdf",
      uploadedAt: "2025-01-15T14:00:00.000Z",
      isVerified: true,
      validationType: "Government API",
      extractedContent: {
        name: "PRIYA PATEL",
        fatherName: "RAMESH PATEL",
        panNumber: "XYZAB5678C"
      }
    }
    // proofOfAddress is missing
  },
  
  // Application timestamps
  submittedAt: "2025-01-15T13:30:00.000Z",
  updatedAt: "2025-01-15T14:30:00.000Z",
  createdAt: "2025-01-15T13:00:00.000Z",
  
  // Application status
  status: "IN_PROGRESS",
  currentStep: "form",
  isEsignCompleted: false,
  
  // Stepper information
  stepper: [
    { key: 0, label: "Documents", isCompleted: true },
    { key: 1, label: "Form", isCompleted: false },
    { key: 2, label: "Complete", isCompleted: false }
  ],
  
  // Additional metadata
  submittedByBankerId: "6860c98570dd7b6bfbe4693f",
  submittedByBankerName: "Bank Officer Name",
  submittedByBankerEmail: "officer@bank.com",
  
  _class: "com.ebitaus.kycus.features.banker.individual.kyc.entity.IndividualKycApplication"
};