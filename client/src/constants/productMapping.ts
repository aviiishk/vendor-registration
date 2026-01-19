export const KEY_PRODUCTS = [
  { label: "Supplies (Goods)", value: "SUPPLIES" },
  { label: "Works (Projects/Construction)", value: "WORKS" },
  { label: "Services", value: "SERVICES" },
];

export const PRODUCT_MAPPING: Record<string, string[]> = {
  SUPPLIES: [
    "Office Supplies",
    "IT Equipment",
    "Industrial Supplies",
    "R&D Supplies",
    "Hospital Equipment",
    "Pharmacological Items",
    "Laboratory Items",
    "Marketing & Communication",
    "Specialized Goods",
  ],
  WORKS: [
    "Civil Works",
    "Mechanical & Electrical Works",
    "IT Infrastructure Works",
    "Facility Management Works",
    "Miscellaneous Works",
  ],
  SERVICES: [
    "Consultancy Services",
    "Professional Services",
    "IT & Communication Services",
    "Logistics & Transportation",
    "Manpower & Security Services",
    "Maintenance & Repair Services",
    "Financial Services",
    "Other Services",
    "Miscellaneous Services",
  ],
};
