export const base_url =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL;

// Determines whether a given user object should be treated as an admin.
// Special case: user with id 100 is always considered an admin regardless of role.
export const isAdminUser = (user) =>
  user?.user_role === "admin" || user?.id === 100;

export const REQUEST_SERVICES_LIST = [
  {
    id: "Comprehensive Physician Intake In Person",
    name: "Comprehensive Physician Intake In Person",
    priceUsd: 125,
    priceLabel: "$125 USD",
    stripeAmount: "62,500 CFA ($125.00 USD)",
  },
  {
    id: "In Home Follow Up Physician Visit",
    name: "In Home Follow Up Physician Visit",
    priceUsd: 95,
    priceLabel: "$95 USD",
    stripeAmount: "47,500 CFA ($95.00 USD)",
  },
  {
    id: "Virtual Physician Visit",
    name: "Virtual Physician Visit",
    priceUsd: 55,
    priceLabel: "$55 USD",
    stripeAmount: "27,500 CFA ($55.00 USD)",
  },
  {
    id: "Nurse Wellness Check",
    name: "Nurse Wellness Check",
    priceUsd: 50,
    priceLabel: "$50 USD",
    stripeAmount: "25,000 CFA ($50.00 USD)",
  },
  {
    id: "Rehydration & IV Fluid Therapy",
    name: "Rehydration & IV Fluid Therapy",
    priceUsd: 60,
    priceLabel: "$60 USD",
    stripeAmount: "30,000 CFA ($60.00 USD)",
  },
  {
    id: "Infusion Therapy for Prescribed Medications",
    name: "Infusion Therapy for Prescribed Medications",
    priceUsd: 90,
    priceLabel: "$90 USD",
    stripeAmount: "45,000 CFA ($90.00 USD)",
  },
  {
    id: "Care Management & Navigation",
    name: "Care Management & Navigation",
    priceUsd: 100,
    priceLabel: "$100/month USD",
    stripeAmount: "50,000 CFA ($100.00/month USD)",
  },
  {
    id: "Wellness Coaching",
    name: "Wellness Coaching",
    priceUsd: 75,
    priceLabel: "$75/session USD",
    stripeAmount: "37,500 CFA ($75.00/session USD)",
  },
  {
    id: "Diabetes Coaching & Chronic Illness Management",
    name: "Diabetes Coaching & Chronic Illness Management",
    priceUsd: 115,
    priceLabel: "$115/session USD",
    stripeAmount: "57,500 CFA ($115.00/session USD)",
  },
  {
    id: "Live-in Family Wellness Nurse",
    name: "Live-in Family Wellness Nurse",
    priceUsd: 495,
    priceLabel: "$495/month USD",
    stripeAmount: "247,500 CFA ($495.00/month USD)",
  },
];
