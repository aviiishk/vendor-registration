type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  required?: boolean;
  value?: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

const Select = ({
  label,
  required,
  value = "",
  options,
  disabled,
  onChange,
}: Props) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-blue-900">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full
          appearance-none
          rounded-md
          border border-gray-300
          bg-white
          px-4 py-3
          text-sm text-gray-900
          focus:outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-300
          transition
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}
        `}
      >
        <option value="" disabled>
          Select
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
