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
        className='w-full p-4 md:p-6 rounded-xl focus:outline-none text-dark-lg md:text-dark-xl placeholder:text-gray-xl bg-white shadow-base'
      />
      <CardSeachIcon className='pl-1 mt-1 w-7 h-7 md:w-10 md:h-10 text-darkgray absolute right-4 top-1/2 transform -translate-y-1/2 ' />
      {/* <button
        type='submit'
        className='h-10 w-10 rounded-xl hover:cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center'
      > */}
      {/* </button> */}
    </div>
  );
}
