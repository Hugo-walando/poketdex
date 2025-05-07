'use client';

import UserItem from './UserItem';

interface UserSidebarProps {
  users: { _id: string; username: string; profile_picture: string }[];
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}

export default function UserSidebar({
  users,
  selectedUserId,
  onSelectUser,
}: UserSidebarProps) {
  return (
    <aside className='w-full md:w-[250px] md:border-r md:border-gray-200 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-rounded '>
      <h2 className='text-dark-xl mb-4 pl-4 pt-2'>Utilisateurs</h2>
      <div className='flex flex-col gap-2 p-2 md:p-0'>
        {users.map((user) => (
          <UserItem
            key={user._id}
            id={user._id}
            username={user.username}
            profilePicture={user.profile_picture || '/testimgs/avatars/Av1.png'}
            isSelected={selectedUserId === user._id}
            onSelect={onSelectUser}
          />
        ))}
      </div>
    </aside>
  );
}
