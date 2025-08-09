export const HEADER = {
  title: "Complaint to Legal Taskforce",
  // Text extracted from screenshots; please adjust in this file if needed
  descriptionEn:
    "If you want, your identity will be kept confidential. You can send us your complaint and such request at ________.",
  descriptionHi:
    "बिहार में संविधान और लोकतंत्र की रक्षा के लिए एक कानूनी टास्कफोर्स का गठन किया गया है। यदि आपको चुनाव में कोई गड़बड़ी, प्रशासन की निष्क्रियता, मतदाताओं का उत्पीड़न, या किसी भी प्रकार की असंवैधानिक गतिविधि की जानकारी हो, तो कृपया नीचे दिए गए फॉर्म के माध्यम से हमें सूचित करें। आपकी जानकारी के आधार पर हमारी कानूनी टीम उचित कार्रवाई करेगी।",
};

export const COMPLAINT_TYPES = [
  "Booth Capturing / Rigging / बूथ कब्जा / गड़बड़ी",
  "Caste or Communal Targeting / जाति या सांप्रदायिक आधार पर हमला",
  "Police Inaction or Bias / पुलिस की निष्क्रियता या पक्षपात",
  "Threats to Voters / मतदाताओं को धमकी",
  "Voter ID Tampering or Deletion / मतदाता सूची से नाम हटाना या छेड़छाड़",
  "Counting Fraud or Manipulation / मतगणना में गड़बड़ी या हेरफेर",
  "Other Disruption during Polling / मतदान के दौरान व्यवधान",
  "Others / अन्य",
] as const;
