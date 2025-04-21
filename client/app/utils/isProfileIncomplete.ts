import { User } from 'next-auth';

export function isProfileIncomplete(user: User) {
  return !user.username || !user.friend_code;
}
