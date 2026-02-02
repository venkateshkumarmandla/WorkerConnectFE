import React from "react";
// import { useLanguage } from "../contexts/LanguageContext";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  pattern,
  disabled = false,
  className = "",
  autoComplete,
  leftIcon,
  rightIcon
}) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          disabled={disabled}
          className={`input-mobile w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? "border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""}`}
          autoComplete={autoComplete}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
