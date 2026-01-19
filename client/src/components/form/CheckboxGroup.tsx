type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  label?: string;
  required?: boolean;
  values: string[];
  options: Option[];
  onChange?: (values: string[]) => void;
};

const CheckboxGroup = ({
  label,
  required,
  values,
  options,
  onChange,
}: Props) => {
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange?.(values.filter((v) => v !== value));
    } else {
      onChange?.([...values, value]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-bold text-blue-900 whitespace-nowrap">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className="flex flex-wrap gap-6">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 leading-none"
          >
            <input
              type="checkbox"
              disabled={opt.disabled}
              checked={values.includes(opt.value)}
              onChange={() => !opt.disabled && toggleValue(opt.value)}
              className="h-4 w-4 accent-blue-700 disabled:cursor-not-allowed"
            />
            <span className="text-sm font-bold text-blue-900">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
