'use client';

import { cn } from '@/app/utils/cn';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1'>
        {label && <label className='text-dark-sm font-semibold'>{label}</label>}
        <input
          ref={ref}
          className={cn(
            'px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primarygreen text-darkblue placeholder:text-grayblue',
            error && 'border-redalert ring-redalert',
            className,
          )}
          {...props}
        />
        {error && <span className='text-sm text-redalert mt-1'>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
