'use client';

import { cn } from '@/app/utils/cn'; // Optionnel : une fonction utilitaire pour gérer les classes conditionnelles

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 md:px-10 py-2 rounded-full font-sans text-base md:text-lg shadow-btn font-semibold transition-all duration-200',
        variant === 'primary' &&
          'text-white border-solid border-2 border-white bg-primarygreen hover:bg-white hover:text-primarygreen hover:cursor-pointer',
        variant === 'secondary' &&
          'bg-white text-darkgray hover:cursor-pointer hover:bg-gray-200   ',
        variant === 'danger' &&
          'bg-white text-redalert border-2 border-redalert outline-2 outline-white border-solid hover:bg-redalert hover:text-white hover:cursor-pointer',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
