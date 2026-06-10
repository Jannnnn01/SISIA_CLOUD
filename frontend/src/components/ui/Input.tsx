import { InputHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-100 ${className}`}
    {...props}
  />
);
