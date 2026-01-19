import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  required?: boolean;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
};

const MultiSelect = ({ label, required, options, values, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  /* -------------------- CLOSE ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };

  const selectAll = () => {
    onChange(
      values.length === options.length ? [] : options.map((o) => o.value)
    );
  };

  return (
    <div className="relative space-y-1" ref={ref}>
      <label className="text-sm font-bold text-blue-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm
          border rounded-md bg-white hover:border-blue-400"
      >
        <span className="text-gray-700">
          {values.length === 0
            ? "Select"
            : values.length === options.length
            ? `All Selected (${values.length})`
            : `Selected (${values.length})`}
        </span>
        <FaChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 w-full mt-2 rounded-md border bg-white shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <FaSearch className="text-gray-400" />
            <input
              className="w-full text-sm outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select All */}
          <div
            onClick={selectAll}
            className="px-4 py-2 cursor-pointer text-sm font-semibold hover:bg-gray-100"
          >
            {values.length === options.length ? "Unselect All" : "Select All"}
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto">
            {filtered.map((opt) => {
              const checked = values.includes(opt.value);

              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer text-sm
                    hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="h-4 w-4 accent-blue-700"
                  />
                  <span
                    className={
                      checked
                        ? "font-semibold text-blue-900"
                        : "text-gray-700"
                    }
                  >
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
