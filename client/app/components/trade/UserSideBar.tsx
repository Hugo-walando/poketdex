'use client';

import { useTradeRequestStore } from '@/app/store/useTradeRequestStore';
import UserItem from './UserItem';
import { useUserStore } from '@/app/store/useUserStore';

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
  const tradeGroups = useTradeRequestStore((s) => s.tradeGroups);
  const currentUserId = useUserStore((s) => s.user?.id);
  const hasImportantTradeWithUser = useTradeRequestStore(
    (s) => s.hasImportantTradeWithUser,
  );
  const handleSelectUser = (id: string) => {
    onSelectUser(id);
  };

  const usersWithActivity = users.map((user) => {
    const tradesWithUser =
      tradeGroups.find((group) => group.user._id === user._id)?.trades || [];

    const lastTradeDate = tradesWithUser.length
      ? new Date(
          Math.max(
            ...tradesWithUser.map((t) => new Date(t.updatedAt).getTime()),
          ),
        )
      : new Date(0);

    return {
      ...user,
      lastActivity: lastTradeDate,
    };
  });

  const sortedUsers = usersWithActivity.sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime(),
  );

  return (
    <aside className='w-full md:w-[250px] md:border-r md:border-gray-200 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-rounded '>
      <h2 className='text-dark-xl mb-4 pl-4 pt-2'>Utilisateurs</h2>
      <div className='flex flex-col gap-2 p-2 md:p-0'>
        {sortedUsers.map((user) => (
          <UserItem
            key={user._id}
            id={user._id}
            username={user.username}
            profilePicture={user.profile_picture || '/avatars/Av1.png'}
            isSelected={selectedUserId === user._id}
            onSelect={handleSelectUser}
            showAlertDot={
              currentUserId
                ? hasImportantTradeWithUser(user._id, currentUserId)
                : false
            }
          />
        ))}
      </div>
    </aside>
  );
}
