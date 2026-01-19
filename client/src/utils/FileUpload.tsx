import { useRef, useState } from "react";

type Props = {
  label: string;
  value?: File | null;
  required?: boolean;
  onChange: (file: File | null) => void;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

// HARD LIMITS
const PDF_MAX_MB = 2;
const IMAGE_MAX_KB = 500;

export default function FileUpload({
  label,
  value,
  required,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // 🔒 File type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PDF, JPG or PNG files are allowed.");
      onChange(null);
      e.target.value = "";
      return;
    }

    // 🔒 PDF size validation
    if (file.type === "application/pdf") {
      if (file.size > PDF_MAX_MB * 1024 * 1024) {
        setError(`PDF must be smaller than ${PDF_MAX_MB} MB.`);
        onChange(null);
        e.target.value = "";
        return;
      }
    }

    // 🔒 Image size validation
    if (file.type.startsWith("image/")) {
      if (file.size > IMAGE_MAX_KB * 1024) {
        setError(`Image must be smaller than ${IMAGE_MAX_KB} KB.`);
        onChange(null);
        e.target.value = "";
        return;
      }
    }

    // ✅ File accepted
    onChange(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-blue-900">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Custom file picker */}
      <div
        className={`
          flex items-center gap-3
          rounded-md border px-3 py-2
          ${error ? "border-red-500" : "border-gray-300"}
          bg-gray-50
        `}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            px-4 py-2
            rounded-md
            bg-gray-200
            text-sm font-semibold
            text-gray-700
            hover:bg-gray-300
            border border-gray-300
          "
        >
          Choose File
        </button>

        <span className="text-sm text-gray-700 truncate">
          {value ? value.name : "No file selected"}
        </span>
      </div>

      {/* File size display */}
      {value && !error && (
        <p className="text-xs text-gray-500">
          {(value.size / 1024).toFixed(1)} KB
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
