'use client';

import { useState, useEffect } from 'react';
import CardSeachIcon from '../svgs/CardSearchIcon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  triggerOnSubmitOnly?: boolean;
}

export default function SearchBar({
  placeholder = 'Rechercher une carte...',
  onSearch,
  triggerOnSubmitOnly = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  useEffect(() => {
    if (!triggerOnSubmitOnly) {
      onSearch(query);
    }
  }, [query, triggerOnSubmitOnly, onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full mx-auto relative flex items-center'
    >
      <input
        type='text'
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className='w-full p-4 md:p-6 rounded-xl focus:outline-none text-dark-lg md:text-dark-xl placeholder:text-gray-xl bg-white shadow-base pr-12'
      />

      {triggerOnSubmitOnly ? (
        <button
          type='submit'
          className='absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-primarygreen hover:cursor-pointer bg-gray-300 transition'
          aria-label='Rechercher'
        >
          <CardSeachIcon className='pt-1.5 pl-1.5 w-8 h-8 lg:w-10 lg:h-10 text-white' />
        </button>
      ) : (
        <CardSeachIcon className='pl-1 mt-1 w-7 h-7 md:w-10 md:h-10 text-darkgray absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none' />
      )}
    </form>
  );
}
