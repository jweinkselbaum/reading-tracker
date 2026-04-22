import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const selectStyle: React.CSSProperties = {
  background: '#FDFAF5',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06)',
  border: 'none',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6059' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
};

export const Select = forwardRef<HTMLSelectElement, Props>(({ label, error, className = '', id, children, ...props }, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold tracking-wide uppercase text-[#6B6059]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`px-3 py-2.5 pr-9 text-sm rounded-md text-[#1A1512] transition-shadow focus:ring-2 focus:ring-[#2C4A1E]/30 ${error ? 'ring-2 ring-red-400/40' : ''} ${className}`}
        style={selectStyle}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#8B2220]">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
