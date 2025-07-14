const sample = {
  _id: {
    $oid: "686b92433bcd87d4c8906571",
  },
  applicationId: "REKYCAPP00001",
  entityName: "Ebitaus Private Limited",
  entityType: "PUBLIC_LIMITED",
  cin: "CIN121212121212121212",
  pan: "CIXPN9255M",
  customerId: "CUST12",
  authorizedSignatories: [
    {
      fullName: "Nishanthan",
      emailAddress: "nishanthan.karunakaran@ebitaus.com",
      phoneNumber: "",
      ausNumber: "AUS-01",
      personalDocuments: {
        personalpan: {
          fileName: "Nishanthan Pan Card.pdf",
          s3Url:
            "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/personaldocs/Nishanthan-d3142911-eb14-4f69-a531-2ca8a020e027/Nishanthan Pan Card.pdf",
          extractedData: {
            error: "Not a valid Individual PAN card",
            reason:
              "Document is unclear, poor quality, or does not appear to be a valid PAN card",
          },
        },
      },
    },
  ],
  beneficialOwners: [
    {
      name: "",
      addressLine: "",
      pinCode: "",
      share: "",
      pan: "",
    },
  ],
  boAnswers: [3],
  directors: [
    {
      fullName: "John Doe",
      din: "12345678",
      pan: "CIXPN9255M",
      dateOfAppointment: "2020-01-15",
      designation: "Managing Director",
    },
    {
      fullName: "Jane Smith",
      din: "87654321",
      pan: "CIXPN9255N",
      dateOfAppointment: "2020-02-20",
      designation: "Director",
    },
    {
      fullName: "Robert Johnson",
      din: "11223344",
      pan: "CIXPN9255C",
      dateOfAppointment: "2020-03-10",
      designation: "Independent Director",
    },
  ],
  entityDocs: {
    br: {
      fileName: "3. Hathway.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/3.-Hathway.pdf",
      type: "br",
      label: "Board Resolution for ReKYC",
      extractedContent: {
        error: "Not a valid Board Resolution Document",
      },
      uploadedAt: "2025-07-07T15:01:05.150239",
    },
    cc: {
      fileName: "form32.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/form32.pdf",
      type: "cc",
      label: "Compliance Certificate",
      extractedContent: {
        error: "Not a valid Compliance Certificate Document",
      },
      uploadedAt: "2025-07-07T15:01:12.177507",
    },
    aoa: {
      fileName: "AOA- altered (Ebitaus).pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/AOA--altered-(Ebitaus).pdf",
      type: "aoa",
      label: "Articles of Association",
      extractedContent: {
        companyName: "EBITAUS PRIVATE LIMITED",
      },
      uploadedAt: "2025-07-07T15:00:59.837786",
    },
    pan: {
      fileName: "1. PAN - Ebitaus.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/1.-PAN---Ebitaus.pdf",
      type: "pan",
      label: "Company PAN Card",
      extractedContent: {
        dateOfIncorporation: "03/03/2023",
        companiesPan: "yes",
        companyName: "EBITAUS PRIVATE LIMITED",
        panNumber: "AAHCE4484E",
      },
      uploadedAt: "2025-07-07T15:00:35.461837",
    },
    coi: {
      fileName: "4. Ebitaus P Ltd - Certificate of Incorporation.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/4.-Ebitaus-P-Ltd---Certificate-of-Incorporation.pdf",
      type: "coi",
      label: "Certificate of Incorporation",
      extractedContent: {
        tan: "CHEE09826F",
        address:
          "AWFIS,No.143/1, Uthamar Gandhi Road,Nungambakkam,Chennai,Chennai-600034,Tamil Nadu",
        companyName: "EBITAUS PRIVATE LIMITED",
        cin: "U62099TN2023PTC158659",
        pan: "AAHCE4484E",
      },
      uploadedAt: "2025-07-07T15:00:43.711317",
    },
    moa: {
      fileName: "Fresh - MoA.pdf.pdf",
      s3Url:
        "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/entitydocs/documents/Fresh---MoA.pdf.pdf",
      type: "moa",
      label: "Memorandum of Association",
      extractedContent: {
        companyName: "Ebitaus Private Limited",
      },
      uploadedAt: "2025-07-07T15:00:52.513911",
    },
  },
  mailingAddress: {
    addressLine:
      "AWFIS,No.143/1, Uthamar Gandhi Road,Nungambakkam,Chennai,Chennai-600034,Tamil Nadu",
  },
  registeredAddress: {},
  rekycFormStatus: "Completed",
  stepper: [
    {
      key: 0,
      label: "Welcome",
      isCompleted: true,
    },
    {
      key: 1,
      label: "Entity Docs",
      isCompleted: true,
    },
    {
      key: 2,
      label: "Personal Docs",
      isCompleted: true,
    },
    {
      key: 3,
      label: "Re-KYC Form",
      isCompleted: true,
    },
    {
      key: 4,
      label: "eSign & Status",
      isCompleted: false,
    },
  ],
  currentStep: 0,
  isEsignInitiated: false,
  submittedByBankerId: "6860c95670dd7b6bfbe4693d",
  submittedByBankerName: "Nishanthan Karunakaran",
  submittedByBankerEmail: "nishanthan.karunakaran@ebitaus.com",
  submittedAt: {
    $date: "2025-07-07T09:24:19.335Z",
  },
  updatedAt: {
    $date: "2025-07-07T10:08:46.554Z",
  },
  reportS3Url:
    "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/report/kyc_form_1751882933580.pdf",
  toBeSignedReportS3Url:
    "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/report/toBeSigned/toBe_signed_report_1751882936872.pdf",
  status: "INITIATED",
  kyc2PagerReportS3Url:
    "https://ebi-kycus.s3.amazonaws.com/rekyc/REKYCAPP00001/report/kyc2pager_1751880750951.pdf",
  _class: "com.ebitaus.kycus.features.banker.rekyc.entity.RekycApplication",
};

