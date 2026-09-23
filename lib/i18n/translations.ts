export type SupportedLanguage = 'en' | 'hi' | 'pa';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  findHospitalBtn: string;
  howItWorksBtn: string;
  punjabPrototypeBadge: string;
  pipelineStep1: string;
  pipelineStep2: string;
  pipelineStep3: string;
  pipelineStep4: string;
  pipelineStep5: string;
  
  // Chatbot & Dashboard
  greetingAfternoon: string;
  dashboardSubhead: string;
  chatPlaceholder: string;
  liveRequirementTitle: string;
  fieldPatient: string;
  fieldCondition: string;
  fieldTreatment: string;
  fieldLocation: string;
  fieldRadius: string;
  fieldBudget: string;
  fieldPriority: string;
  fieldUrgency: string;
  
  // Clarification
  clarificationPrompt: string;
  
  // Results & Cards
  matchScore: string;
  strongMatch: string;
  goodMatch: string;
  partialMatch: string;
  whyMatchTitle: string;
  whatDoesNotMatchTitle: string;
  dataTrustTitle: string;
  viewHospitalBtn: string;
  compareBtn: string;
  savedBtn: string;
  mapViewBtn: string;
  whatIfBtn: string;
  
  // Emergency
  emergencyAlertTitle: string;
  emergencyAlertDesc: string;
  emergencyAmbulanceBtn: string;
  emergencyNationalBtn: string;
  
  // Nav
  navSearch: string;
  navCompare: string;
  navSaved: string;
  navDashboard: string;
  navMap: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'CAREMATCH INDIA',
    tagline: 'Find hospitals that match your healthcare needs.',
    heroHeadline: 'AI-Powered Hospital Discovery, Matching & Comparison Platform',
    heroSubheadline: 'Describe your healthcare requirement in your own words. Discover and compare relevant hospitals using disease, treatment, location, cost and available verified information.',
    findHospitalBtn: 'Find a Hospital',
    howItWorksBtn: 'How It Works',
    punjabPrototypeBadge: 'Punjab-First Prototype • India-Scalable Architecture',
    pipelineStep1: 'User Requirement',
    pipelineStep2: 'AI Understanding',
    pipelineStep3: 'Semantic Search',
    pipelineStep4: 'Intelligent Match',
    pipelineStep5: 'Verified Results',
    
    greetingAfternoon: 'Good afternoon 👋',
    dashboardSubhead: 'How can we help you find the right healthcare option?',
    chatPlaceholder: 'Tell us what healthcare service you need... (e.g. My father needs angioplasty near Jalandhar within ₹2 lakh budget)',
    liveRequirementTitle: 'Live Requirement Extraction',
    fieldPatient: 'Patient',
    fieldCondition: 'Condition',
    fieldTreatment: 'Treatment',
    fieldLocation: 'Location',
    fieldRadius: 'Search Radius',
    fieldBudget: 'Stated Budget',
    fieldPriority: 'Priorities',
    fieldUrgency: 'Urgency',
    
    clarificationPrompt: 'Clarification Needed:',
    
    matchScore: 'Compatibility Match',
    strongMatch: 'Strong Match',
    goodMatch: 'Good Match',
    partialMatch: 'Partial Match',
    whyMatchTitle: 'Why This Match?',
    whatDoesNotMatchTitle: "What Doesn't Match?",
    dataTrustTitle: 'Data Trust & Source Verification',
    viewHospitalBtn: 'View Details',
    compareBtn: 'Compare',
    savedBtn: 'Save',
    mapViewBtn: 'View on Map',
    whatIfBtn: 'What-If Simulation',
    
    emergencyAlertTitle: '🚨 POSSIBLE MEDICAL EMERGENCY',
    emergencyAlertDesc: 'Symptoms described suggest an acute medical emergency. Please call local emergency services immediately or visit the nearest 24/7 trauma emergency room.',
    emergencyAmbulanceBtn: 'Call Ambulance 108',
    emergencyNationalBtn: 'National Emergency 112',
    
    navSearch: 'AI Search Studio',
    navCompare: 'Compare (2-4)',
    navSaved: 'Saved Hospitals',
    navDashboard: 'Dashboard',
    navMap: 'Geo Map',
  },
  hi: {
    appName: 'केयरमैच इंडिया',
    tagline: 'अपनी स्वास्थ्य आवश्यकताओं से मेल खाने वाले अस्पताल खोजें।',
    heroHeadline: 'एआई-संचालित अस्पताल खोज, मिलान और तुलना मंच',
    heroSubheadline: 'अपनी स्वास्थ्य आवश्यकता को अपने शब्दों में बताएं। बीमारी, उपचार, स्थान, लागत और सत्यापित जानकारी के आधार पर उपयुक्त अस्पतालों की तुलना करें।',
    findHospitalBtn: 'अस्पताल खोजें',
    howItWorksBtn: 'यह कैसे काम करता है',
    punjabPrototypeBadge: 'पंजाब-प्रथम प्रोटोटाइप • अखिल भारतीय स्तर पर मापनीय',
    pipelineStep1: 'नागरिक आवश्यकता',
    pipelineStep2: 'एआई समझ',
    pipelineStep3: 'सिमेंटिक सर्च',
    pipelineStep4: 'इंटेलिजेंट मैचिंग',
    pipelineStep5: 'सत्यापित परिणाम',
    
    greetingAfternoon: 'शुभ दोपहर 👋',
    dashboardSubhead: 'हम आपको सही स्वास्थ्य विकल्प खोजने में कैसे मदद कर सकते हैं?',
    chatPlaceholder: 'बताएं आपको किस स्वास्थ्य सेवा की आवश्यकता है... (उदा. जालंधर में पिता के लिए 2 लाख के बजट में एंजियोप्लास्टी)',
    liveRequirementTitle: 'लाइव आवश्यकता निष्कर्षण',
    fieldPatient: 'मरीज़',
    fieldCondition: 'बीमारी/लक्षण',
    fieldTreatment: 'उपचार',
    fieldLocation: 'स्थान',
    fieldRadius: 'खोज दायरा',
    fieldBudget: 'बजट',
    fieldPriority: 'प्राथमिकता',
    fieldUrgency: 'तात्कालिकता',
    
    clarificationPrompt: 'स्पष्टीकरण की आवश्यकता:',
    
    matchScore: 'संगतता स्कोर',
    strongMatch: 'उत्कृष्ट मेल (Strong Match)',
    goodMatch: 'अच्छा मेल (Good Match)',
    partialMatch: 'आंशिक मेल (Partial Match)',
    whyMatchTitle: 'यह अस्पताल क्यों मेल खाता है?',
    whatDoesNotMatchTitle: 'क्या मेल नहीं खाता?',
    dataTrustTitle: 'डेटा विश्वसनीयता और स्रोत सत्यापन',
    viewHospitalBtn: 'विवरण देखें',
    compareBtn: 'तुलना करें',
    savedBtn: 'सुरक्षित करें',
    mapViewBtn: 'मानचित्र पर देखें',
    whatIfBtn: 'व्हाट-इफ (सिम्युलेशन)',
    
    emergencyAlertTitle: '🚨 संभावित आपातकालीन स्थिति',
    emergencyAlertDesc: 'वर्णित लक्षण एक गंभीर आपातकालीन स्थिति का संकेत देते हैं। कृपया तुरंत 108/112 पर कॉल करें या निकटतम 24x7 ट्रॉमा आपातकालीन कक्ष में जाएं।',
    emergencyAmbulanceBtn: 'एंबुलेंस 108 डायल करें',
    emergencyNationalBtn: 'आपातकालीन 112 डायल करें',
    
    navSearch: 'एआई खोज स्टूडियो',
    navCompare: 'तुलना करें (2-4)',
    navSaved: 'सहेजे गए अस्पताल',
    navDashboard: 'डैशबोर्ड',
    navMap: 'मानचित्र',
  },
  pa: {
    appName: 'ਕੇਅਰਮੈਚ ਇੰਡੀਆ',
    tagline: 'ਆਪਣੀਆਂ ਸਿਹਤ ਜ਼ਰੂਰਤਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਸਪਤਾਲ ਲੱਭੋ।',
    heroHeadline: 'ਏਆਈ-ਸੰਚਾਲਿਤ ਹਸਪਤਾਲ ਖੋਜ, ਮੇਲ ਅਤੇ ਤੁਲਨਾ ਪਲੇਟਫਾਰਮ',
    heroSubheadline: 'ਆਪਣੀ ਸਿਹਤ ਜ਼ਰੂਰਤ ਨੂੰ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਦੱਸੋ। ਬਿਮਾਰੀ, ਇਲਾਜ, ਸਥਾਨ, ਖਰਚਾ ਅਤੇ ਉਪਲਬਧ ਪ੍ਰਮਾਣਿਤ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ ਢੁਕਵੇਂ ਹਸਪਤਾਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।',
    findHospitalBtn: 'ਹਸਪਤਾਲ ਲੱਭੋ',
    howItWorksBtn: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    punjabPrototypeBadge: 'ਪੰਜਾਬ-ਪਹਿਲਾ ਪ੍ਰੋਟੋਟਾਈਪ • ਆਲ-ਇੰਡੀਆ ਸਕੇਲੇਬਲ ਆਰਕੀਟੈਕਚਰ',
    pipelineStep1: 'ਨਾਗਰਿਕ ਜ਼ਰੂਰਤ',
    pipelineStep2: 'ਏਆਈ ਸਮਝ',
    pipelineStep3: 'ਸਿਮੈਂਟਿਕ ਖੋਜ',
    pipelineStep4: 'ਬੁੱਧੀਮਾਨ ਮੇਲ',
    pipelineStep5: 'ਪ੍ਰਮਾਣਿਤ ਨਤੀਜੇ',
    
    greetingAfternoon: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ 👋',
    dashboardSubhead: 'ਅਸੀਂ ਸਹੀ ਸਿਹਤ ਵਿਕਲਪ ਲੱਭਣ ਵਿੱਚ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?',
    chatPlaceholder: 'ਦੱਸੋ ਤੁਹਾਨੂੰ ਕਿਸ ਸਿਹਤ ਸੇਵਾ ਦੀ ਲੋੜ ਹੈ... (ਉਦਾ. ਜਲੰਧਰ ਵਿੱਚ ਪਿਤਾ ਜੀ ਲਈ 2 ਲੱਖ ਦੇ ਬਜਟ ਵਿੱਚ ਐਂਜੀਓਪਲਾਸਟੀ)',
    liveRequirementTitle: 'ਲਾਈਵ ਜ਼ਰੂਰਤ ਐਬਸਟਰੈਕਸ਼ਨ',
    fieldPatient: 'ਮਰੀਜ਼',
    fieldCondition: 'ਬਿਮਾਰੀ/ਲੱਛਣ',
    fieldTreatment: 'ਇਲਾਜ',
    fieldLocation: 'ਸਥਾਨ',
    fieldRadius: 'ਖੋਜ ਦਾਇਰਾ',
    fieldBudget: 'ਬਜਟ',
    fieldPriority: 'ਤਰਜੀਹ',
    fieldUrgency: 'ਜ਼ਰੂਰੀ ਪੱਧਰ',
    
    clarificationPrompt: 'ਸਪੱਸ਼ਟੀਕਰਨ ਦੀ ਲੋੜ:',
    
    matchScore: 'ਅਨੁਕੂਲਤਾ ਸਕੋਰ',
    strongMatch: 'ਮਜ਼ਬੂਤ ਮੇਲ (Strong Match)',
    goodMatch: 'ਵਧੀਆ ਮੇਲ (Good Match)',
    partialMatch: 'ਅੰਸ਼ਕ ਮੇਲ (Partial Match)',
    whyMatchTitle: 'ਇਹ ਹਸਪਤਾਲ ਕਿਉਂ ਮੇਲ ਖਾਂਦਾ ਹੈ?',
    whatDoesNotMatchTitle: 'ਕੀ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ?',
    dataTrustTitle: 'ਡਾਟਾ ਭਰੋਸੇਯੋਗਤਾ ਅਤੇ ਸਰੋਤ ਤਸਦੀਕ',
    viewHospitalBtn: 'ਵੇਰਵੇ ਦੇਖੋ',
    compareBtn: 'ਤੁਲਨਾ ਕਰੋ',
    savedBtn: 'ਸੇਵ ਕਰੋ',
    mapViewBtn: 'ਨਕਸ਼ੇ ਤੇ ਦੇਖੋ',
    whatIfBtn: 'ਵਟ-ਇਫ (ਸਿਮੂਲੇਸ਼ਨ)',
    
    emergencyAlertTitle: '🚨 ਸੰਭਾਵਿਤ ਐਮਰਜੈਂਸੀ',
    emergencyAlertDesc: 'ਦੱਸੇ ਗਏ ਲੱਛਣ ਇੱਕ ਗੰਭੀਰ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ 108 ਜਾਂ 112 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨਜ਼ਦੀਕੀ ਐਮਰਜੈਂਸੀ ਰੂਮ ਪਹੁੰਚੋ।',
    emergencyAmbulanceBtn: 'ਐਂਬੂਲੈਂਸ 108 ਡਾਇਲ ਕਰੋ',
    emergencyNationalBtn: 'ਐਮਰਜੈਂਸੀ 112 ਡਾਇਲ ਕਰੋ',
    
    navSearch: 'ਏਆਈ ਖੋਜ ਸਟੂਡੀਓ',
    navCompare: 'ਤੁਲਨਾ (2-4)',
    navSaved: 'ਸੰਭਾਲੇ ਹਸਪਤਾਲ',
    navDashboard: 'ਡੈਸ਼ਬੋਰਡ',
    navMap: 'ਨਕਸ਼ਾ',
  },
};
