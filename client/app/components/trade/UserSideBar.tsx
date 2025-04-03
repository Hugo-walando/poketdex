'use client';

import UserItem from './UserItem';

interface UserSidebarProps {
  users: { id: string; username: string; profile_picture: string }[];
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}

export default function UserSidebar({
  users,
  selectedUserId,
  onSelectUser,
}: UserSidebarProps) {
  return (
    <aside className='w-full md:w-[250px] md:border-r md:border-gray-200 pr-2 overflow-y-auto'>
      <h2 className='text-dark-xl mb-4 pl-4 pt-2'>Utilisateurs</h2>
      <div className='flex flex-col gap-2 p-2 md:p-0'>
        {users.map((user) => (
          <UserItem
            key={user.id}
            id={user.id}
            username={user.username}
            profilePicture={user.profile_picture}
            isSelected={selectedUserId === user.id}
            onSelect={onSelectUser}
          />
        ))}
      </div>
    </aside>
  );
}
