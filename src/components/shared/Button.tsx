import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const base = 'inline-flex items-center gap-1.5 font-medium rounded-md border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, { className: string; style: React.CSSProperties }> = {
  primary: {
    className: 'text-white border-transparent',
    style: {
      background: 'linear-gradient(180deg, #3A6127 0%, #2C4A1E 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
    },
  },
  secondary: {
    className: 'text-[#2C1A0E] border-[#D4C9B8]',
    style: {
      background: 'linear-gradient(180deg, #FDFAF5 0%, #F2EDE4 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.1)',
    },
  },
  ghost: {
    className: 'bg-transparent text-[#6B6059] border-transparent',
    style: {},
  },
  danger: {
    className: 'text-[#8B2220] border-[#D4C9B8]',
    style: {
      background: 'linear-gradient(180deg, #FDF5F5 0%, #F5E6E6 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.08)',
    },
  },
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className = '', style = {}, children, ...props }: Props) {
  const v = variants[variant];
  return (
    <button
      className={`${base} ${v.className} ${sizes[size]} ${className}`}
      style={{ ...v.style, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
