import { useOnlineUserStore } from '@/app/store/useUserOnlineStore';

interface Props {
  userId: string;
}

export default function UserStatusIndicator({ userId }: Props) {
  const onlineUsers = useOnlineUserStore((state) => state.onlineUsers);
  const isOnline = onlineUsers.includes(userId);

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={isOnline ? 'En ligne' : 'Hors ligne'}
    />
  );
}
