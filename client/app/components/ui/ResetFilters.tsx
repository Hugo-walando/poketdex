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
      className={`transition w-10 h-10 md:w-11 md:h-11 rounded-xl shadow-base flex items-center justify-center text-white
        ${
          disabled
            ? ' bg-gray-300 cursor-not-allowed'
            : ' bg-primarygreen hover:cursor-pointer'
        }
      `}
    >
      <Undo2 />
    </button>
  );
}
