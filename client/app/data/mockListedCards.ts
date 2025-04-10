import { ListedCard } from '../types';

export const mockListedCards: ListedCard[] = [
  {
    duplicate_id: '1',
    user: {
      id: 'u1',
      username: 'Sacha',
      profile_picture: '/testimgs/avatars/Av1.png',
    },
    card: {
      id: 'c1',
      name: 'Pikachu',
      img_url: '/testimgs/cards/PikachuEx.png',
      rarity: 4,
      set_code: '1',
      official_id: 113,
    },
  },
  {
    duplicate_id: '2',
    user: {
      id: 'u2',
      username: 'Ondine',
      profile_picture: '/testimgs/avatars/Av2.png',
    },
    card: {
      id: 'c2',
      name: 'Misty',
      img_url: '/testimgs/cards/Amonistar.png',
      rarity: 3,
      set_code: '2',
      official_id: 78,
    },
  },
  {
    duplicate_id: '3',
    user: {
      id: 'u3',
      username: 'Pierre',
      profile_picture: '/testimgs/avatars/Av3.png',
    },
    card: {
      id: 'c3',
      name: 'Racaillou',
      img_url: '/testimgs/cards/Drakarmin.png',
      rarity: 2,
      set_code: '1',
      official_id: 44,
    },
  },
];
