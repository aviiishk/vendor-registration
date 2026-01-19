type Props = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "url";
  disabled?: boolean;
};

const TextInput = ({
  label,
  required = false,
  placeholder,
  value = "",
  onChange,
  onBlur,
  error,
  type = "text",
  disabled = false,
}: Props) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-blue-900">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full rounded-md px-4 py-3 text-sm transition
          placeholder:text-gray-400
          focus:outline-none focus:ring-2
          ${
            error
              ? "border border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border border-gray-300 focus:border-blue-400 focus:ring-blue-100"
          }
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-500"
              : "bg-white text-gray-900"
          }
        `}
      />

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
