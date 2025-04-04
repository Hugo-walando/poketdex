import { TradeRequest } from '../types';

export const mockTrades: TradeRequest[] = [
  {
    id: 'trade_1',
    sender_id: 'user_123',
    receiver_id: 'user_101',
    status: 'accepted',
    is_active: true,
    sent_by_sender: true,
    sent_by_receiver: false,
    created_at: '2025-04-02T11:01:20.089876',
    updated_at: '2025-04-02T11:01:20.089886',
    sender: {
      id: 'user_123',
      username: 'AshKetchum',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-7184-8614',
    },
    receiver: {
      id: 'user_101',
      username: 'Trainer1',
      profile_picture: '/testimgs/avatars/Av2.png',
      friend_code: '1234-5678-7184-8614',
    },
    offered_card: {
      id: 'card_1',
      name: 'CardName1',
      img_url: '/testimgs/cards/PikachuEx.png',
      official_id: '101/226',
      rarity: 5,
      set_id: '1',
    },
    requested_card: {
      id: 'card_11',
      name: 'CardName11',
      img_url: '/testimgs/cards/PalkiaEx.png',
      official_id: '111/226',
      rarity: 5,
      set_id: '3',
    },
  },
  {
    id: 'trade_2',
    sender_id: 'user_123',
    receiver_id: 'user_102',
    status: 'cancelled',
    is_active: false,
    sent_by_sender: false,
    sent_by_receiver: false,
    created_at: '2025-04-02T11:01:20.089911',
    updated_at: '2025-04-02T11:01:20.089914',
    sender: {
      id: 'user_123',
      username: 'AshKetchum',
      profile_picture: '/testimgs/avatars/Av3.png',
      friend_code: '1234-5678-7184-8614',
    },
    receiver: {
      id: 'user_102',
      username: 'Trainer2',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-7184-8614',
    },
    offered_card: {
      id: 'card_2',
      name: 'CardName2',
      img_url: '/testimgs/cards/Scarabrute.png',
      official_id: '102/226',
      rarity: 6,
      set_id: '2',
    },
    requested_card: {
      id: 'card_12',
      name: 'CardName12',
      img_url: '/testimgs/cards/Magnezone.png',
      official_id: '112/226',
      rarity: 7,
      set_id: '2',
    },
  },
  {
    id: 'trade_3',
    sender_id: 'user_123',
    receiver_id: 'user_103',
    status: 'pending',
    is_active: false,
    sent_by_sender: false,
    sent_by_receiver: false,
    created_at: '2025-04-02T11:01:20.089939',
    updated_at: '2025-04-02T11:01:20.089943',
    sender: {
      id: 'user_123',
      username: 'AshKetchum',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-7184-8614',
    },
    receiver: {
      id: 'user_103',
      username: 'Trainer3',
      profile_picture: '/testimgs/avatars/Av2.png',
      friend_code: '1234-5678-7184-8614',
    },
    offered_card: {
      id: 'card_3',
      name: 'CardName3',
      img_url: '/testimgs/cards/Scarabrute.png',
      official_id: '103/226',
      rarity: 4,
      set_id: '2',
    },
    requested_card: {
      id: 'card_13',
      name: 'CardName13',
      img_url: '/testimgs/cards/Regice.png',
      official_id: '113/226',
      rarity: 8,
      set_id: '1',
    },
  },
  {
    id: 'trade_4',
    sender_id: 'user_123',
    receiver_id: 'user_104',
    status: 'cancelled',
    is_active: false,
    sent_by_sender: false,
    sent_by_receiver: false,
    created_at: '2025-04-02T11:01:20.089960',
    updated_at: '2025-04-02T11:01:20.089963',
    sender: {
      id: 'user_123',
      username: 'AshKetchum',
      profile_picture: '/testimgs/avatars/Av5.png',
      friend_code: '1234-5678-7184-8614',
    },
    receiver: {
      id: 'user_104',
      username: 'Trainer4',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-7184-8614',
    },
    offered_card: {
      id: 'card_4',
      name: 'CardName4',
      img_url: '/testimgs/cards/Arcanin.png',
      official_id: '104/226',
      rarity: 3,
      set_id: '3',
    },
    requested_card: {
      id: 'card_14',
      name: 'CardName14',
      img_url: '/testimgs/cards/Amonistar.png',
      official_id: '114/226',
      rarity: 6,
      set_id: '1',
    },
  },
  {
    id: 'trade_5',
    sender_id: 'user_123',
    receiver_id: 'user_105',
    status: 'pending',
    is_active: false,
    sent_by_sender: false,
    sent_by_receiver: false,
    created_at: '2025-04-02T11:01:20.089981',
    updated_at: '2025-04-02T11:01:20.089984',
    sender: {
      id: 'user_123',
      username: 'AshKetchum',
      profile_picture: '/testimgs/avatars/Av1.png',
      friend_code: '1234-5678-7184-8614',
    },
    receiver: {
      id: 'user_105',
      username: 'Trainer5',
      profile_picture: '/testimgs/avatars/Av4.png',
      friend_code: '1234-5678-7184-8614',
    },
    offered_card: {
      id: 'card_5',
      name: 'CardName5',
      img_url: '/testimgs/cards/DracaufeuEx.png',
      official_id: '105/226',
      rarity: 3,
      set_id: '3',
    },
    requested_card: {
      id: 'card_15',
      name: 'CardName15',
      img_url: '/testimgs/cards/PikachuEx.png',
      official_id: '115/226',
      rarity: 6,
      set_id: '1',
    },
  },
];
