import { MatchGroup } from '../types';

export const mockMatches: MatchGroup[] = [
  {
    user: {
      id: 'u1',
      username: 'PokeFan42',
      profile_picture: '/testimgs/avatar1.png',
    },
    trades: [
      {
        id: 'm1',
        offered_card: {
          id: 'c1',
          name: 'Pikachu EX',
          img_url: '/testimgs/cards/PikachuEx.png',
          rarity: 4,
          official_id: 113,
          set_id: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          id: 'c3',
          name: 'Mewtwo',
          img_url: '/testimgs/cards/Mewtwo.png',
          rarity: 3,
          official_id: 25,
          set_id: '2',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      },
      {
        id: 'm2',
        offered_card: {
          id: 'c4',
          name: 'Arcanin',
          img_url: '/testimgs/cards/Arcanin.png',
          rarity: 2,
          official_id: 17,
          set_id: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          id: 'c2',
          name: 'Dracaufeu EX',
          img_url: '/testimgs/cards/DracaufeuEx.png',
          rarity: 5,
          official_id: 101,
          set_id: '1',
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
      profile_picture: '/testimgs/avatar2.png',
    },
    trades: [
      {
        id: 'm3',
        offered_card: {
          id: 'c2',
          name: 'Dracaufeu EX',
          img_url: '/testimgs/cards/DracaufeuEx.png',
          rarity: 5,
          official_id: 101,
          set_id: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
        requested_card: {
          id: 'c1',
          name: 'Pikachu EX',
          img_url: '/testimgs/cards/PikachuEx.png',
          rarity: 4,
          official_id: 113,
          set_id: '1',
          created_at: '2024-03-01',
          updated_at: '2024-03-01',
        },
      },
    ],
  },
];
