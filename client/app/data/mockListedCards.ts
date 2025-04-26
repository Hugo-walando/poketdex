import { ListedCard } from '../types';

export const mockListedCards: ListedCard[] = [
  {
    _id: '1',
    user: {
      _id: 'u1',
      username: 'Sacha',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-9012',
    },
    card: {
      _id: 'c1',
      name: 'Pikachu',
      img_url: '/testimgs/cards/PikachuEx.png',
      rarity: 4,
      set_code: '1',
      official_id: '113',
      updated_at: '2024-03-01',
      created_at: '2024-03-01',
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    _id: '2',
    user: {
      _id: 'u2',
      username: 'Ondine',
      profile_picture: '/testimgs/avatars/Av2.png',
      friend_code: '1234-5678-9012',
    },
    card: {
      _id: 'c2',
      name: 'Misty',
      img_url: '/testimgs/cards/Amonistar.png',
      rarity: 3,
      set_code: '2',
      official_id: '78',
      updated_at: '2024-03-01',
      created_at: '2024-03-01',
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    _id: '3',
    user: {
      _id: 'u3',
      username: 'Pierre',
      profile_picture: '/testimgs/avatars/Av3.png',
      friend_code: '1234-5678-9012',
    },
    card: {
      _id: 'c3',
      name: 'Racaillou',
      img_url: '/testimgs/cards/Drakarmin.png',
      rarity: 2,
      set_code: '1',
      official_id: '44',
      updated_at: '2024-03-01',
      created_at: '2024-03-01',
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];
