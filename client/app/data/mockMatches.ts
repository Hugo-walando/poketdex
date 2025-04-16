import { MatchGroup } from '../types';

export const mockMatches: MatchGroup[] = [
  {
    user: {
      id: 'u1',
      username: 'PokeFan42',
      profile_picture: '/testimgs/avatars/Av1.png',
    },
    trades: [
      {
        id: 'm1',
        offered_card: {
          _id: 'c1',
          name: 'Pikachu EX',
          img_url: '/testimgs/cards/PikachuEx.png',
          rarity: 4,
          official_id: '113',
          set_code: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          _id: 'c2',
          name: 'Dracaufeu EX',
          img_url: '/testimgs/cards/DracaufeuEx.png',
          rarity: 5,
          official_id: '101',
          set_code: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      },
      {
        id: 'm2',
        offered_card: {
          _id: 'c4',
          name: 'Arcanin',
          img_url: '/testimgs/cards/Arcanin.png',
          rarity: 2,
          official_id: '17',
          set_code: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          _id: 'c3',
          name: 'Amonistar',
          img_url: '/testimgs/cards/Amonistar.png',
          rarity: 3,
          official_id: '25',
          set_code: '2',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      },
    ],
  },
  {
    user: {
      id: 'u2',
      username: 'MistyMaster',
      profile_picture: '/testimgs/avatars/Av2.png',
    },
    trades: [
      {
        id: 'm3',
        offered_card: {
          _id: 'c2',
          name: 'Dracaufeu EX',
          img_url: '/testimgs/cards/DracaufeuEx.png',
          rarity: 5,
          official_id: '101',
          set_code: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          _id: 'c1',
          name: 'Pikachu EX',
          img_url: '/testimgs/cards/PikachuEx.png',
          rarity: 4,
          official_id: '113',
          set_code: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      },
    ],
  },
];
