export const contactEnquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "product-demo", label: "Product demonstration" },
  { value: "pricing", label: "Pricing enquiry" },
  { value: "sales", label: "Sales enquiry" },
  { value: "technical", label: "Technical enquiry" },
  { value: "other", label: "Other" },
] as const

/** Includes internal values used by demo and quote flows. */
export const enquiryTypes = [
  ...contactEnquiryTypes,
  { value: "demo", label: "Demo request" },
  { value: "quote", label: "Quotation request" },
] as const

export const studentCountRanges = [
  { value: "below-200", label: "Below 200" },
  { value: "200-500", label: "200–500" },
  { value: "501-1000", label: "501–1,000" },
  { value: "1001-2000", label: "1,001–2,000" },
  { value: "2001-5000", label: "2,001–5,000" },
  { value: "above-5000", label: "Above 5,000" },
] as const

export const contactMethods = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "either", label: "Either phone or email" },
] as const

export const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
] as const

export const contactSteps = [
  "Share your school details.",
  "Tell us about your requirements.",
  "Our team will contact you.",
] as const

export const demoSteps = [
  "Share your school and contact details.",
  "Tell us which modules you want to see.",
  "Our team will contact you to schedule a demonstration.",
] as const