import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { LanguageCode } from '../types';

// By embedding the translation objects directly, we bypass any browser/server
// issues with loading JSON files as modules, making this approach more robust.
const enTranslations = {
  "header": {
    "dashboard": "Dashboard",
    "cropAnalysis": "Crop Analysis",
    "aiAssistant": "AI Assistant",
    "yourMarketplace": "Your Marketplace",
    "fertilizerStore": "Fertilizer Store",
    "browseProduce": "Browse Produce",
    "manageListings": "Manage Listings",
    "logout": "Logout"
  },
  "auth": {
    "title": "HarvestHub",
    "subtitle": "Your all-in-one platform for modern farming.",
    "welcomeBack": "Welcome Back!",
    "createAccount": "Create Account",
    "loginError": "Login Error",
    "signupError": "Signup Error",
    "googleAccountErrorPrompt": "Click here to Sign in with Google",
    "emailLabel": "Email Address",
    "passwordLabel": "Password",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "or": "OR",
    "signInWithGoogle": "Sign in with Google",
    "noAccount": "Don't have an account?",
    "haveAccount": "Already have an account?",
    "emailPlaceholder": "you@example.com",
    "passwordPlaceholder": "••••••••",
    "emailRequired": "Please enter a valid email.",
    "passwordRequired": "Please enter a password.",
    "unexpectedError": "An unexpected error occurred.",
    "googleSignInError": "An error occurred during Google Sign-In.",
    "googleSignInPrompt": "To simulate Google Sign-In, please enter your email address:",
    "selectLanguage": "Select Language"
  },
  "verifyEmail": {
    "title": "Check Your Inbox",
    "instruction": "We've sent a verification link to {email}. Please click the link to activate your account.",
    "simulationNote": "(This is a simulation for demo purposes)",
    "button": "Simulate Verification & Sign In",
    "verifying": "Verifying...",
    "backToSignIn": "← Back to Sign In"
  },
  "roleSelection": {
    "welcome": "Welcome to HarvestHub",
    "prompt": "Your all-in-one platform for modern farming. Please select your role to get started.",
    "farmer": "Farmer",
    "farmerDesc": "Analyze crop health, get AI advice, and sell your produce.",
    "buyer": "Buyer",
    "buyerDesc": "Browse and buy fresh produce directly from local farmers.",
    "seller": "Fertilizer Seller",
    "sellerDesc": "List your products and connect with farmers in need."
  },
  "bottomNav": {
    "dashboard": "Dashboard",
    "analyze": "Analyze",
    "assistant": "Assistant",
    "sell": "Sell",
    "buy": "Buy",
    "browse": "Browse",
    "listings": "Listings"
  },
  "dashboard": {
    "title": "Farmer's Dashboard",
    "weatherTitle": "Local Weather (Mock Data)",
    "weatherCondition": "Sunny with scattered clouds",
    "humidity": "Humidity: {value}%",
    "weatherTip": "Tip: Good weather for planting. Ensure adequate irrigation due to high temperatures.",
    "weatherDisclaimer": "*In a real app, this data would be live from a weather API.",
    "historyTitle": "Crop Health History",
    "noHistory": "No crop analyses performed yet.",
    "noHistorySub": "Use the 'Crop Analysis' tab to get started."
  },
  "cropAnalysis": {
    "title": "Crop Health Analysis",
    "uploadTitle": "1. Upload a Crop Image",
    "uploadPrompt": "Click below to upload or take a photo",
    "selectImage": "Select Image",
    "analyzeCrop": "Analyze Crop",
    "analyzing": "Analyzing...",
    "resultsTitle": "2. AI Analysis & Recommendations",
    "aiAnalyzing": "AI is analyzing your crop...",
    "resultsPlaceholder": "Analysis results will appear here.",
    "diagnosis": "Diagnosis",
    "description": "Description",
    "remedy": "Recommended Remedy",
    "healthyPlant": "Healthy Plant",
    "confidence": "Confidence: {value}",
    "findFertilizers": "Find Recommended Fertilizers",
    "accuracy": "Accuracy Level",
    "modalTitle": "Fertilizer Recommendations",
    "modalDesc": "Based on the detection of {disease}, here are some products that may help. You can purchase them from our trusted sellers in the store.",
    "recommendation1Title": "Nitrogen-Rich Growth Booster",
    "recommendation1Desc": "Helps with yellowing leaves and promotes vigorous growth.",
    "recommendation2Title": "Fungicide Shield",
    "recommendation2Desc": "Effective against common fungal infections like blight and mildew.",
    "close": "Close",
    "goToStore": "Go to Fertilizer Store"
  },
  "voiceAssistant": {
    "language": "Language:",
    "placeholder": "Ask about farming...",
    "send": "Send",
    "unsupported": "Speech recognition/synthesis is not supported in your browser.",
    "errorResponse": "Sorry, I couldn't get a response. Please try again."
  },
  "marketplace": {
    "title": "Your Marketplace",
    "addProduct": "+ Add New Product",
    "cancel": "Cancel",
    "newListingTitle": "New Product Listing",
    "editListingTitle": "Edit Product Listing",
    "productName": "Product Name",
    "quantity": "Quantity (e.g., 1kg, 1 dozen)",
    "price": "Price (₹)",
    "description": "Description",
    "generateWithAI": "✨ Generate with AI",
    "generating": "Generating...",
    "productImage": "Product Image",
    "updateProduct": "Update Product",
    "listProduct": "List Product",
    "edit": "Edit",
    "noListings": "You haven't listed any products yet.",
    "noListingsSub": "Click '+ Add New Product' to start selling."
  },
  "fertilizerStore": {
    "title": "Buy Fertilizers",
    "buyNow": "Buy Now",
    "noListings": "No fertilizers are listed for sale right now.",
    "noListingsSub": "Please check back later."
  },
  "browseProduce": {
    "title": "Browse Fresh Produce",
    "searchPlaceholder": "Search for products...",
    "addToCart": "Add to Cart",
    "noListings": "No produce available right now.",
    "noListingsSub": "Check back soon for fresh listings from local farmers!"
  },
  "manageListings": {
    "title": "Manage Your Listings",
    "addFertilizer": "+ Add New Fertilizer",
    "cancel": "Cancel",
    "newListingTitle": "New Fertilizer Listing",
    "editListingTitle": "Edit Fertilizer Listing",
    "productName": "Product Name",
    "price": "Price (₹)",
    "description": "Description",
    "productImage": "Product Image",
    "updateListing": "Update Listing",
    "listProduct": "List Product",
    "edit": "Edit",
    "remove": "Remove",
    "noListings": "You have no active listings.",
    "noListingsSub": "Click '+ Add New Fertilizer' to create your first listing."
  },
  "languages": {
    "en-US": "English",
    "hi-IN": "Hindi",
    "te-IN": "Telugu",
    "ml-IN": "Malayalam"
  }
};
const hiTranslations = {
  "header": {
    "dashboard": "डैशबोर्ड",
    "cropAnalysis": "फसल विश्लेषण",
    "aiAssistant": "एआई सहायक",
    "yourMarketplace": "आपका बाज़ार",
    "fertilizerStore": "उर्वरक स्टोर",
    "browseProduce": "उत्पाद ब्राउज़ करें",
    "manageListings": "लिस्टिंग प्रबंधित करें",
    "logout": "लॉग आउट"
  },
  "auth": {
    "title": "हार्वेस्टहब",
    "subtitle": "आधुनिक खेती के लिए आपका ऑल-इन-वन प्लेटफॉर्म।",
    "welcomeBack": "वापसी पर स्वागत है!",
    "createAccount": "खाता बनाएं",
    "loginError": "लॉगिन त्रुटि",
    "signupError": "साइनअप त्रुटि",
    "googleAccountErrorPrompt": "Google से साइन इन करने के लिए यहां क्लिक करें",
    "emailLabel": "ईमेल पता",
    "passwordLabel": "पासवर्ड",
    "signIn": "साइन इन करें",
    "signUp": "साइन अप करें",
    "or": "या",
    "signInWithGoogle": "Google से साइन इन करें",
    "noAccount": "खाता नहीं है?",
    "haveAccount": "पहले से ही खाता है?",
    "emailPlaceholder": "आप@उदाहरण.com",
    "passwordPlaceholder": "••••••••",
    "emailRequired": "कृपया एक वैध ईमेल दर्ज करें।",
    "passwordRequired": "कृपया एक पासवर्ड दर्ज करें।",
    "unexpectedError": "एक अप्रत्याशित त्रुटि हुई।",
    "googleSignInError": "Google साइन इन के दौरान एक त्रुटि हुई।",
    "googleSignInPrompt": "Google साइन-इन का अनुकरण करने के लिए, कृपया अपना ईमेल पता दर्ज करें:",
    "selectLanguage": "भाषा चुनें"
  },
  "verifyEmail": {
    "title": "अपना इनबॉक्स जांचें",
    "instruction": "हमने {email} पर एक सत्यापन लिंक भेजा है। कृपया अपना खाता सक्रिय करने के लिए लिंक पर क्लिक करें।",
    "simulationNote": "(यह डेमो उद्देश्यों के लिए एक सिमुलेशन है)",
    "button": "सत्यापन सिमुलेट करें और साइन इन करें",
    "verifying": "सत्यापित हो रहा है...",
    "backToSignIn": "← साइन इन पर वापस जाएं"
  },
  "roleSelection": {
    "welcome": "हार्वेस्टहब में आपका स्वागत है",
    "prompt": "आधुनिक खेती के लिए आपका ऑल-इन-वन प्लेटफॉर्म। कृपया आरंभ करने के लिए अपनी भूमिका चुनें।",
    "farmer": "किसान",
    "farmerDesc": "फसल स्वास्थ्य का विश्लेषण करें, एआई सलाह लें, और अपनी उपज बेचें।",
    "buyer": "खरीदार",
    "buyerDesc": "स्थानीय किसानों से सीधे ताजा उत्पाद ब्राउज़ करें और खरीदें।",
    "seller": "उर्वरक विक्रेता",
    "sellerDesc": "अपने उत्पादों को सूचीबद्ध करें और जरूरतमंद किसानों से जुड़ें।"
  },
  "bottomNav": {
    "dashboard": "डैशबोर्ड",
    "analyze": "विश्लेषण",
    "assistant": "सहायक",
    "sell": "बेचें",
    "buy": "खरीदें",
    "browse": "ब्राउज़",
    "listings": "लिस्टिंग"
  },
  "dashboard": {
    "title": "किसान का डैशबोर्ड",
    "weatherTitle": "स्थानीय मौसम (मॉक डेटा)",
    "weatherCondition": "धूप के साथ बिखरे हुए बादल",
    "humidity": "आर्द्रता: {value}%",
    "weatherTip": "सुझाव: रोपण के लिए अच्छा मौसम। उच्च तापमान के कारण पर्याप्त सिंचाई सुनिश्चित करें।",
    "weatherDisclaimer": "*एक वास्तविक ऐप में, यह डेटा मौसम एपीआई से लाइव होगा।",
    "historyTitle": "फसल स्वास्थ्य इतिहास",
    "noHistory": "अभी तक कोई फसल विश्लेषण नहीं किया गया है।",
    "noHistorySub": "आरंभ करने के लिए 'फसल विश्लेषण' टैब का उपयोग करें।"
  },
  "cropAnalysis": {
    "title": "फसल स्वास्थ्य विश्लेषण",
    "uploadTitle": "1. फसल की एक छवि अपलोड करें",
    "uploadPrompt": "फोटो अपलोड करने या लेने के लिए नीचे क्लिक करें",
    "selectImage": "छवि चुनें",
    "analyzeCrop": "फसल का विश्लेषण करें",
    "analyzing": "विश्लेषण हो रहा है...",
    "resultsTitle": "2. एआई विश्लेषण और सिफारिशें",
    "aiAnalyzing": "एआई आपकी फसल का विश्लेषण कर रहा है...",
    "resultsPlaceholder": "विश्लेषण के परिणाम यहां दिखाई देंगे।",
    "diagnosis": "निदान",
    "description": "विवरण",
    "remedy": "अनुशंसित उपाय",
    "healthyPlant": "स्वस्थ पौधा",
    "confidence": "आत्मविश्वास: {value}",
    "findFertilizers": "अनुशंसित उर्वरक खोजें",
    "accuracy": "सटीकता स्तर",
    "modalTitle": "उर्वरक सिफारिशें",
    "modalDesc": "{disease} का पता लगने के आधार पर, यहां कुछ उत्पाद दिए गए हैं जो मदद कर सकते हैं। आप उन्हें स्टोर में हमारे विश्वसनीय विक्रेताओं से खरीद सकते हैं।",
    "recommendation1Title": "नाइट्रोजन युक्त ग्रोथ बूस्टर",
    "recommendation1Desc": "पीली पत्तियों में मदद करता है और जोरदार विकास को बढ़ावा देता है।",
    "recommendation2Title": "कवकनाशी शील्ड",
    "recommendation2Desc": "ब्लाइट और फफूंदी जैसे सामान्य फंगल संक्रमणों के खिलाफ प्रभावी।",
    "close": "बंद करें",
    "goToStore": "उर्वरक स्टोर पर जाएं"
  },
  "voiceAssistant": {
    "language": "भाषा:",
    "placeholder": "खेती के बारे में पूछें...",
    "send": "भेजें",
    "unsupported": "आपके ब्राउज़र में वाक् पहचान/संश्लेषण समर्थित नहीं है।",
    "errorResponse": "क्षमा करें, मुझे कोई प्रतिक्रिया नहीं मिल सकी। कृपया पुनः प्रयास करें।"
  },
  "marketplace": {
    "title": "आपका बाज़ार",
    "addProduct": "+ नया उत्पाद जोड़ें",
    "cancel": "रद्द करें",
    "newListingTitle": "नई उत्पाद लिस्टिंग",
    "editListingTitle": "उत्पाद लिस्टिंग संपादित करें",
    "productName": "उत्पाद का नाम",
    "quantity": "मात्रा (जैसे, 1 किलो, 1 दर्जन)",
    "price": "कीमत (₹)",
    "description": "विवरण",
    "generateWithAI": "✨ एआई के साथ उत्पन्न करें",
    "generating": "उत्पन्न हो रहा है...",
    "productImage": "उत्पाद की छवि",
    "updateProduct": "उत्पाद अपडेट करें",
    "listProduct": "उत्पाद सूचीबद्ध करें",
    "edit": "संपादित करें",
    "noListings": "आपने अभी तक कोई उत्पाद सूचीबद्ध नहीं किया है।",
    "noListingsSub": "बिक्री शुरू करने के लिए '+ नया उत्पाद जोड़ें' पर क्लिक करें।"
  },
  "fertilizerStore": {
    "title": "उर्वरक खरीदें",
    "buyNow": "अभी खरीदें",
    "noListings": "अभी बिक्री के लिए कोई उर्वरक सूचीबद्ध नहीं है।",
    "noListingsSub": "कृपया बाद में फिर से जांचें।"
  },
  "browseProduce": {
    "title": "ताजा उत्पाद ब्राउज़ करें",
    "searchPlaceholder": "उत्पादों के लिए खोजें...",
    "addToCart": "कार्ट में जोड़ें",
    "noListings": "अभी कोई उत्पाद उपलब्ध नहीं है।",
    "noListingsSub": "स्थानीय किसानों से ताजा लिस्टिंग के लिए जल्द ही वापस जांचें!"
  },
  "manageListings": {
    "title": "अपनी लिस्टिंग प्रबंधित करें",
    "addFertilizer": "+ नया उर्वरक जोड़ें",
    "cancel": "रद्द करें",
    "newListingTitle": "नई उर्वरक लिस्टिंग",
    "editListingTitle": "उर्वरक लिस्टिंग संपादित करें",
    "productName": "उत्पाद का नाम",
    "price": "कीमत (₹)",
    "description": "विवरण",
    "productImage": "उत्पाद की छवि",
    "updateListing": "लिस्टिंग अपडेट करें",
    "listProduct": "उत्पाद सूचीबद्ध करें",
    "edit": "संपादित करें",
    "remove": "हटाएं",
    "noListings": "आपकी कोई सक्रिय लिस्टिंग नहीं है।",
    "noListingsSub": "अपनी पहली लिस्टिंग बनाने के लिए '+ नया उर्वरक जोड़ें' पर क्लिक करें।"
  },
  "languages": {
    "en-US": "अंग्रेज़ी",
    "hi-IN": "हिंदी",
    "te-IN": "तेलुगू",
    "ml-IN": "मलयालम"
  }
};
const teTranslations = {
  "header": {
    "dashboard": "డాష్‌బోర్డ్",
    "cropAnalysis": "పంట విశ్లేషణ",
    "aiAssistant": "AI సహాయకుడు",
    "yourMarketplace": "మీ మార్కెట్‌ప్లేస్",
    "fertilizerStore": "ఎరువుల దుకాణం",
    "browseProduce": "ఉత్పత్తులను బ్రౌజ్ చేయండి",
    "manageListings": "లిస్టింగ్‌లను నిర్వహించండి",
    "logout": "లాగ్ అవుట్"
  },
  "auth": {
    "title": "హార్వెస్ట్‌హబ్",
    "subtitle": "ఆధునిక వ్యవసాయం కోసం మీ ఆల్-ఇన్-వెస్ట్ ప్లాట్‌ఫారమ్.",
    "welcomeBack": "తిరిగి స్వాగతం!",
    "createAccount": "ఖాతా సృష్టించండి",
    "loginError": "లాగిన్ లోపం",
    "signupError": "సైన్అప్ లోపం",
    "googleAccountErrorPrompt": "Googleతో సైన్ ఇన్ చేయడానికి ఇక్కడ క్లిక్ చేయండి",
    "emailLabel": "ఇమెయిల్ చిరునామా",
    "passwordLabel": "పాస్‌వర్డ్",
    "signIn": "సైన్ ఇన్ చేయండి",
    "signUp": "సైన్ అప్ చేయండి",
    "or": "లేదా",
    "signInWithGoogle": "Googleతో సైన్ ఇన్ చేయండి",
    "noAccount": "ఖాతా లేదా?",
    "haveAccount": "ఇప్పటికే ఖాతా ఉందా?",
    "emailPlaceholder": "మీరు@ఉదాహరణ.com",
    "passwordPlaceholder": "••••••••",
    "emailRequired": "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్‌ను నమోదు చేయండి.",
    "passwordRequired": "దయచేసి పాస్‌వర్డ్‌ను నమోదు చేయండి.",
    "unexpectedError": "ఊహించని లోపం సంభవించింది.",
    "googleSignInError": "Google సైన్ ఇన్ సమయంలో లోపం సంభవించింది.",
    "googleSignInPrompt": "Google సైన్-ఇన్‌ను అనుకరించడానికి, దయచేసి మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి:",
    "selectLanguage": "భాషను ఎంచుకోండి"
  },
  "verifyEmail": {
    "title": "మీ ఇన్‌బాక్స్‌ను తనిఖీ చేయండి",
    "instruction": "మేము {email}కు ఒక ధృవీకరణ లింక్‌ను పంపాము. దయచేసి మీ ఖాతాను సక్రియం చేయడానికి లింక్‌పై క్లిక్ చేయండి.",
    "simulationNote": "(ఇది డెమో ప్రయోజనాల కోసం ఒక అనుకరణ)",
    "button": "ధృవీకరణను అనుకరించండి & సైన్ ఇన్ చేయండి",
    "verifying": "ధృవీకరిస్తోంది...",
    "backToSignIn": "← సైన్ ఇన్‌కు తిరిగి వెళ్ళు"
  },
  "roleSelection": {
    "welcome": "హార్వెస్ట్‌హబ్‌కు స్వాగతం",
    "prompt": "ఆధునిక వ్యవసాయం కోసం మీ ఆల్-ఇన్-వెస్ట్ ప్లాట్‌ఫారమ్. దయచేసి ప్రారంభించడానికి మీ పాత్రను ఎంచుకోండి.",
    "farmer": "రైతు",
    "farmerDesc": "పంట ఆరోగ్యాన్ని విశ్లేషించండి, AI సలహా పొందండి మరియు మీ ఉత్పత్తులను అమ్మండి.",
    "buyer": "కొనుగోలుదారు",
    "buyerDesc": "స్థానిక రైతుల నుండి నేరుగా తాజా ఉత్పత్తులను బ్రౌజ్ చేయండి మరియు కొనండి.",
    "seller": "ఎరువుల విక్రేత",
    "sellerDesc": "మీ ఉత్పత్తులను జాబితా చేయండి మరియు అవసరమైన రైతులతో కనెక్ట్ అవ్వండి."
  },
  "bottomNav": {
    "dashboard": "డాష్‌బోర్డ్",
    "analyze": "విశ్లేషించండి",
    "assistant": "సహాయకుడు",
    "sell": "అమ్మండి",
    "buy": "కొనండి",
    "browse": "బ్రౌజ్",
    "listings": "లిస్టింగ్‌లు"
  },
  "dashboard": {
    "title": "రైతు డాష్‌బోర్డ్",
    "weatherTitle": "స్థానిక వాతావరణం (మాక్ డేటా)",
    "weatherCondition": "చెల్లాచెదురుగా ఉన్న మేఘాలతో ఎండ",
    "humidity": "తేమ: {value}%",
    "weatherTip": "చిట్కా: నాటడానికి మంచి వాతావరణం. అధిక ఉష్ణోగ్రతల కారణంగా తగినంత నీటిపారుదలని నిర్ధారించుకోండి.",
    "weatherDisclaimer": "*ఒక నిజమైన యాప్‌లో, ఈ డేటా వాతావరణ API నుండి ప్రత్యక్షంగా ఉంటుంది.",
    "historyTitle": "పంట ఆరోగ్య చరిత్ర",
    "noHistory": "ఇంకా పంట విశ్లేషణలు చేయలేదు.",
    "noHistorySub": "ప్రారంభించడానికి 'పంట విశ్లేషణ' ట్యాబ్‌ను ఉపయోగించండి."
  },
  "cropAnalysis": {
    "title": "పంట ఆరోగ్య విశ్లేషణ",
    "uploadTitle": "1. పంట చిత్రాన్ని అప్‌లోడ్ చేయండి",
    "uploadPrompt": "ఫోటోను అప్‌లోడ్ చేయడానికి లేదా తీయడానికి క్రింద క్లిక్ చేయండి",
    "selectImage": "చిత్రాన్ని ఎంచుకోండి",
    "analyzeCrop": "పంటను విశ్లేషించండి",
    "analyzing": "విశ్లేషిస్తోంది...",
    "resultsTitle": "2. AI విశ్లేషణ & సిఫార్సులు",
    "aiAnalyzing": "AI మీ పంటను విశ్లేషిస్తోంది...",
    "resultsPlaceholder": "విశ్లేషణ ఫలితాలు ఇక్కడ కనిపిస్తాయి.",
    "diagnosis": "రోగ నిర్ధారణ",
    "description": "వివరణ",
    "remedy": "సిఫార్సు చేయబడిన పరిహారం",
    "healthyPlant": "ఆరోగ్యకరమైన మొక్క",
    "confidence": "విశ్వాసం: {value}",
    "findFertilizers": "సిఫార్సు చేయబడిన ఎరువులను కనుగొనండి",
    "accuracy": "ఖచ్చితత్వ స్థాయి",
    "modalTitle": "ఎరువుల సిఫార్సులు",
    "modalDesc": "{disease}ను గుర్తించడం ఆధారంగా, ఇక్కడ సహాయపడగల కొన్ని ఉత్పత్తులు ఉన్నాయి. మీరు వాటిని దుకాణంలోని మా విశ్వసనీయ విక్రేతల నుండి కొనుగోలు చేయవచ్చు.",
    "recommendation1Title": "నత్రజని అధికంగా ఉండే గ్రోత్ బూస్టర్",
    "recommendation1Desc": "పసుపు ఆకులతో సహాయపడుతుంది మరియు శక్తివంతమైన పెరుగుదలను ప్రోత్సహిస్తుంది.",
    "recommendation2Title": "శిలీంద్ర సంహారిణి షీల్డ్",
    "recommendation2Desc": "బ్లైట్ మరియు బూజు వంటి సాధారణ ఫంగల్ ఇన్ఫెక్షన్లకు వ్యతిరేకంగా ప్రభావవంతంగా ఉంటుంది.",
    "close": "మూసివేయండి",
    "goToStore": "ఎరువుల దుకాణానికి వెళ్లండి"
  },
  "voiceAssistant": {
    "language": "భాష:",
    "placeholder": "వ్యవసాయం గురించి అడగండి...",
    "send": "పంపండి",
    "unsupported": "మీ బ్రౌజర్‌లో ప్రసంగ గుర్తింపు/సంశ్లేషణకు మద్దతు లేదు.",
    "errorResponse": "క్షమించండి, నేను ప్రతిస్పందనను పొందలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి."
  },
  "marketplace": {
    "title": "మీ మార్కెట్‌ప్లేస్",
    "addProduct": "+ కొత్త ఉత్పత్తిని జోడించండి",
    "cancel": "రద్దు చేయండి",
    "newListingTitle": "కొత్త ఉత్పత్తి జాబితా",
    "editListingTitle": "ఉత్పత్తి జాబితాను సవరించండి",
    "productName": "ఉత్పత్తి పేరు",
    "quantity": "పరిమాణం (ఉదా., 1కిలో, 1 డజను)",
    "price": "ధర (₹)",
    "description": "వివరణ",
    "generateWithAI": "✨ AIతో రూపొందించండి",
    "generating": "రూపొందిస్తోంది...",
    "productImage": "ఉత్పత్తి చిత్రం",
    "updateProduct": "ఉత్పత్తిని నవీకరించండి",
    "listProduct": "ఉత్పత్తిని జాబితా చేయండి",
    "edit": "సవరించండి",
    "noListings": "మీరు ఇంకా ఏ ఉత్పత్తులను జాబితా చేయలేదు.",
    "noListingsSub": "అమ్మకం ప్రారంభించడానికి '+ కొత్త ఉత్పత్తిని జోడించండి' క్లిక్ చేయండి."
  },
  "fertilizerStore": {
    "title": "ఎరువులు కొనండి",
    "buyNow": "ఇప్పుడే కొనండి",
    "noListings": "ప్రస్తుతం అమ్మకానికి ఎరువులు ఏవీ జాబితా చేయబడలేదు.",
    "noListingsSub": "దయచేసి తర్వాత మళ్లీ తనిఖీ చేయండి."
  },
  "browseProduce": {
    "title": "తాజా ఉత్పత్తులను బ్రౌజ్ చేయండి",
    "searchPlaceholder": "ఉత్పత్తుల కోసం శోధించండి...",
    "addToCart": "కార్ట్‌లో చేర్చు",
    "noListings": "ప్రస్తుతం ఉత్పత్తి అందుబాటులో లేదు.",
    "noListingsSub": "స్థానిక రైతుల నుండి తాజా జాబితాల కోసం త్వరలో తిరిగి తనిఖీ చేయండి!"
  },
  "manageListings": {
    "title": "మీ జాబితాలను నిర్వహించండి",
    "addFertilizer": "+ కొత్త ఎరువును జోడించండి",
    "cancel": "రద్దు చేయండి",
    "newListingTitle": "కొత్త ఎరువుల జాబితా",
    "editListingTitle": "ఎరువుల జాబితాను సవరించండి",
    "productName": "ఉత్పత్తి పేరు",
    "price": "ధర (₹)",
    "description": "వివరణ",
    "productImage": "ఉత్పత్తి చిత్రం",
    "updateListing": "జాబితాను నవీకరించండి",
    "listProduct": "ఉత్పత్తిని జాబితా చేయండి",
    "edit": "సవరించండి",
    "remove": "తొలగించండి",
    "noListings": "మీకు క్రియాశీల జాబితాలు ఏవీ లేవు.",
    "noListingsSub": "మీ మొదటి జాబితాను సృష్టించడానికి '+ కొత్త ఎరువును జోడించండి' క్లిక్ చేయండి."
  },
  "languages": {
    "en-US": "ఆంగ్ల",
    "hi-IN": "హిందీ",
    "te-IN": "తెలుగు",
    "ml-IN": "మలయాళం"
  }
};

