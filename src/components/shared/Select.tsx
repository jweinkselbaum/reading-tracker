import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(({ label, error, className = '', id, children, ...props }, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        id={selectId}
        className={`px-3 py-2 text-sm border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
