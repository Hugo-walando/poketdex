'use client';

import { useEffect, useState } from 'react';
import SearchBar from '../components/ui/SearchBar';

export default function Test() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log(searchQuery);
  }, [searchQuery]);

  return (
    <div className='bg-white rounded-xl shadow-base p-6 mx-auto mt-20 w-[600px]'>
      <SearchBar
        placeholder='Rechercher une carte...'
        onSearch={(query) => setSearchQuery(query.toLowerCase())}
      />
    </div>
  );
}