window.setReportFormData = function (data = sample) {
  // Entity Info
  document.getElementById("entityName").textContent = data.entityName || "";
  document.getElementById("entityType").textContent = data.entityType || "";
  document.getElementById("cin").textContent = data.entityDetails?.cin?.cinNumber || "";
  document.getElementById("gstin").textContent = data.entityDetails?.gstin?.gstinNumber || "";
  document.getElementById("rekycId").textContent = data.entityId || "";
  document.getElementById("requestedOn").textContent = formatDate(data.submittedAt);
  document.getElementById("completedOn").textContent = formatDate(data.date);

  // Entity Files Table
  let entityFilesRows = "";
  (data.entityDocs || []).forEach(doc => {
    entityFilesRows += `<tr>
      <td>${doc.label || ""}</td>
      <td>${doc.status || ""}</td>
      <td>${doc.validationType || ""}</td>
      <td>${formatDate(doc.verifiedOn)}</td>
    </tr>`;
  });
  let entityFilesTable = `
    <h3>Entity files</h3>
    <table>
      <tr>
        <th>Files</th>
        <th>Status</th>
        <th>Validation</th>
        <th>Verified on</th>
      </tr>
      ${entityFilesRows}
    </table>
  `;

  // Authorized Signatories
  let ausHtml = "";
  (data.authorizedSignatories || []).forEach((aus, idx) => {
    let ausRows = "";
    (aus.documentStatus || []).forEach(doc => {
      ausRows += `<tr>
        <td>${doc.docType || ""}</td>
        <td>${doc.status || ""}</td>
        <td>${doc.validationType || ""}</td>
        <td>${formatDate(doc.verifiedOn)}</td>
      </tr>`;
    });
    ausHtml += `
      <h3>Authorized Signatory ${idx + 1}</h3>
      <p><b>${aus.name || ""}</b><br/><span>${aus.email || ""}</span></p>
      <table>
        <tr>
          <th>Files</th>
          <th>Status</th>
          <th>Validation</th>
          <th>Verified on</th>
        </tr>
        ${ausRows}
      </table>
    `;
  });

  document.getElementById("content").innerHTML = entityFilesTable + ausHtml;
};

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
