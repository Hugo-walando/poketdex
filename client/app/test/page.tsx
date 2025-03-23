'use client';

import SetFilterDropdown from '../components/ui/SetFilterDropDown';

export default function Test() {
  return (
    <div className='bg-white rounded-xl shadow-base p-6 mx-auto mt-20 w-[600px]'>
      <SetFilterDropdown selectedSet='' onSelectSet={() => {}} />
    </div>
  );
}
