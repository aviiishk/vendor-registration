import React from "react";

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  label: string;
  value: string; // single selected value
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  value,
  options,
  required = false,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-bold text-blue-900">
        {label}
        {required && (
          <span className="text-red-600 ml-1">*</span>
        )}
      </label>

      {/* Radio options */}
      <div className="flex gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 text-sm font-medium
              ${
                disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-800 cursor-pointer"
              }`}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="
                h-4 w-4
                accent-blue-700
                focus:ring-2 focus:ring-blue-600
              "
            />
            <span className=" text-sm font-bold text-blue-900">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
