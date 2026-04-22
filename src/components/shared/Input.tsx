import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={`px-3 py-2 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
