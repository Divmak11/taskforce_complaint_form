export const HEADER = {
  title: "Legal Taskforce",
  descriptionEn:
    "This form is for reporting electoral irregularities and complaints. Please provide all necessary information so that we can take appropriate action on your complaint.",
  descriptionHi:
    "यह फॉर्म चुनावी अनियमितताओं और शिकायतों की रिपोर्ट करने के लिए है। कृपया सभी आवश्यक जानकारी प्रदान करें ताकि हम आपकी शिकायत पर उचित कार्रवाई कर सकें।",
};

// IMPORTANT: These string values must exactly match the values used as the
// radio input "value" in components/MultiStepForm.tsx. The UI renders
// localized labels, but the submitted value is one of these keys.
export const COMPLAINT_TYPES = [
  "Voter Bribery",
  "Booth Capturing",
  "Fake Voting",
  "EVM Damage",
  "Voter Intimidation",
  "Violation of Model Code of Conduct",
  "CCTV tampering",
  "Voter Deletion",
  "Other",
] as const;
