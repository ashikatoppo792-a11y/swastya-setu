import { SupportedLanguage } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  emergencySos: string;
  elderMode: string;
  voiceAssistant: string;
  notifications: string;
  changeLanguage: string;
  searchPlaceholder: string;
  tabs: {
    telehealth: string;
    appointments: string;
    triage: string;
    medicine: string;
    blood: string;
    records: string;
    womens: string;
    elder: string;
    queue: string;
    location: string;
  };
  telehealthSubtitle: string;
  appointmentsSubtitle: string;
  triageSubtitle: string;
  medicineSubtitle: string;
  bloodSubtitle: string;
  recordsSubtitle: string;
  womensSubtitle: string;
  elderSubtitle: string;
  queueSubtitle: string;
  locationSubtitle: string;
  common: {
    bookNow: string;
    callNow: string;
    direction: string;
    status: string;
    save: string;
    cancel: string;
    submit: string;
    loading: string;
    offlineMode: string;
    verified: string;
    emergencyCall: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Swastya Setu',
    tagline: 'Bridging Healthcare for Every Village & Town',
    emergencySos: 'Emergency 108 SOS',
    elderMode: 'Sahayak Mode',
    voiceAssistant: 'Voice Guide',
    notifications: 'Notifications',
    changeLanguage: 'Language',
    searchPlaceholder: 'Search hospitals, symptoms, blood, medicines...',
    tabs: {
      telehealth: 'Telehealth & Centers',
      appointments: 'Doctor Appointments',
      triage: 'AI Symptom Triage',
      medicine: 'Pill Reminders',
      blood: 'Blood & Donors',
      records: 'ABHA Health Locker',
      womens: "Women's Health",
      elder: 'Elder & Caregiver',
      queue: 'OPD Smart Queue',
      location: 'RESQ Location & Map',
    },
    telehealthSubtitle: 'Locate nearest PHCs, CHCs and connect with doctors via low-bandwidth video/audio',
    appointmentsSubtitle: 'Book hospital doctor appointments 2+ days in advance to skip crowded OPD queues',
    triageSubtitle: 'AI-assisted symptom checker with clinical red-flag emergency detection',
    medicineSubtitle: 'Never miss a dose with smart alerts, adherence tracking & caregiver WhatsApp pings',
    bloodSubtitle: 'Emergency blood inventory locator, nearby donor network & 1-click SOS broadcast',
    recordsSubtitle: 'ABHA integrated digital health record locker for prescriptions, labs and vitals',
    womensSubtitle: 'Discreet, secure maternal and reproductive health guidance & nearby female workers',
    elderSubtitle: 'Simplified high-contrast dashboard with 1-touch SOS and family monitoring',
    queueSubtitle: 'Avoid crowded hospital waiting rooms with live OPD token status & digital passes',
    locationSubtitle: 'Live GPS location, Haversine nearest hospital calculations, responder dispatch & Leaflet routing',
    common: {
      bookNow: 'Book Consult',
      callNow: 'Call Direct',
      direction: 'Get Directions',
      status: 'Status',
      save: 'Save Changes',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
      offlineMode: 'Low Data Mode',
      verified: 'Govt Verified',
      emergencyCall: 'Dial 108 Emergency',
    },
  },
  hi: {
    appName: 'स्वास्थ्य सेतु',
    tagline: 'हर गाँव और कस्बे के लिए सुलभ स्वास्थ्य सेवा',
    emergencySos: 'आपातकालीन 108 SOS',
    elderMode: 'सहायक (बुजुर्ग) मोड',
    voiceAssistant: 'आवाज़ सहायक',
    notifications: 'सूचनाएं',
    changeLanguage: 'भाषा बदलें',
    searchPlaceholder: 'अस्पताल, लक्षण, रक्त, दवाइयां खोजें...',
    tabs: {
      telehealth: 'टेलीहेल्थ व अस्पताल',
      appointments: 'डॉक्टर अपॉइंटमेंट',
      triage: 'लक्षण जांच (AI)',
      medicine: 'दवा व चेकअप रिमाइंडर',
      blood: 'रक्त उपलब्धता व रक्तदाता',
      records: 'डिजिटल हेल्थ रिकॉर्ड (ABHA)',
      womens: 'महिला स्वास्थ्य व सलाह',
      elder: 'बुजुर्ग देखभाल (सहायक)',
      queue: 'स्मार्ट टोकन व OPD कतार',
      location: 'स्थान व नक्शा (GPS)',
    },
    telehealthSubtitle: 'निकटतम प्राथमिक स्वास्थ्य केंद्र खोजें और कम इंटरनेट पर डॉक्टरों से परामर्श लें',
    appointmentsSubtitle: 'भीड़ और लंबी कतार से बचने के लिए 2 दिन पहले डॉक्टर का समय बुक करें',
    triageSubtitle: 'आपातकालीन लक्षणों की पहचान और तुरंत सही चिकित्सकीय सलाह',
    medicineSubtitle: 'दवा समय पर लें, खुराक याद रखें और परिवार को स्वचालित सूचना भेजें',
    bloodSubtitle: 'आपातकाल में नजदीकी ब्लड बैंक में रक्त खोजें और दाताओं से संपर्क करें',
    recordsSubtitle: 'आभा (ABHA) से जुड़े पर्चे, जांच रिपोर्ट और मेडिकल रिकॉर्ड एक जगह सुरक्षित',
    womensSubtitle: 'सुरक्षित, निजी महिला स्वास्थ्य मार्गदर्शन, आशा कार्यकर्ता व महिला विशेषज्ञ संपर्क',
    elderSubtitle: 'बड़े बटनों और आवाज़ से चलने वाला आसान इंटरफ़ेस व 1-टच इमरजेंसी बटन',
    queueSubtitle: 'अस्पतालों में भीड़ और कतार से बचें, घर बैठे लाइव टोकन नंबर और समय देखें',
    locationSubtitle: 'लाइव जीपीएस स्थिति, निकटतम अस्पताल की दूरी (हवेरसीन सूत्र) और एम्बुलेंस ट्रैकिंग',
    common: {
      bookNow: 'परामर्श बुक करें',
      callNow: 'कॉल करें',
      direction: 'रास्ता देखें',
      status: 'स्थिति',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      loading: 'प्रतीक्षा करें...',
      offlineMode: 'कम इंटरनेट मोड',
      verified: 'सरकार द्वारा प्रमाणित',
      emergencyCall: '108 एम्बुलेंस बुलाएं',
    },
  },
  bn: {
    appName: 'স্বাস্থ্য সেতু',
    tagline: 'গ্রাম ও শহরের প্রতিটি মানুষের জন্য স্বাস্থ্য পরিষেবা',
    emergencySos: 'জরুরী 108 SOS',
    elderMode: 'সহায়ক (বয়স্ক) মোড',
    voiceAssistant: 'ভয়েস গাইড',
    notifications: 'বিজ্ঞপ্তি',
    changeLanguage: 'ভাষা',
    searchPlaceholder: 'হাসপাতাল, লক্ষণ, রক্ত, ওষুধ খুঁজুন...',
    tabs: {
      telehealth: 'টেলিহেলথ ও কেন্দ্র',
      appointments: 'ডাক্তার অ্যাপয়েন্টমেন্ট',
      triage: 'AI লক্ষণ ট্রায়াজ',
      medicine: 'ওষুধের অনুস্মারক',
      blood: 'রক্ত ও রক্তদাতা',
      records: 'ABHA স্বাস্থ্য রেকর্ড',
      womens: 'নারী স্বাস্থ্য',
      elder: 'বয়স্কদের সেবা',
      queue: 'OPD স্মার্ট কিউ',
      location: 'অবস্থান ও মানচিত্র',
    },
    telehealthSubtitle: 'নিকটস্থ স্বাস্থ্যকেন্দ্র খুঁজুন এবং কম ইন্টারনেটে ডাক্তারের পরামর্শ নিন',
    appointmentsSubtitle: 'হাসপাতালের ভিড় এড়াতে ২ দিন আগে ডাক্তারের সাক্ষাৎ নির্ধারণ করুন',
    triageSubtitle: 'জরুরি লক্ষণ নির্ণয় এবং দ্রুত সঠিক চিকিৎসা নির্দেশনা',
    medicineSubtitle: 'ওষুধের সময় মনে রাখুন এবং যত্নশীলদের জন্য সতর্কবার্তা',
    bloodSubtitle: 'জরুরী রক্তের মজুদ ও রক্তদাতাদের সাথে তাৎক্ষণিক যোগাযোগ',
    recordsSubtitle: 'প্রেসক্রিপশন ও টেস্ট রিপোর্ট সুরক্ষিত ডিজিটাল লকার',
    womensSubtitle: 'গোপনীয় ও নির্ভরযোগ্য নারী স্বাস্থ্য পরামর্শ ও আশা কর্মী সহায়তা',
    elderSubtitle: 'সহজ ইন্টারফেস, বড় বোতাম এবং ১-ক্লিক জরুরি বোতাম',
    queueSubtitle: 'হাসপাতালের ভিড় এড়ান, লাইভ টোকেন স্ট্যাটাস দেখুন',
    locationSubtitle: 'লাইভ জিপিএস অবস্থান, নিকটতম হাসপাতালের দূরত্ব এবং এম্বুলেন্স ট্র্যাকিং',
    common: {
      bookNow: 'বুক করুন',
      callNow: 'কল করুন',
      direction: 'দিকনির্দেশনা',
      status: 'অবস্থা',
      save: 'সংরক্ষণ',
      cancel: 'বাতিল',
      submit: 'জমা দিন',
      loading: 'লোড হচ্ছে...',
      offlineMode: 'কম ডেটা মোড',
      verified: 'যাচাইকৃত',
      emergencyCall: '১০৮ এম্বুলেন্স কল',
    },
  },
  te: {
    appName: 'స్వాస్థ్య సేతు',
    tagline: 'ప్రతి గ్రామానికి మరియు నగరానికి ఆరోగ్య వారధి',
    emergencySos: 'అత్యవసర 108 SOS',
    elderMode: 'సహాయక్ (వృద్ధుల) మోడ్',
    voiceAssistant: 'వాయిస్ గైడ్',
    notifications: 'నోటిఫికేషన్లు',
    changeLanguage: 'భాష',
    searchPlaceholder: 'ఆసుపత్రులు, లక్షణాలు, రక్తం, మందులను శోధించండి...',
    tabs: {
      telehealth: 'టెలిహెల్త్ & కేంద్రాలు',
      appointments: 'డాక్టర్ అపాయింట్‌మెంట్',
      triage: 'AI లక్షణాల గుర్తింపు',
      medicine: 'మందుల రిమైండర్',
      blood: 'రక్తం & రక్తదాతలు',
      records: 'ABHA ఆరోగ్య రికార్డులు',
      womens: 'మహిళా ఆరోగ్యం',
      elder: 'వృద్ధుల సంరక్షణ',
      queue: 'OPD స్మార్ట్ క్యూ',
      location: 'స్థానం & మ్యాప్ (GPS)',
    },
    telehealthSubtitle: 'సమీపంలోని PHC లను కనుగొనండి మరియు వైద్యులతో మాట్లాడండి',
    appointmentsSubtitle: 'ఆసుపత్రి రద్దీని నివారించడానికి 2 రోజుల ముందే డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయండి',
    triageSubtitle: 'లక్షణాలను బట్టి అత్యవసర చికిత్స అవసరమా అని తెలుసుకోండి',
    medicineSubtitle: 'మందులను సమయానికి తీసుకోండి, సంరక్షకులకు హెచ్చరికలు పంపండి',
    bloodSubtitle: 'అత్యవసర పరిస్థితుల్లో రక్త లభ్యత మరియు దాతల సమాచారం',
    recordsSubtitle: 'మీ ప్రిస్క్రిప్షన్లు మరియు రిపోర్టులు డిజిటల్ లాకర్ లో భద్రం',
    womensSubtitle: 'గోప్యమైన మహిళా ఆరోగ్య సలహాలు మరియు సమీప ఆశా కార్యకర్తలు',
    elderSubtitle: 'వృద్ధుల కోసం పెద్ద బటన్లు మరియు సులభమైన 1-టచ్ అత్యవసర SOS',
    queueSubtitle: 'ఆసుపత్రుల్లో వేచి ఉండే సమయాన్ని తగ్గించే లైవ్ టోకెన్ సిస్టమ్',
    locationSubtitle: 'ప్రత్యక్ష GPS స్థానం, సమీప ఆసుపత్రి దూరం మరియు అంబులెన్స్ రూటింగ్',
    common: {
      bookNow: 'బుక్ చేయండి',
      callNow: 'కాల్ చేయండి',
      direction: 'దారి చూడండి',
      status: 'స్థితి',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      submit: 'సమర్పించండి',
      loading: 'లోడ్ అవుతోంది...',
      offlineMode: 'తక్కువ డేటా మోడ్',
      verified: 'ధృవీకరించబడింది',
      emergencyCall: '108 అంబులెన్స్ కాల్',
    },
  },
  ta: {
    appName: 'சுவஸ்த்ய சேது',
    tagline: 'அனைவருக்கும் எளிய மற்றும் நம்பகமான நல்வாழ்வு பாலம்',
    emergencySos: 'அவசர 108 SOS',
    elderMode: 'உதவியாளர் (முதியோர்) பயன்முறை',
    voiceAssistant: 'குரல் வழிகாட்டி',
    notifications: 'அறிவிப்புகள்',
    changeLanguage: 'மொழி',
    searchPlaceholder: 'மருத்துவமனைகள், அறிகுறிகள், இரத்தம், மருந்துகள்...',
    tabs: {
      telehealth: 'தொலை மருத்துவம் & மையங்கள்',
      appointments: 'மருத்துவர் முன்பதிவு',
      triage: 'AI அறிகுறி ஆய்வு',
      medicine: 'மருந்து நினைவூட்டல்',
      blood: 'இரத்தம் & கொடையாளர்கள்',
      records: 'ABHA மருத்துவ பதிவுகள்',
      womens: 'பெண்கள் நலம்',
      elder: 'முதியோர் பராமரிப்பு',
      queue: 'OPD ஸ்மார்ட் வரிசை',
      location: 'இடம் & வரைபடம் (GPS)',
    },
    telehealthSubtitle: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலையங்களை கண்டறிந்து மருத்துவர்களை தொடர்பு கொள்ளுங்கள்',
    appointmentsSubtitle: 'மருத்துவமனை கூட்ட நெரிசலைத் தவிர்க்க 2 நாட்களுக்கு முன்பே மருத்துவரை முன்பதிவு செய்யுங்கள்',
    triageSubtitle: 'அறிகுறிகளை ஆய்வு செய்து உடனடி மருத்துவ வழிகாட்டுதல் பெறுங்கள்',
    medicineSubtitle: 'மருந்துகளை தவறாமல் உட்கொள்ள நினைவூட்டல்கள் மற்றும் வாட்ஸ்அப் தகவல்',
    bloodSubtitle: 'அவசரகால இரத்த இருப்பு மற்றும் தன்னார்வ கொடையாளர் விவரங்கள்',
    recordsSubtitle: 'மருத்துவ ஆவணங்கள் மற்றும் பரிசோதனை அறிக்கைகள் ஒரே இடத்தில்',
    womensSubtitle: 'பாதுகாப்பான பெண்கள் நல்வாழ்வு ஆலோசனை மற்றும் ஆஷா பணியாளர்கள்',
    elderSubtitle: 'முதியவர்களுக்கான எளிய பெரிய பொத்தான்கள் மற்றும் அவசர SOS',
    queueSubtitle: 'மருத்துவமனை நெரிசலை தவிர்க்க நேரடி டோக்கன் நிலை',
    locationSubtitle: 'நேரடி ஜிபிஎஸ் நிலை, அருகிலுள்ள மருத்துவமனை தூரம் மற்றும் அவசர ஊர்தி வரைபடம்',
    common: {
      bookNow: 'முன்பதிவு செய்',
      callNow: 'அழைக்கவும்',
      direction: 'வழித்தடம்',
      status: 'நிலை',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      submit: 'சமர்ப்பி',
      loading: 'ஏற்றுகிறது...',
      offlineMode: 'குறைந்த இணைய பயன்முறை',
      verified: 'அங்கீகரிக்கப்பட்டது',
      emergencyCall: '108 அவசர ஊர்தி',
    },
  },
  mr: {
    appName: 'स्वास्थ्य सेतु',
    tagline: 'प्रत्येक गावासाठी आणि शहरासाठी सुलभ आरोग्य सेवा',
    emergencySos: 'आपत्कालीन 108 SOS',
    elderMode: 'सहायक (ज्येष्ठ नागरिक) मोड',
    voiceAssistant: 'आवाज मार्गदर्शक',
    notifications: 'सूचना',
    changeLanguage: 'भाषा',
    searchPlaceholder: 'रुग्णालये, लक्षणे, रक्त, औषधे शोधा...',
    tabs: {
      telehealth: 'टेलीहेल्थ व केंद्रे',
      appointments: 'डॉक्टर अपॉइंटमेंट',
      triage: 'AI लक्षण चाचणी',
      medicine: 'औषध स्मरणपत्र',
      blood: 'रक्त व रक्तदाते',
      records: 'ABHA डिजिटल रेकॉर्ड',
      womens: 'महिला आरोग्य',
      elder: 'ज्येष्ठ नागरिक काळजी',
      queue: 'OPD स्मार्ट टोकन',
      location: 'स्थान व नकाशा (GPS)',
    },
    telehealthSubtitle: 'जवळचे प्राथमिक आरोग्य केंद्र शोधा आणि डॉक्टरांशी थेट संपर्क साधा',
    appointmentsSubtitle: 'रुग्णालयातील गर्दी टाळण्यासाठी २ दिवस आधी डॉक्टरांची भेट निश्चित करा',
    triageSubtitle: 'गंभीर लक्षणांची त्वरित ओळख आणि योग्य वैद्यकीय मार्गदर्शन',
    medicineSubtitle: 'औषधे वेळेवर घ्या, डोस ट्रॅक करा आणि काळजीवाहू व्यक्तीस संदेश पाठवा',
    bloodSubtitle: 'तातडीच्या वेळी रक्त उपलब्धता आणि जवळचे रक्तदाते',
    recordsSubtitle: 'प्रिस्क्रिप्शन आणि चाचणी अहवाल सुरक्षित डिजिटल लॉकरमध्ये ठेवा',
    womensSubtitle: 'गोपनीय महिला आरोग्य सल्ला आणि आशा सेविकांची मदत',
    elderSubtitle: 'मोठी बटणे, सोपा इंटरफेस आणि १-टच आपत्कालीन SOS',
    queueSubtitle: 'रुग्णालयातील गर्दी टाळा, थेट टोकन क्रमांक आणि वेळ पहा',
    locationSubtitle: 'थेट जीपीएस स्थान, जवळच्या रुग्णालयाचे अंतर (हॅव्हरसाइन) आणि रुग्णवाहिका मार्ग',
    common: {
      bookNow: 'सल्ला बुक करा',
      callNow: 'कॉल करा',
      direction: 'मार्ग पहा',
      status: 'स्थिती',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      submit: 'सादर करा',
      loading: 'लोड होत आहे...',
      offlineMode: 'कमी डेटा मोड',
      verified: 'शासकीय मान्यताप्राप्त',
      emergencyCall: '१०८ रुग्णवाहिका बोलवा',
    },
  },
};
