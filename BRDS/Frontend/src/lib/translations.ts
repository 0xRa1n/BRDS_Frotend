export type Language = "en" | "fil";

export const translations = {
  en: {
    // Header
    languageName: "English",
    trackRequest: "Track Request",
    login: "Login",
    logout: "Log out",
    kumusta: "Hello",

    // Home & Hero
    requestDocBtn: "Request a Document",
    trackMyRequestBtn: "Track my request",
    noMoreLines: "No more waiting in line.",
    homeFeature1Desc:
      "Submit a request from the comfort of your home. You no longer need to go to the barangay hall just to fill up a form. We made this easy and accessible for everyone.",
    homeFeature2Desc:
      "Receive status updates via text. Track your request at every step and know immediately when you need to go to the hall.",
    homeFeature3Desc:
      "Just go to the barangay hall when the document is ready. Schedule a time you want for a faster and hassle-free experience.",

    // Auth
    verifyNumberTitle: "Verify your number",
    verifyNumberDesc:
      "Enter your cellphone number to receive a verification code.",
    sendCodeBtn: "Send code",
    sendingCodeBtn: "Sending...",
    numberUsedForVerifOnly: "Your number will only be used for verification.",
    enterVerifCodeTitle: "Enter Verification Code",
    enterVerifCodeDesc: "Type the 6-digit code sent to your number.",
    notReceivedResend: "Not received? Resend",

    // Dashboard
    pastRequests: "Past Requests",
    noRequestYet: 'You have no requests yet. Click "New Request" to start.',
    viewAll: "View All",
    editInfo: "Edit Information",
    dateOfBirth: "Date of Birth",
    barangayAddress: "Barangay Address",
    saveBtn: "Save",
    fullName: "Full Name",
    cellphoneNumber: "Cellphone Number",
    newRequest: "New Request",
    activeRequests: "Active Requests",
    readyForPickup: "Ready for Pickup",
    totalCompleted: "Total Completed",

    // Document Request Flow
    docTypeStep: "Document Type",
    personalInfoStep: "Personal Information",
    reviewSubmitStep: "Review and Submit",
    clearanceDesc: "For work, bank, or ID",
    indigencyDesc: "For financial or medical assistance",
    businessDesc: "For opening a business",
    residencyDesc: "Proof of residence in the barangay",
    whatDocNeeded: "What document do you need?",
    goBack: "Go Back",
    selectReason: "Select a reason...",
    uploadIdDesc: "Upload or take a photo of your ID",
    confirmInfoCorrect:
      "I certify that all the information I provided is correct.",
    requestReceived:
      "We have received your request. Please save your Reference Number to track its status.",
    backToDashboard: "Back to Dashboard",
    next: "Next",

    // Tracking
    trackYourRequest: "Track your Request",
    trackSearchDesc:
      "Type the Reference Number you received after submitting the request.",
    searchBtn: "Search",
    requestStatusTitle: "Request Status",
    statusReceived: "Received",
    statusUnderReview: "Under Review",
    statusApproved: "Approved",
    statusReadyForPickup: "Ready for Pickup",
    needsInfoTitle: "Needs Information",
    needsInfoDesc: "The uploaded ID is blurry. Please upload again.",
    updateInfoBtn: "Update Information",
    approvedTitle: "Approved!",
    approvedDesc: "Go to the Barangay Hall, Monday–Friday, 8am–5pm.",
    schedulePickupBtn: "Schedule Pickup",
    releasedTitle: "Released",
    releasedDesc: "Your document has been claimed.",
    allRequestsTitle: "All Requests",

    // All Requests
    cancelRequest: "Cancel Request",
    allRequestsSubtitle: "History of your barangay transactions",
    noPastRequests: "No past requests yet.",
    showingEntries: "Showing {start} to {end} of {total} entries",
    allPastRequests: "All Past Requests",
    transactionHistory: "History of your barangay transactions",
    noPastRequests: "No past requests yet.",
    showingEntries: "Showing {startEntry} to {endEntry} of {total} entries",
  },
  fil: {
    // Header
    languageName: "Filipino",
    trackRequest: "I-track ang Request",
    login: "Login",
    logout: "Log out",
    kumusta: "Kumusta",

    // Home & Hero
    requestDocBtn: "Mag-request ng dokumento",
    trackMyRequestBtn: "I-track ang aking request",
    noMoreLines: "Hindi na kailangan pang pumila.",
    homeFeature1Desc:
      "Mag-submit ng request kahit nasa bahay. Hindi mo na kailangang pumunta sa barangay hall para lang mag-fill up ng form. Ginawa naming madali at accessible ito para sa lahat.",
    homeFeature2Desc:
      "Makatanggap ng status updates sa text. I-track ang iyong request sa bawat hakbang at malaman agad kung kailangan mo nang pumunta sa hall.",
    homeFeature3Desc:
      "Pumunta lang sa barangay hall pag ready na ang dokumento. I-schedule ang oras na gusto mo para mas mabilis at walang abala sa iyong araw.",

    // Auth
    verifyNumberTitle: "I-verify ang iyong numero",
    verifyNumberDesc:
      "Ilagay ang iyong cellphone number para makatanggap ng verification code.",
    sendCodeBtn: "Magpadala ng code",
    sendingCodeBtn: "Nagpapadala...",
    numberUsedForVerifOnly:
      "Ang iyong numero ay gagamitin lamang para sa verification.",
    enterVerifCodeTitle: "Ilagay ang Verification Code",
    enterVerifCodeDesc: "I-type ang 6-digit code na ipinadala sa iyong numero.",
    notReceivedResend: "Hindi natanggap? I-resend",

    // Dashboard
    pastRequests: "Mga Nakaraang Request",
    noRequestYet:
      'Wala ka pang request. Mag-click ng "Bagong Request" para magsimula.',
    viewAll: "Tingnan Lahat",
    editInfo: "I-edit ang Impormasyon",
    dateOfBirth: "Araw ng Kapanganakan (Date of Birth)",
    barangayAddress: "Address sa Barangay",
    saveBtn: "I-save",
    fullName: "Buong Pangalan",
    cellphoneNumber: "Cellphone Number",
    newRequest: "Bagong Request",
    activeRequests: "Active Requests",
    readyForPickup: "Ready for Pickup",
    totalCompleted: "Total Completed",

    // Document Request Flow
    docTypeStep: "Uri ng Dokumento",
    personalInfoStep: "Personal na Impormasyon",
    reviewSubmitStep: "Review at Submit",
    clearanceDesc: "Para sa trabaho, bangko, o ID",
    indigencyDesc: "Para sa financial o medical assistance",
    businessDesc: "Para sa pagbukas ng negosyo",
    residencyDesc: "Patunay ng tirahan sa barangay",
    whatDocNeeded: "Anong dokumento ang kailangan mo?",
    goBack: "Bumalik",
    selectReason: "Pumili ng dahilan...",
    uploadIdDesc: "Mag-upload o kumuha ng litrato ng iyong ID",
    confirmInfoCorrect:
      "Pinatutunayan ko na tama ang lahat ng impormasyon na aking inilagay.",
    requestReceived:
      "Natanggap na namin ang iyong request. Paki-save ang iyong Reference Number para ma-track ang status nito.",
    backToDashboard: "Bumalik sa Dashboard",
    next: "Next",

    // Tracking
    trackYourRequest: "I-track ang iyong Request",
    trackSearchDesc:
      "I-type ang Reference Number na natanggap mo matapos mag-submit ng request.",
    searchBtn: "Hanapin",
    requestStatusTitle: "Status ng iyong Request",
    statusReceived: "Natanggap",
    statusUnderReview: "Sinusuri",
    statusApproved: "Naaprubahan",
    statusReadyForPickup: "Pwede na i-pick up",
    needsInfoTitle: "Needs Information",
    needsInfoDesc: "Malabo ang na-upload na ID. Paki-upload muli.",
    updateInfoBtn: "Mag-update ng impormasyon",
    approvedTitle: "Approved!",
    approvedDesc: "Pumunta sa Barangay Hall, Lunes–Biyernes, 8am–5pm.",
    schedulePickupBtn: "I-schedule ang Pickup",
    docRetrievedMsg: "Nakuha na ang inyong dokumento.",

    // All Requests
    cancelRequest: "I-cancel ang Request",
    allRequestsSubtitle: "Kasaysayan ng iyong mga transaksyon sa barangay",
    noPastRequests: "Wala pang nakaraang request.",
    showingEntries: "Pinapakita ang {start} hanggang {end} ng {total} entries",
    allPastRequests: "Lahat ng Nakaraang Request",
    transactionHistory: "Kasaysayan ng iyong mga transaksyon sa barangay",
    noPastRequests: "Wala pang nakaraang request.",
    showingEntries:
      "Pinapakita ang {startEntry} hanggang {endEntry} ng {total} entries",
  },
};

export type TranslationKey = keyof typeof translations.en;
