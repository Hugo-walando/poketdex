export interface Card {
  id: string;
  name: string;
  img_url: string;
  rarity: number;
  set_id: string;
  official_id: number;
  created_at: string;
  updated_at: string;
}

export interface Set {
  id: string;
  name: string;
  color: string;
  img_url: string;
  card_count: number;
  created_at?: string;
}

export interface ListedCard {
  duplicate_id: string;
  user: {
    id: string;
    username: string;
    profile_picture: string;
  };
  card: {
    id: string;
    name: string;
    img_url: string;
    rarity: number;
    set_id: string;
    official_id: number;
  };
}

export interface WishlistCard {
  id: string;
  name: string;
  img_url: string;
}

export interface Match {
  id: string;
  status: 'pending' | 'accepted' | 'cancelled';
  created_at: string;
  user_1: {
    id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
  };
  user_2: {
    id: string;
    username: string;
    profile_picture: string;
    friend_code: string;
  };
  card_from_user_1: {
    id: string;
    name: string;
    img_url: string;
    rarity: number;
    official_id: number;
    set: {
      id: string;
      name: string;
      img_url: string;
    };
  };
  card_from_user_2: {
    id: string;
    name: string;
    img_url: string;
    rarity: number;
    official_id: number;
    set: {
      id: string;
      name: string;
      img_url: string;
    };
  };
}
