'use client';

import { useState } from 'react';
import CardSeachIcon from '../svgs/CardSearchIcon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({
  placeholder = 'Rechercher une carte...',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className='w-full mx-auto relative'>
      <input
        type='text'
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className='w-full p-6 rounded-xl focus:outline-none text-dark-xl placeholder:text-gray-xl bg-white shadow-base'
      />
      <button
        type='submit'
        className='h-10 w-10 rounded-xl hover:cursor-pointer bg-primarygreen absolute right-4 top-1/2 transform -translate-y-1/2'
      >
        <CardSeachIcon className='w-8 h-8 text-white' />
      </button>
    </div>
  );
}
