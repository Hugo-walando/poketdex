'use client';

import { Undo2 } from 'lucide-react';

interface ResetFiltersProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ResetFilters({ onClick, disabled }: ResetFiltersProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`transition px-3 py-2 rounded-lg shadow-base flex items-center justify-center text-white
        ${
          disabled
            ? ' bg-gray-300 cursor-not-allowed'
            : ' bg-primarygreen hover:cursor-pointer'
        }
      `}
    >
      <Undo2 className='w-5 h-5' />
    </button>
  );
}
