export interface Card {
  _id: string;
  name: string;
  img_url: string;
  rarity: number;
  set_code: string;
  official_id: string;
  created_at: string;
  updated_at: string;
}

export interface Set {
  id: string;
  code: string;
  name: string;
  color: string;
  card_count: number;
  img_url: string;
  created_at?: string;
}

export interface ListedCard {
  _id: string;
  user: User;
  card: Card;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistCard {
  _id: string;
  user: User;
  card: Card;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  _id: string;
  user_1: {
    _id: string;
    name: string;
    email: string;
    image: string;
    emailVerified: string | null;
    friend_code: string;
    updatedAt: string;
    username: string;
    role: 'user' | 'admin';
    is_connected: boolean;
  };
  user_2: {
    _id: string;
    name: string;
    email: string;
    image: string;
    emailVerified: string | null;
    friend_code: string;
    updatedAt: string;
    username: string;
    role: 'user' | 'admin';
    is_connected: boolean;
  };
  card_offered_by_user_1: {
    _id: string;
    official_id: string;
    name: string;
    img_url: string;
    rarity: number;
    set_code: string;
  };
  card_offered_by_user_2: {
    _id: string;
    official_id: string;
    name: string;
    img_url: string;
    rarity: number;
    set_code: string;
  };
  status: 'pending' | 'accepted' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface MatchTrade {
  id: string;
  offered_card: {
    _id: string;
    official_id: string;
    name: string;
    img_url: string;
    rarity: number;
    set_code: string;
  };
  requested_card: {
    _id: string;
    official_id: string;
    name: string;
    img_url: string;
    rarity: number;
    set_code: string;
  };
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
}

export interface MatchGroup {
  user: {
    id: string;
    username: string;
    profile_picture: string;
  };
  trades: MatchTrade[];
}

export interface TradeRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  is_active: boolean;
  sent_by_sender: boolean;
  sent_by_receiver: boolean;
  created_at: string;
  updated_at: string;

  sender: {
    id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
  };
  receiver: {
    id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
  };

  offered_card: {
    id: string;
    name: string;
    img_url: string;
    official_id: string;
    rarity: number;
    set_id: string;
  };

  requested_card: {
    id: string;
    name: string;
    img_url: string;
    official_id: string;
    rarity: number;
    set_id: string;
  };
}

export interface User {
  id: string;
  username: string;
  profile_picture: string;
  friend_code: string;
}
