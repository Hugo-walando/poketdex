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
  _id: string;
  code: string;
  name: string;
  color: string;
  card_count: number;
  img_url: string;
  created_at?: string;
}

export interface ListedCard {
  _id: string;
  user: AppUser;
  card: Card;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistCard {
  _id: string;
  user: AppUser;
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
    profile_picture: string;
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
    profile_picture: string;
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
  _id: string;
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
    _id: string;
    username: string;
    profile_picture: string;
  };
  trades: MatchTrade[];
}

export interface TradeRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
    trade_count: number;
  };
  receiver: {
    _id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
    trade_count: number;
  };
  card_offered: {
    _id: string;
    name: string;
    img_url: string;
    official_id: string;
    rarity: number;
    set_code: string;
  };
  card_requested: {
    _id: string;
    name: string;
    img_url: string;
    official_id: string;
    rarity: number;
    set_code: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  is_active: boolean;
  completed: boolean;
  sent_by_sender: boolean;
  sent_by_receiver: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TradeGroup {
  user: {
    _id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
    trade_count: number;
  };
  trades: TradeRequest[];
}

export interface AppUser {
  _id: string;
  username: string;
  profile_picture: string;
  wishlist_cards?: WishlistCard[];
  friend_code: string;
  trade_count: number;
}
