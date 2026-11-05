const normalizeBaseUrl = (value) => {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/+$/, "");
};

export const base_url = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

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
    stripeLink: "https://buy.stripe.com/4gMfZhbFf0lTb2g9s6awo00",
  },
  {
    id: "In Home Follow Up Physician Visit",
    name: "In Home Follow Up Physician Visit",
    priceUsd: 95,
    priceLabel: "$95 USD",
    stripeAmount: "47,500 CFA ($95.00 USD)",
    stripeLink: "https://buy.stripe.com/fZuaEX4cNd8Fees47Mawo02",
  },
  {
    id: "Virtual Physician Visit",
    name: "Virtual Physician Visit",
    priceUsd: 55,
    priceLabel: "$55 USD",
    stripeAmount: "27,500 CFA ($55.00 USD)",
    stripeLink: "https://buy.stripe.com/6oU7sLaBbb0x4DSdImawo03",
  },
  {
    id: "Nurse Wellness Check",
    name: "Nurse Wellness Check",
    priceUsd: 50,
    priceLabel: "$50 USD",
    stripeAmount: "25,000 CFA ($50.00 USD)",
    stripeLink: "https://buy.stripe.com/aFa14naBbc4BgmA0VAawo04",
  },
  {
    id: "Rehydration & IV Fluid Therapy",
    name: "Rehydration & IV Fluid Therapy",
    priceUsd: 60,
    priceLabel: "$60 USD",
    stripeAmount: "30,000 CFA ($60.00 USD)",
    stripeLink: "https://buy.stripe.com/cNi7sLfVv3y50nC0VAawo05",
  },
  {
    id: "Infusion Therapy for Prescribed Medications",
    name: "Infusion Therapy for Prescribed Medications",
    priceUsd: 90,
    priceLabel: "$90 USD",
    stripeAmount: "45,000 CFA ($90.00 USD)",
    stripeLink: "https://buy.stripe.com/5kQ28rdNn4C98U833Iawo06",
  },
  {
    id: "Care Management & Navigation",
    name: "Care Management & Navigation",
    priceUsd: 100,
    priceLabel: "$100/month USD",
    stripeAmount: "50,000 CFA ($100.00/month USD)",
    stripeLink: "https://buy.stripe.com/cNi5kDcJj6Khc6kcEiawo07",
  },
  {
    id: "Wellness Coaching",
    name: "Wellness Coaching",
    priceUsd: 75,
    priceLabel: "$75/session USD",
    stripeAmount: "37,500 CFA ($75.00/session USD)",
    stripeLink: "https://buy.stripe.com/3cI28r8t33y53zO5bQawo08",
  },
  {
    id: "Diabetes Coaching & Chronic Illness Management",
    name: "Diabetes Coaching & Chronic Illness Management",
    priceUsd: 115,
    priceLabel: "$115/session USD",
    stripeAmount: "57,500 CFA ($115.00/session USD)",
    stripeLink: "https://buy.stripe.com/6oU6oHeRrd8FgmA0VAawo09",
  },
  {
    id: "Live-in Family Wellness Nurse",
    name: "Live-in Family Wellness Nurse",
    priceUsd: 495,
    priceLabel: "$495/month USD",
    stripeAmount: "247,500 CFA ($495.00/month USD)",
    stripeLink: "https://buy.stripe.com/cNifZhfVv8Sp2vK6fUawo0a",
  },
];

export const getServiceStripeLink = (serviceNameOrId) => {
  if (!serviceNameOrId) return null;
  const clean = String(serviceNameOrId).toLowerCase().trim();
  const matched = REQUEST_SERVICES_LIST.find((s) => {
    const sName = s.name.toLowerCase().trim();
    return sName === clean || sName.includes(clean) || clean.includes(sName);
  });
  if (matched?.stripeLink) return matched.stripeLink;

  if (clean.includes("comprehensive") || clean.includes("intake"))
    return "https://buy.stripe.com/4gMfZhbFf0lTb2g9s6awo00";
  if (
    clean.includes("home") &&
    (clean.includes("visit") || clean.includes("follow"))
  )
    return "https://buy.stripe.com/fZuaEX4cNd8Fees47Mawo02";
  if (clean.includes("virtual"))
    return "https://buy.stripe.com/6oU7sLaBbb0x4DSdImawo03";
  if (clean.includes("nurse") && clean.includes("wellness"))
    return "https://buy.stripe.com/aFa14naBbc4BgmA0VAawo04";
  if (
    clean.includes("rehydration") ||
    clean.includes("fluid") ||
    clean.includes("iv")
  )
    return "https://buy.stripe.com/cNi7sLfVv3y50nC0VAawo05";
  if (clean.includes("infusion"))
    return "https://buy.stripe.com/5kQ28rdNn4C98U833Iawo06";
  if (clean.includes("navigation") || clean.includes("care management"))
    return "https://buy.stripe.com/cNi5kDcJj6Khc6kcEiawo07";
  if (clean.includes("wellness"))
    return "https://buy.stripe.com/3cI28r8t33y53zO5bQawo08";
  if (clean.includes("diabetes"))
    return "https://buy.stripe.com/6oU6oHeRrd8FgmA0VAawo09";
  if (clean.includes("live-in") || clean.includes("live in"))
    return "https://buy.stripe.com/cNifZhfVv8Sp2vK6fUawo0a";

  return null;
};