const mlTranslations = {
  "header": {
    "dashboard": "ഡാഷ്ബോർഡ്",
    "cropAnalysis": "വിള വിശകലനം",
    "aiAssistant": "AI അസിസ്റ്റന്റ്",
    "yourMarketplace": "നിങ്ങളുടെ മാർക്കറ്റ്പ്ലേസ്",
    "fertilizerStore": "വളം സ്റ്റോർ",
    "browseProduce": "ഉൽപ്പന്നങ്ങൾ ബ്രൗസ് ചെയ്യുക",
    "manageListings": "ലിസ്റ്റിംഗുകൾ നിയന്ത്രിക്കുക",
    "logout": "ലോഗൗട്ട്"
  },
  "auth": {
    "title": "ഹാർവെസ്റ്റ്ഹബ്",
    "subtitle": "ആധുനിക കൃഷിക്കായുള്ള നിങ്ങളുടെ ഓൾ-ഇൻ-വൺ പ്ലാറ്റ്ഫോം.",
    "welcomeBack": "വീണ്ടും സ്വാഗതം!",
    "createAccount": "അക്കൗണ്ട് ഉണ്ടാക്കുക",
    "loginError": "ലോഗിൻ പിശക്",
    "signupError": "സൈൻഅപ്പ് പിശക്",
    "googleAccountErrorPrompt": "Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
    "emailLabel": "ഇമെയിൽ വിലാസം",
    "passwordLabel": "പാസ്‌വേഡ്",
    "signIn": "സൈൻ ഇൻ ചെയ്യുക",
    "signUp": "സൈൻ അപ്പ് ചെയ്യുക",
    "or": "അല്ലെങ്കിൽ",
    "signInWithGoogle": "Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക",
    "noAccount": "അക്കൗണ്ട് ഇല്ലേ?",
    "haveAccount": "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    "emailPlaceholder": "നിങ്ങൾ@ഉദാഹരണം.com",
    "passwordPlaceholder": "••••••••",
    "emailRequired": "ദയവായി സാധുവായ ഇമെയിൽ നൽകുക.",
    "passwordRequired": "ദയവായി പാസ്‌വേഡ് നൽകുക.",
    "unexpectedError": "അപ്രതീക്ഷിതമായ പിശക് സംഭവിച്ചു.",
    "googleSignInError": "Google സൈൻ ഇൻ സമയത്ത് പിശക് സംഭവിച്ചു.",
    "googleSignInPrompt": "Google സൈൻ-ഇൻ അനുകരിക്കാൻ, ദയവായി നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക:",
    "selectLanguage": "ഭാഷ തിരഞ്ഞെടുക്കുക"
  },
  "verifyEmail": {
    "title": "നിങ്ങളുടെ ഇൻബോക്സ് പരിശോധിക്കുക",
    "instruction": "ഞങ്ങൾ {email} എന്നതിലേക്ക് ഒരു സ്ഥിരീകരണ ലിങ്ക് അയച്ചിട്ടുണ്ട്. നിങ്ങളുടെ അക്കൗണ്ട് സജീവമാക്കാൻ ദയവായി ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക.",
    "simulationNote": "(ഇതൊരു ഡെമോ ആവശ്യത്തിനുള്ള സിമുലേഷനാണ്)",
    "button": "സ്ഥിരീകരണം അനുകരിച്ച് സൈൻ ഇൻ ചെയ്യുക",
    "verifying": "പരിശോധിക്കുന്നു...",
    "backToSignIn": "← സൈൻ ഇന്നിലേക്ക് മടങ്ങുക"
  },
  "roleSelection": {
    "welcome": "ഹാർവെസ്റ്റ്ഹബിലേക്ക് സ്വാഗതം",
    "prompt": "ആധുനിക കൃഷിക്കായുള്ള നിങ്ങളുടെ ഓൾ-ഇൻ-വൺ പ്ലാറ്റ്ഫോം. ആരംഭിക്കുന്നതിന് ദയവായി നിങ്ങളുടെ പങ്ക് തിരഞ്ഞെടുക്കുക.",
    "farmer": "കർഷകൻ",
    "farmerDesc": "വിള ആരോഗ്യം വിശകലനം ചെയ്യുക, AI ഉപദേശം നേടുക, നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ വിൽക്കുക.",
    "buyer": "വാങ്ങുന്നയാൾ",
    "buyerDesc": "പ്രാദേശിക കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ ഉൽപ്പന്നങ്ങൾ ബ്രൗസ് ചെയ്ത് വാങ്ങുക.",
    "seller": "വളം വിൽപ്പനക്കാരൻ",
    "sellerDesc": "നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ ലിസ്റ്റ് ചെയ്യുകയും ആവശ്യമുള്ള കർഷകരുമായി ബന്ധപ്പെടുകയും ചെയ്യുക."
  },
  "bottomNav": {
    "dashboard": "ഡാഷ്ബോർഡ്",
    "analyze": "വിശകലനം",
    "assistant": "അസിസ്റ്റന്റ്",
    "sell": "വിൽക്കുക",
    "buy": "വാങ്ങുക",
    "browse": "ബ്രൗസ്",
    "listings": "ലിസ്റ്റിംഗുകൾ"
  },
  "dashboard": {
    "title": "കർഷകന്റെ ഡാഷ്‌ബോർഡ്",
    "weatherTitle": "പ്രാദേശിക കാലാവസ്ഥ (മോക്ക് ഡാറ്റ)",
    "weatherCondition": "ചിതറിയ മേഘങ്ങളുള്ള സൂര്യപ്രകാശം",
    "humidity": "ഈർപ്പം: {value}%",
    "weatherTip": "നുറുങ്ങ്: നടീലിന് നല്ല കാലാവസ്ഥ. ഉയർന്ന താപനില കാരണം ആവശ്യത്തിന് ജലസേചനം ഉറപ്പാക്കുക.",
    "weatherDisclaimer": "*ഒരു യഥാർത്ഥ ആപ്പിൽ, ഈ ഡാറ്റ ഒരു കാലാവസ്ഥാ API-ൽ നിന്ന് തത്സമയം ലഭിക്കും.",
    "historyTitle": "വിള ആരോഗ്യ ചരിത്രം",
    "noHistory": "ഇതുവരെ വിള വിശകലനങ്ങൾ നടത്തിയിട്ടില്ല.",
    "noHistorySub": "ആരംഭിക്കുന്നതിന് 'വിള വിശകലനം' ടാബ് ഉപയോഗിക്കുക."
  },
  "cropAnalysis": {
    "title": "വിള ആരോഗ്യ വിശകലനം",
    "uploadTitle": "1. ഒരു വിളയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    "uploadPrompt": "ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യാനോ എടുക്കാനോ താഴെ ക്ലിക്ക് ചെയ്യുക",
    "selectImage": "ചിത്രം തിരഞ്ഞെടുക്കുക",
    "analyzeCrop": "വിള വിശകലനം ചെയ്യുക",
    "analyzing": "വിശകലനം ചെയ്യുന്നു...",
    "resultsTitle": "2. AI വിശകലനവും ശുപാർശകളും",
    "aiAnalyzing": "AI നിങ്ങളുടെ വിളയെ വിശകലനം ചെയ്യുന്നു...",
    "resultsPlaceholder": "വിശകലന ഫലങ്ങൾ ഇവിടെ ദൃശ്യമാകും.",
    "diagnosis": "രോഗനിർണയം",
    "description": "വിവരണം",
    "remedy": "ശുപാർശ ചെയ്യുന്ന പ്രതിവിധി",
    "healthyPlant": "ആരോഗ്യമുള്ള ചെടി",
    "confidence": "ആത്മവിശ്വാസം: {value}",
    "findFertilizers": "ശുപാർശ ചെയ്യുന്ന വളങ്ങൾ കണ്ടെത്തുക",
    "accuracy": "കൃത്യത നില",
    "modalTitle": "വളം ശുപാർശകൾ",
    "modalDesc": "{disease} കണ്ടെത്തിയതിനെ അടിസ്ഥാനമാക്കി, സഹായിച്ചേക്കാവുന്ന ചില ഉൽപ്പന്നങ്ങൾ ഇതാ. ഞങ്ങളുടെ വിശ്വസ്തരായ വിൽപ്പനക്കാരിൽ നിന്ന് നിങ്ങൾക്ക് അവ സ്റ്റോറിൽ നിന്ന് വാങ്ങാം.",
    "recommendation1Title": "നൈട്രജൻ അടങ്ങിയ വളർച്ചാ ബൂസ്റ്റർ",
    "recommendation1Desc": "മഞ്ഞ ഇലകളെ സഹായിക്കുകയും ഊർജ്ജസ്വലമായ വളർച്ചയെ പ്രോത്സാഹിപ്പിക്കുകയും ചെയ്യുന്നു.",
    "recommendation2Title": "കുമിൾനാശിനി ഷീൽഡ്",
    "recommendation2Desc": "ചീയൽ, പൂപ്പൽ പോലുള്ള സാധാരണ ഫംഗസ് അണുബാധകൾക്കെതിരെ ഫലപ്രദമാണ്.",
    "close": "അടയ്ക്കുക",
    "goToStore": "വളം സ്റ്റോറിലേക്ക് പോകുക"
  },
  "voiceAssistant": {
    "language": "ഭാഷ:",
    "placeholder": "കൃഷിയെക്കുറിച്ച് ചോദിക്കുക...",
    "send": "അയയ്ക്കുക",
    "unsupported": "നിങ്ങളുടെ ബ്രൗസറിൽ സംഭാഷണ തിരിച്ചറിയൽ/സിന്തസിസ് പിന്തുണയ്ക്കുന്നില്ല.",
    "errorResponse": "ക്ഷമിക്കണം, എനിക്ക് ഒരു പ്രതികരണം ലഭിച്ചില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക."
  },
  "marketplace": {
    "title": "നിങ്ങളുടെ മാർക്കറ്റ്പ്ലേസ്",
    "addProduct": "+ പുതിയ ഉൽപ്പന്നം ചേർക്കുക",
    "cancel": "റദ്ദാക്കുക",
    "newListingTitle": "പുതിയ ഉൽപ്പന്ന ലിസ്റ്റിംഗ്",
    "editListingTitle": "ഉൽപ്പന്ന ലിസ്റ്റിംഗ് എഡിറ്റ് ചെയ്യുക",
    "productName": "ഉൽപ്പന്നത്തിന്റെ പേര്",
    "quantity": "അളവ് (ഉദാ., 1 കിലോ, 1 ഡസൻ)",
    "price": "വില (₹)",
    "description": "വിവരണം",
    "generateWithAI": "✨ AI ഉപയോഗിച്ച് സൃഷ്ടിക്കുക",
    "generating": "സൃഷ്ടിക്കുന്നു...",
    "productImage": "ഉൽപ്പന്നത്തിന്റെ ചിത്രം",
    "updateProduct": "ഉൽപ്പന്നം അപ്ഡേറ്റ് ചെയ്യുക",
    "listProduct": "ഉൽപ്പന്നം ലിസ്റ്റ് ചെയ്യുക",
    "edit": "എഡിറ്റ് ചെയ്യുക",
    "noListings": "നിങ്ങൾ ഇതുവരെ ഉൽപ്പന്നങ്ങളൊന്നും ലിസ്റ്റ് ചെയ്തിട്ടില്ല.",
    "noListingsSub": "വിൽപ്പന ആരംഭിക്കാൻ '+ പുതിയ ഉൽപ്പന്നം ചേർക്കുക' ക്ലിക്ക് ചെയ്യുക."
  },
  "fertilizerStore": {
    "title": "വളങ്ങൾ വാങ്ങുക",
    "buyNow": "ഇപ്പോൾ വാങ്ങുക",
    "noListings": "ഇപ്പോൾ വിൽപ്പനയ്ക്ക് വളങ്ങളൊന്നും ലിസ്റ്റ് ചെയ്തിട്ടില്ല.",
    "noListingsSub": "ദയവായി പിന്നീട് വീണ്ടും പരിശോധിക്കുക."
  },
  "browseProduce": {
    "title": "പുതിയ ഉൽപ്പന്നങ്ങൾ ബ്രൗസ് ചെയ്യുക",
    "searchPlaceholder": "ഉൽപ്പന്നങ്ങൾക്കായി തിരയുക...",
    "addToCart": "കാർട്ടിലേക്ക് ചേർക്കുക",
    "noListings": "ഇപ്പോൾ ഉൽപ്പന്നങ്ങളൊന്നും ലഭ്യമല്ല.",
    "noListingsSub": "പ്രാദേശിക കർഷകരിൽ നിന്നുള്ള പുതിയ ലിസ്റ്റിംഗുകൾക്കായി ഉടൻ വീണ്ടും പരിശോധിക്കുക!"
  },
  "manageListings": {
    "title": "നിങ്ങളുടെ ലിസ്റ്റിംഗുകൾ നിയന്ത്രിക്കുക",
    "addFertilizer": "+ പുതിയ വളം ചേർക്കുക",
    "cancel": "റദ്ദാക്കുക",
    "newListingTitle": "പുതിയ വളം ലിസ്റ്റിംഗ്",
    "editListingTitle": "വളം ലിസ്റ്റിംഗ് എഡിറ്റ് ചെയ്യുക",
    "productName": "ഉൽപ്പന്നത്തിന്റെ പേര്",
    "price": "വില (₹)",
    "description": "വിവരണം",
    "productImage": "ഉൽപ്പന്നത്തിന്റെ ചിത്രം",
    "updateListing": "ലിസ്റ്റിംഗ് അപ്ഡേറ്റ് ചെയ്യുക",
    "listProduct": "ഉൽപ്പന്നം ലിസ്റ്റ് ചെയ്യുക",
    "edit": "എഡിറ്റ് ചെയ്യുക",
    "remove": "നീക്കം ചെയ്യുക",
    "noListings": "നിങ്ങൾക്ക് സജീവമായ ലിസ്റ്റിംഗുകളൊന്നുമില്ല.",
    "noListingsSub": "നിങ്ങളുടെ ആദ്യ ലിസ്റ്റിംഗ് സൃഷ്ടിക്കാൻ '+ പുതിയ വളം ചേർക്കുക' ക്ലിക്ക് ചെയ്യുക."
  },
  "languages": {
    "en-US": "ഇംഗ്ലീഷ്",
    "hi-IN": "ഹിന്ദി",
    "te-IN": "തെലുങ്ക്",
    "ml-IN": "മലയാളം"
  }
};


const translationsMap: Record<string, Record<string, any>> = {
  [LanguageCode.ENGLISH]: enTranslations,
  [LanguageCode.HINDI]: hiTranslations,
  [LanguageCode.TELUGU]: teTranslations,
  [LanguageCode.MALAYALAM]: mlTranslations,
};


export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(LanguageCode.ENGLISH);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('user-language', lang);
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const translations = translationsMap[language] || translationsMap[LanguageCode.ENGLISH];
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    let translatedString = String(result);

    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translatedString = translatedString.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }

    return translatedString;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};