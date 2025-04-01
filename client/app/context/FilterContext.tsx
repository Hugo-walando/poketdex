'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FilterType = 'set' | 'rarity' | null;

interface FilterContextProps {
  openFilter: FilterType;
  setOpenFilter: (filter: FilterType) => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterDropdownProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openFilter, setOpenFilter] = useState<FilterType>(null);

  return (
    <FilterContext.Provider value={{ openFilter, setOpenFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error(
      'useFilterDropdown must be used inside FilterDropdownProvider',
    );
  return context;
};
