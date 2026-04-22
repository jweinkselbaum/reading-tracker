import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const inputStyle: React.CSSProperties = {
  background: '#FDFAF5',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06)',
  border: 'none',
  outline: 'none',
};

const focusClass = 'focus:ring-2 focus:ring-[#2C4A1E]/30 focus:ring-offset-0';

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', id, style, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold tracking-wide uppercase text-[#6B6059]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`px-3 py-2.5 text-sm rounded-md text-[#1A1512] placeholder-[#B0A89E] transition-shadow ${focusClass} ${error ? 'ring-2 ring-red-400/40' : ''} ${className}`}
        style={{ ...inputStyle, ...style }}
        {...props}
      />
      {error && <p className="text-xs text-[#8B2220]">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
