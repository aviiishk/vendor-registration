import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import TextInput from "../components/form/TextInput";
import CheckboxGroup from "../components/form/CheckboxGroup";
import FileUpload from "../utils/FileUpload";
import RadioGroup from "../components/form/RadioGroup";
import { DOCUMENTS } from "../constants/documents";
import TextArea from "../components/form/TextArea";
import { FaPaperPlane } from "react-icons/fa";
import Select from "../components/form/Select";
import MultiSelect from "../components/form/MultiSelect";
import { KEY_PRODUCTS, PRODUCT_MAPPING } from "../constants/productMapping";
import { registerVendor } from "../services/vendor";
import { validateVendorForm } from "../utils/ValidateVendorForm";
import { sanitizeVendorPayload } from "@/utils/sanitizeVendorPayload";

const VendorRegister = () => {
  /*DATA (matches backend JSON exactly) ---------- */
  const [formData, setFormData] = useState({
    category: [] as string[],

    entityName: "",
    email: "",
    website: "",

    registeredAddress: {
      address: "",
      pin: "",
      contactNumber: "",
    },

    communicationAddress: {
      sameAsRegistered: false,
      address: "",
      pin: "",
      contactNumber: "",
    },

    taxDetails: {
      panNumber: "",
      gstApplicable: false,
      gstNumber: "",
      gstRegistrationType: "",

      cinNumber: "",

      msmeApplicable: false,
      msmeNumber: "",
      msmeType: "",
      msmeClass: "",
    },

    businessDetails: {
      establishmentType: "",
      keyProducts: [] as string[],
      specificProducts: [] as string[],
      hasRelationWithAGIHF: false,
      relationDetails: "",
    },

    documentFlags: {
      hasAuthorizationCertificate: false,
      hasTradeLicense: false,
      hasItrYear1: false,
      hasItrYear2: false,
      hasPfRegistration: false,
      hasEsicRegistration: false,
      hasClraRegistration: false,
    },

    applicant: {
      applicantName: "",
      authorisedPerson: "",
    },
  });

  /* ---------- 2. FILES (only File objects) ---------- */
  const [files, setFiles] = useState<{
    PAN_CARD?: File;
    CANCELLED_CHEQUE?: File;
    DECLARATION_FORM?: File;

    GST_CERTIFICATE?: File;
    MSME_CERTIFICATE?: File;

    AUTHORIZATION_CERTIFICATE?: File;
    TRADE_LICENSE?: File;
    ITR_YEAR_1?: File;
    ITR_YEAR_2?: File;
    PF_REGISTRATION?: File;
    ESIC_REGISTRATION?: File;
    CLRA_REGISTRATION?: File;
  }>({});

  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const setError = (key: string, message: string) => {
    setFieldErrors((prev) => ({
      ...prev,
      [key]: message,
    }));
  };

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const REQUIRED_DOCS = DOCUMENTS.filter((d) => d.required);
  const OPTIONAL_DOCS = DOCUMENTS.filter((d) => d.flagKey);
  const uploadableDocs = DOCUMENTS.filter((doc) => {
    // 1️⃣ Always include required documents
    if (doc.required) return true;

    // 2️⃣ Handle ITR dependency
    if (doc.backendType === "ITR_YEAR_1") {
      return (
        formData.documentFlags.hasItrYear1 || formData.documentFlags.hasItrYear2
      );
    }

    if (doc.backendType === "ITR_YEAR_2") {
      return formData.documentFlags.hasItrYear2;
    }

    // 3️⃣ Normal optional documents
    return (
      doc.flagKey &&
      formData.documentFlags[doc.flagKey as keyof typeof formData.documentFlags]
    );
  });

  const specificOptions = formData.businessDetails.keyProducts.flatMap((k) =>
    PRODUCT_MAPPING[k as keyof typeof PRODUCT_MAPPING].map((label) => ({
      label,
      value: label,
    })),
  );

  const updateField = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const updateNestedField = <
    K extends keyof typeof formData,
    NK extends keyof (typeof formData)[K],
  >(
    key: K,
    nestedKey: NK,
    value: (typeof formData)[K][NK],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as object),
        [nestedKey]: value,
      },
    }));
  };

 const handleSubmit = async () => {
  const validationErrors = validateVendorForm(formData, files);

  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors([]);
  setLoading(true);

  try {
    // 🔥 SANITIZE PAYLOAD HERE
    const payload = sanitizeVendorPayload(formData);

    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));

    Object.entries(files).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    await registerVendor(fd);
    alert("Vendor registered successfully!");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black  text-blue-900">
          Vendor Registration Details
        </h1>

        <p className="mt-5 text-sm text-gray-500">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory.
        </p>

        <p className="mt-5 text-xs font-semibold text-red-500">
          For any clarification please write to{" "}
          <span className="font-medium">procurement@agihf.org</span>
        </p>

        <div className="h-px w-full bg-blue-100 mt-6" />
      </div>

      {/* MAIN FORM */}
      <div className="space-y-8">
        <CheckboxGroup
          label="Category"
          required
          values={formData.category}
          options={[
            { label: "Trader", value: "trader" },
            { label: "Manufacturer", value: "manufacturer" },
            { label: "Authorised Dealer", value: "authorised_dealer" },
            { label: "Service Provider", value: "service_provider" },
          ]}
          onChange={(v) => updateField("category", v)}
        />

        <TextInput
          label="Name of the Entity"
          placeholder="Enter Name of the Entity"
          required
          value={formData.entityName}
          error={fieldErrors.entityName}
          onChange={(v) => {
            updateField("entityName", v);
            if (fieldErrors.entityName) {
              clearError("entityName");
            }
          }}
          onBlur={() => {
            if (!formData.entityName.trim()) {
              setError("entityName", "Name of the Entity is required");
            }
          }}
        />

        <TextArea
          label="Registered Address"
          required
          placeholder="Enter Registered Address"
          value={formData.registeredAddress.address}
          error={fieldErrors.registeredAddress}
          onChange={(v) => {
            updateNestedField("registeredAddress", "address", v);
            if (fieldErrors.registeredAddress) {
              clearError("registeredAddress");
            }
          }}
          onBlur={() => {
            if (!formData.registeredAddress.address.trim()) {
              setError("registeredAddress", "Registered address is required");
            }
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Registered Address Pin"
            placeholder="Enter Registered Address PIN"
            required
            value={formData.registeredAddress.pin}
            error={fieldErrors.registeredPin}
            onChange={(v) => {
              updateNestedField("registeredAddress", "pin", v);
              if (fieldErrors.registeredPin) {
                clearError("registeredPin");
              }
            }}
            onBlur={() => {
              if (!/^\d{6}$/.test(formData.registeredAddress.pin)) {
                setError("registeredPin", "PIN must be exactly 6 digits");
              }
            }}
          />

          <TextInput
            label="Registered Address Contact Number"
            placeholder="Enter Registered Address Contact Number"
            required
            value={formData.registeredAddress.contactNumber}
            error={fieldErrors.registeredContact}
            onChange={(v) => {
              updateNestedField("registeredAddress", "contactNumber", v);
              if (fieldErrors.registeredContact) {
                clearError("registeredContact");
              }
            }}
            onBlur={() => {
              if (
                !/^[6-9]\d{9}$/.test(formData.registeredAddress.contactNumber)
              ) {
                setError(
                  "registeredContact",
                  "Contact number must be a valid 10-digit mobile number",
                );
              }
            }}
          />
        </div>

        {/* Communication Address */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-blue-900">
              Local / Communication Address
              <span className="text-red-600 ml-1">*</span>
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
              <input
                type="checkbox"
                checked={formData.communicationAddress.sameAsRegistered}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setFormData((prev) => ({
                    ...prev,
                    communicationAddress: {
                      sameAsRegistered: checked,
                      address: checked ? prev.registeredAddress.address : "",
                      pin: checked ? prev.registeredAddress.pin : "",
                      contactNumber: checked
                        ? prev.registeredAddress.contactNumber
                        : "",
                    },
                  }));

                  // 🔥 THIS is what removes the red border
                  if (checked) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.communicationAddress;
                      delete next.communicationPin;
                      delete next.communicationContact;
                      return next;
                    });
                  }
                }}
              />
              Same as Registered Address
            </label>
          </div>

          <TextArea
            required
            placeholder="Enter Local / Communication Address"
            value={formData.communicationAddress.address}
            disabled={formData.communicationAddress.sameAsRegistered}
            error={fieldErrors.communicationAddress}
            onChange={(v) => {
              updateNestedField("communicationAddress", "address", v);
              if (fieldErrors.communicationAddress) {
                clearError("communicationAddress");
              }
            }}
            onBlur={() => {
              if (
                !formData.communicationAddress.sameAsRegistered &&
                !formData.communicationAddress.address.trim()
              ) {
                setError(
                  "communicationAddress",
                  "Local / Communication address is required",
                );
              }
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Local/Communication Address Pin"
              placeholder="Enter Local/Communication Address PIN"
              required
              value={formData.communicationAddress.pin}
              disabled={formData.communicationAddress.sameAsRegistered}
              error={fieldErrors.communicationPin}
              onChange={(v) => {
                updateNestedField("communicationAddress", "pin", v);
                if (fieldErrors.communicationPin) {
                  clearError("communicationPin");
                }
              }}
              onBlur={() => {
                if (
                  !formData.communicationAddress.sameAsRegistered &&
                  !/^\d{6}$/.test(formData.communicationAddress.pin)
                ) {
                  setError("communicationPin", "PIN must be exactly 6 digits");
                }
              }}
            />

            <TextInput
              label="Local/Communication Address Contact Number"
              placeholder="Enter Local/Communication Address Contact Number"
              required
              value={formData.communicationAddress.contactNumber}
              disabled={formData.communicationAddress.sameAsRegistered}
              error={fieldErrors.communicationContact}
              onChange={(v) => {
                updateNestedField("communicationAddress", "contactNumber", v);
                if (fieldErrors.communicationContact) {
                  clearError("communicationContact");
                }
              }}
              onBlur={() => {
                if (
                  !formData.communicationAddress.sameAsRegistered &&
                  !/^[6-9]\d{9}$/.test(
                    formData.communicationAddress.contactNumber,
                  )
                ) {
                  setError(
                    "communicationContact",
                    "Contact number must be a valid 10-digit mobile number",
                  );
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Email"
            required
            type="email"
            placeholder="Enter Email Address"
            value={formData.email}
            error={fieldErrors.email}
            onChange={(v) => {
              updateField("email", v);
              if (fieldErrors.email) {
                clearError("email");
              }
            }}
            onBlur={() => {
              if (!formData.email.trim()) {
                setError("email", "Email is required");
              } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                setError("email", "Invalid email address");
              }
            }}
          />

          <TextInput
            label="Website"
            type="url"
            placeholder="Enter Website"
            value={formData.website}
            error={fieldErrors.website}
            onChange={(v) => {
              updateField("website", v);
              if (fieldErrors.website) {
                clearError("website");
              }
            }}
            onBlur={() => {
              if (
                formData.website.trim() &&
                !/^https?:\/\/.+\..+/.test(formData.website)
              ) {
                setError("website", "Enter a valid website URL (https://...)");
              }
            }}
          />
        </div>
        <div className="space-y-8">
          {/* PAN + GST */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* PAN Number */}
            <div className="md:col-span-2">
              <TextInput
                label="PAN No."
                required
                placeholder="Enter PAN No."
                value={formData.taxDetails.panNumber}
                error={fieldErrors.panNumber}
                onChange={(v) => {
                  const upper = v.toUpperCase();
                  updateNestedField("taxDetails", "panNumber", upper);

                  if (fieldErrors.panNumber) {
                    clearError("panNumber");
                  }
                }}
                onBlur={() => {
                  if (
                    !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
                      formData.taxDetails.panNumber,
                    )
                  ) {
                    setError(
                      "panNumber",
                      "Invalid PAN format (e.g. ABCDE1234F)",
                    );
                  }
                }}
              />
            </div>

            {/* GST Applicable */}
            <RadioGroup
              label="Whether GST Applicable?"
              required
              value={formData.taxDetails.gstApplicable ? "yes" : "no"}
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              onChange={(v) => {
                const isApplicable = v === "yes";

                updateNestedField("taxDetails", "gstApplicable", isApplicable);

                if (!isApplicable) {
                  // clear GST text fields
                  updateNestedField("taxDetails", "gstNumber", "");
                  updateNestedField("taxDetails", "gstRegistrationType", "");

                  // 🔥 CRITICAL: clear GST certificate file
                  setFiles((prev) => {
                    const copy = { ...prev };
                    delete copy.GST_CERTIFICATE;
                    return copy;
                  });
                }
              }}
            />

            {/* GST Number */}
            <TextInput
              label="GST No."
              placeholder="Enter GST No."
              value={formData.taxDetails.gstNumber}
              disabled={!formData.taxDetails.gstApplicable}
              error={fieldErrors.gstNumber}
              onChange={(v) => {
                const upper = v.toUpperCase();
                updateNestedField("taxDetails", "gstNumber", upper);

                if (fieldErrors.gstNumber) {
                  clearError("gstNumber");
                }
              }}
              onBlur={() => {
                if (
                  formData.taxDetails.gstApplicable &&
                  !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
                    formData.taxDetails.gstNumber,
                  )
                ) {
                  setError(
                    "gstNumber",
                    "Invalid GST format (e.g. 22ABCDE1234F1Z5)",
                  );
                }
              }}
            />
          </div>

          {/* GST extra fields (ONLY if Yes) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* GST Registration Type */}
            <Select
              label="GST Registration Type"
              required
              disabled={!formData.taxDetails.gstApplicable}
              value={formData.taxDetails.gstRegistrationType}
              options={[
                { label: "Registered", value: "registered" },
                { label: "Unregistered", value: "unregistered" },
                { label: "Composite", value: "composite" },
                { label: "Exempt", value: "exempt" },
              ]}
              onChange={(v) =>
                updateNestedField("taxDetails", "gstRegistrationType", v)
              }
            />

            {/* GST Certificate */}
            {formData.taxDetails.gstApplicable && (
              <FileUpload
                label="GST Certificate"
                value={files.GST_CERTIFICATE}
                required
                onChange={(file) =>
                  setFiles((prev) => ({
                    ...prev,
                    GST_CERTIFICATE: file ?? undefined,
                  }))
                }
              />
            )}
            <RadioGroup
              label="Whether MSME Applicable?"
              value={formData.taxDetails.msmeApplicable ? "yes" : "no"}
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              onChange={(v) => {
                const isApplicable = v === "yes";

                updateNestedField("taxDetails", "msmeApplicable", isApplicable);

                if (!isApplicable) {
                  // clear MSME fields
                  updateNestedField("taxDetails", "msmeNumber", "");
                  updateNestedField("taxDetails", "msmeType", "");
                  updateNestedField("taxDetails", "msmeClass", "");

                  // 🔥 CRITICAL: clear MSME file
                  setFiles((prev) => {
                    const copy = { ...prev };
                    delete copy.MSME_CERTIFICATE;
                    return copy;
                  });
                }
              }}
            />

            {/* MSME Number */}
            <TextInput
              label="MSME No."
              placeholder="Enter MSME No."
              value={formData.taxDetails.msmeNumber}
              disabled={!formData.taxDetails.msmeApplicable}
              error={fieldErrors.msmeNumber}
              onChange={(v) => {
                updateNestedField("taxDetails", "msmeNumber", v);
                if (fieldErrors.msmeNumber) {
                  clearError("msmeNumber");
                }
              }}
              onBlur={() => {
                if (
                  formData.taxDetails.msmeApplicable &&
                  !formData.taxDetails.msmeNumber.trim()
                ) {
                  setError("msmeNumber", "MSME number is required");
                }
              }}
            />
          </div>
          {/* MSME extra fields (ONLY if Yes) */}
          {formData.taxDetails.msmeApplicable && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* MSME Type */}
              <Select
                label="MSME Type"
                required
                disabled={!formData.taxDetails.msmeApplicable}
                value={formData.taxDetails.msmeType}
                options={[
                  { label: "Micro", value: "micro" },
                  { label: "Small", value: "small" },
                  { label: "Medium", value: "medium" },
                ]}
                onChange={(v) => updateNestedField("taxDetails", "msmeType", v)}
              />

              {/* MSME Class */}
              <Select
                label="MSME Class"
                required
                disabled={!formData.taxDetails.msmeApplicable}
                value={formData.taxDetails.msmeClass}
                options={[
                  { label: "Trading", value: "trading" },
                  { label: "Service", value: "service" },
                  { label: "Manufacturing", value: "manufacturing" },
                ]}
                onChange={(v) =>
                  updateNestedField("taxDetails", "msmeClass", v)
                }
              />

              {/* MSME Certificate */}
              <FileUpload
                label="MSME Registration Certificate"
                value={files.MSME_CERTIFICATE}
                required
                onChange={(file) =>
                  setFiles((prev) => ({
                    ...prev,
                    MSME_CERTIFICATE: file ?? undefined,
                  }))
                }
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CIN Number */}
          <TextInput
            label="CIN Number"
            placeholder="Enter CIN Number"
            value={formData.taxDetails.cinNumber}
            error={fieldErrors.cinNumber}
            onChange={(v) => {
              const upper = v.toUpperCase();
              updateNestedField("taxDetails", "cinNumber", upper);

              if (fieldErrors.cinNumber) {
                clearError("cinNumber");
              }
            }}
            onBlur={() => {
              if (
                formData.taxDetails.cinNumber.trim() &&
                !/^[A-Z0-9]{21}$/.test(formData.taxDetails.cinNumber)
              ) {
                setError(
                  "cinNumber",
                  "Invalid CIN format (21 alphanumeric characters)",
                );
              }
            }}
          />

          {/* Type of Establishment */}
          <Select
            label="Type of Establishment"
            required
            value={formData.businessDetails.establishmentType}
            options={[
              { label: "Proprietorship", value: "proprietorship" },
              { label: "Partnership", value: "partnership" },
              { label: "Private Limited", value: "private_ltd" },
              { label: "Public Limited", value: "public_ltd" },
              { label: "LLP", value: "llp" },
              { label: "Trust", value: "trust" },
              { label: "Society", value: "society" },
              { label: "Other", value: "other" },
            ]}
            onChange={(v) =>
              updateNestedField("businessDetails", "establishmentType", v)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Products */}
          <MultiSelect
            label="Key Products, Goods and Services"
            required
            options={KEY_PRODUCTS}
            values={formData.businessDetails.keyProducts}
            onChange={(values) => {
              // 1️⃣ update keyProducts
              updateNestedField("businessDetails", "keyProducts", values);

              // 2️⃣ compute allowed specific products
              const allowed = values.flatMap((v) => PRODUCT_MAPPING[v] ?? []);

              // 3️⃣ clean up invalid specificProducts
              setFormData((prev) => ({
                ...prev,
                businessDetails: {
                  ...prev.businessDetails,
                  specificProducts:
                    prev.businessDetails.specificProducts.filter((sp) =>
                      allowed.includes(sp),
                    ),
                },
              }));
            }}
          />

          {/* Specific Products */}

          <MultiSelect
            label="Specific Products / Services"
            required
            options={specificOptions}
            values={formData.businessDetails.specificProducts}
            onChange={(values) =>
              updateNestedField("businessDetails", "specificProducts", values)
            }
          />
        </div>
        <div className="space-y-4">
          {/* AGIHF Relation */}
          <RadioGroup
            label="Any Relation at AGIHF?"
            value={formData.businessDetails.hasRelationWithAGIHF ? "yes" : "no"}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            onChange={(v) => {
              const hasRelation = v === "yes";

              updateNestedField(
                "businessDetails",
                "hasRelationWithAGIHF",
                hasRelation,
              );

              if (!hasRelation) {
                updateNestedField("businessDetails", "relationDetails", "");
              }
            }}
          />

          {/* Relation Details (only when Yes) */}
          {formData.businessDetails.hasRelationWithAGIHF && (
            <div className="pl-1">
              <TextInput
                label="Relation Details"
                required
                placeholder="If Yes, specify relation"
                value={formData.businessDetails.relationDetails}
                error={fieldErrors.relationDetails}
                onChange={(v) => {
                  updateNestedField("businessDetails", "relationDetails", v);
                  if (fieldErrors.relationDetails) {
                    clearError("relationDetails");
                  }
                }}
                onBlur={() => {
                  if (
                    formData.businessDetails.hasRelationWithAGIHF &&
                    !formData.businessDetails.relationDetails.trim()
                  ) {
                    setError(
                      "relationDetails",
                      "Relation details are required when relation exists",
                    );
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className=" mt-6">
        <h1 className="text-2xl font-black  text-blue-900 mb-3">
          Documents to be enclosed
        </h1>
        <div className="h-px w-full bg-blue-100 mb-4" />

        <div
          className="
    rounded-lg
    border border-blue-100
    bg-white
    p-6
    shadow-[0_1px_4px_rgba(0,0,0,0.06)]
  "
        >
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3">
              {/* REQUIRED DOCUMENTS */}
              {REQUIRED_DOCS.map((doc) => (
                <label
                  key={doc.backendType}
                  className="flex items-center gap-2 opacity-90"
                >
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 accent-blue-700 cursor-not-allowed"
                  />
                  <span className="text-sm font-semibold text-blue-900">
                    {doc.label}
                    <span className="text-red-600 ml-1">*</span>
                  </span>
                </label>
              ))}

              {/* OPTIONAL DOCUMENTS */}
              {OPTIONAL_DOCS.map((doc) => {
                const checked =
                  formData.documentFlags[
                    doc.flagKey as keyof typeof formData.documentFlags
                  ];

                return (
                  <label
                    key={doc.backendType}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const isChecked = e.target.checked;

                        setFormData((prev) => ({
                          ...prev,
                          documentFlags: {
                            ...prev.documentFlags,
                            [doc.flagKey!]: isChecked,
                          },
                        }));

                        // 🔥 CRITICAL: keep files in sync
                        if (!isChecked) {
                          setFiles((prev) => {
                            const copy = { ...prev };
                            delete copy[doc.backendType as keyof typeof prev];
                            return copy;
                          });
                        }
                      }}
                      className="h-4 w-4 accent-blue-700"
                    />

                    <span className="text-sm font-bold text-blue-900">
                      {doc.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          {/* UPLOAD SUPPORTING DOCUMENTS */}
          <div className="mt-8">
            <h1 className="text-xl font-black  text-blue-900 mb-3">
              Upload Supporting Documents
            </h1>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                {uploadableDocs.map((doc) => (
                  <FileUpload
                    key={doc.backendType}
                    label={doc.label}
                    required={doc.required}
                    value={files[doc.backendType as keyof typeof files]}
                    onChange={(file) =>
                      setFiles((prev) => ({
                        ...prev,
                        [doc.backendType]: file,
                      }))
                    }
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Upload GST, PAN, Trade License, MSME, Bank Proof, etc.
                (PDF/JPG/PNG)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICANT DETAILS */}
      <div className="mt-6">
        <h1 className="text-xl font-black  text-blue-900 mb-3">
          Applicant Details
        </h1>
        <div className="h-px w-full bg-blue-100 mb-4" />

        <div
          className="rounded-lg
    border border-blue-100
    bg-white
    p-6
    shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
        >
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Name of the Applicant"
              placeholder="Enter name of applicant."
              required
              value={formData.applicant.applicantName}
              error={fieldErrors.applicantName}
              onChange={(v) => {
                updateNestedField("applicant", "applicantName", v);
                if (fieldErrors.applicantName) {
                  clearError("applicantName");
                }
              }}
              onBlur={() => {
                if (!formData.applicant.applicantName.trim()) {
                  setError("applicantName", "Applicant name is required");
                }
              }}
            />

            <TextInput
              label="Authorised Person"
              placeholder="Enter authorized person."
              required
              value={formData.applicant.authorisedPerson}
              error={fieldErrors.authorisedPerson}
              onChange={(v) => {
                updateNestedField("applicant", "authorisedPerson", v);
                if (fieldErrors.authorisedPerson) {
                  clearError("authorisedPerson");
                }
              }}
              onBlur={() => {
                if (!formData.applicant.authorisedPerson.trim()) {
                  setError(
                    "authorisedPerson",
                    "Authorised person name is required",
                  );
                }
              }}
            />

            <FileUpload
              label="Declaration File (PDF Only)"
              value={files.DECLARATION_FORM}
              required
              onChange={(file) =>
                setFiles((prev) => ({
                  ...prev,
                  DECLARATION_FORM: file ?? undefined,
                }))
              }
            />
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Upload a signed declaration form.{" "}
            <a
              href="/samples/declaration-sample.docx"
              download
              className="text-blue-700 font-medium underline hover:text-blue-800"
            >
              Download sample here
            </a>
            .
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SUBMIT */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={handleSubmit}
          className={`
      inline-flex items-center gap-3
      px-10 py-4
      text-base font-semibold
      rounded-lg
      text-white
      bg-linear-to-r from-blue-600 to-blue-700
      shadow-md
      hover:from-blue-700 hover:to-blue-800
      hover:-translate-y-0.5
      focus:outline-none focus:ring-2 focus:ring-blue-200
      transition-all duration-200 ease-in-out
      active:translate-y-0 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }
          `}
        >
          <FaPaperPlane className="text-lg" />
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </PageContainer>
  );
};

export default VendorRegister;
