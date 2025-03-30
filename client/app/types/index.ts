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

export interface MatchTrade {
  id: string;
  offered_card: Card;
  requested_card: Card;
}

export interface MatchGroup {
  user: {
    id: string;
    username: string;
    profile_picture: string;
  };
  trades: MatchTrade[];
}
