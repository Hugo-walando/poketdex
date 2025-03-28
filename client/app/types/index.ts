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
  createdAt: string;
  user: {
    id: string;
    username: string;
    profilePicture: string;
    friendCode: string;
  };
  offeredCard: CardSummary; // Carte que l’autre joueur t’offre
  requestedCard: CardSummary; // Carte que tu proposes
}

export interface CardSummary {
  id: string;
  name: string;
  imgUrl: string;
  rarity: number;
  officialId: number;
  setImage: string;
}
