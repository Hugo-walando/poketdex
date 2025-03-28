import { Match } from '../types';

export const mockMatches: Match[] = [
  {
    id: 'match_001',
    status: 'pending',
    created_at: '2025-03-28T10:30:00Z',
    user: {
      id: 'user_002',
      username: 'DresseurX',
      profile_picture: '/testimgs/avatars/1.png',
      friend_code: 'SW-1234-5678',
    },
    offered_card: {
      id: 'card_35',
      name: 'Pikachu EX',
      img_url: '/testimgs/cards/PikachuEx.png',
      rarity: 4,
      official_id: 113,
      set_img: '/testimgs/sets/PuissanceGénétique.png',
    },
    requested_card: {
      id: 'card_12',
      name: 'Bulbizarre',
      img_url: '/testimgs/cards/Bulbizarre.png',
      rarity: 1,
      official_id: 1,
      set_img: '/testimgs/sets/IleFabuleuse.png',
    },
  },
  {
    id: 'match_002',
    status: 'pending',
    created_at: '2025-03-28T11:15:00Z',
    user: {
      id: 'user_003',
      username: 'Sacha93',
      profile_picture: '/testimgs/avatars/2.png',
      friend_code: 'SW-8765-4321',
    },
    offered_card: {
      id: 'card_77',
      name: 'Arcanin',
      img_url: '/testimgs/cards/Arcanin.png',
      rarity: 3,
      official_id: 14,
      set_img: '/testimgs/sets/PuissanceGénétique.png',
    },
    requested_card: {
      id: 'card_55',
      name: 'Herbizarre',
      img_url: '/testimgs/cards/Herbizarre.png',
      rarity: 2,
      official_id: 2,
      set_img: '/testimgs/sets/ChocSpacioTemporel.png',
    },
  },
  // ... Ajoute autant que tu veux
];
