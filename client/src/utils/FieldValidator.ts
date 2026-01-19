export const validators = {
  entityName: (v: string) =>
    v.trim() ? "" : "Entity name is required",

  email: (v: string) =>
    !v.trim()
      ? "Email is required"
      : /^\S+@\S+\.\S+$/.test(v)
      ? ""
      : "Invalid email address",

  panNumber: (v: string) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v)
      ? ""
      : "Invalid PAN format",

  pin: (v: string) =>
    /^\d{6}$/.test(v) ? "" : "PIN must be 6 digits",

  phone: (v: string) =>
    /^[6-9]\d{9}$/.test(v)
      ? ""
      : "Invalid contact number",

  required: (v: string) =>
    v.trim() ? "" : "This field is required",
};
