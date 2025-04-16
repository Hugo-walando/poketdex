'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import CardSelector from '@/app/components/ui/CardSelector';
import SearchBar from '@/app/components/ui/SearchBar';
import SetFilterDropdown from '@/app/components/ui/SetFilterDropDown';
import RarityFilter from '@/app/components/ui/RarityFilter';
import ResetFilters from '@/app/components/ui/ResetFilters';
import FiltersWrapper from '@/app/components/layout/FiltersWrapper';
import ProtectedPage from '@/app/components/auth/ProtectedPage';

import { useGlobalData } from '@/app/store/useGlobalData';
import { useCollectionStore } from '@/app/store/useCollectionStore';

import useAddListedCard from '@/app/hooks/useAddListedCard';
import useAddWishlistCard from '@/app/hooks/useAddWishlistCard';

import { FilterDropdownProvider } from '@/app/context/FilterContext';
import { matchCard } from '@/app/utils/matchCards';

import { Card, Set } from '@/app/types';
import useRemoveWishlistCard from '../hooks/useRemoveWishlistCard';
import useRemoveListedCard from '../hooks/useRemoveListedCard';

export default function CardPage() {
  const sets = useGlobalData((s) => s.sets);
  const cardsBySet = useGlobalData((s) => s.cardsBySet);

  const listedCards = useCollectionStore((s) => s.listedCards);
  const wishlistCards = useCollectionStore((s) => s.wishlistCards);
  const addListedCardToStore = useCollectionStore(
    (s) => s.addListedCardToStore,
  );
  const addWishlistCardToStore = useCollectionStore(
    (s) => s.addWishlistCardToStore,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  const { addListedCard } = useAddListedCard();
  const { addWishlistCard } = useAddWishlistCard();

  const { removeListedCard } = useRemoveListedCard();
  const { removeWishlistCard } = useRemoveWishlistCard();

  // Extraire les ID pour `CardSelector`
  const listedCardIds = listedCards.map((item) => item.card.official_id);
  const wishlistCardIds = wishlistCards.map((item) => item.card.official_id);

  const toggleListedCard = async (officialId: string, cardId: string) => {
    console.log('🟢 toggleWishlistCard appelé avec :', { officialId, cardId });

    if (!listedCardIds.includes(officialId)) {
      const added = await addListedCard(cardId);
      if (added) {
        addListedCardToStore(added);
        console.log('➕ Ajout au store de :', added);
      } else {
        await removeListedCard(cardId);
        console.log('❌ Déjà présent dans les cartes listées → skip');
      }
    }
  };

  const toggleWishlistCard = async (officialId: string, cardId: string) => {
    console.log('🟢 toggleListedCard appelé avec :', { officialId, cardId });

    if (!wishlistCardIds.includes(officialId)) {
      const added = await addWishlistCard(cardId);
      if (added) {
        addWishlistCardToStore(added);
        console.log('➕ Ajout au store de :', added);
      } else {
        await removeWishlistCard(cardId);
        console.log('❌ Déjà présent dans wishlist → skip');
      }
    }
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedSets.length > 0 ||
      selectedRarities.length > 0
    );
  }, [searchQuery, selectedSets, selectedRarities]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSets([]);
    setSelectedRarities([]);
  };

  const toggleSet = (setId: string) => {
    setSelectedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId],
    );
  };

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity],
    );
  };

  useEffect(() => {
    console.log('Wishlist cards:', wishlistCards);
    Object.entries(cardsBySet).forEach(([set, cards]) => {
      console.log(`Set ${set} a ${cards.length} cartes`);
      console.log(cards.map((c) => c._id));
    });
  }, [wishlistCards, cardsBySet]);

  return (
    <ProtectedPage>
      <FiltersWrapper className='my-10 md:flex gap-6'>
        <div className='w-full md:w-[600px] mx-auto md:mx-0'>
          <SearchBar
            placeholder='Rechercher une carte...'
            onSearch={(query) => setSearchQuery(query.toLowerCase())}
          />
        </div>
        <div className='w-full md:w-auto gap-4 mt-4 md:mt-0 sm:justify-start flex'>
          <FilterDropdownProvider>
            {sets.length > 0 && (
              <SetFilterDropdown
                selectedSets={selectedSets}
                onToggleSet={toggleSet}
                sets={sets}
              />
            )}
            <RarityFilter
              selectedRarities={selectedRarities}
              onToggleRarity={toggleRarity}
            />
          </FilterDropdownProvider>
          <ResetFilters
            onClick={resetAllFilters}
            disabled={!hasActiveFilters}
          />
        </div>
      </FiltersWrapper>

      <div className='w-full max-w-[1400px] mx-auto p-2 md:p-0'>
        {sets.map((set: Set) => {
          const cards = cardsBySet[set.code]?.filter(
            (card: Card) =>
              matchCard(card, set, searchQuery) &&
              (selectedSets.length === 0 ||
                selectedSets.includes(card.set_code)) &&
              (selectedRarities.length === 0 ||
                selectedRarities.includes(card.rarity)),
          );

          if (!cards || cards.length === 0) return null;

          return (
            <section key={set.code} className='mb-12'>
              <div className='flex items-center justify-center md:justify-start w-full md:bg-white md:rounded-xl md:p-3 md:shadow-base gap-3 mb-6 md:w-max'>
                <Image
                  src={set.img_url}
                  alt={set.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='w-auto h-[50px]'
                />
                <span className='font-medium text-lg'>{set.name}</span>
              </div>

              <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                {cards.map((card: Card) => (
                  <div
                    key={card.official_id}
                    className='justify-self-center relative'
                  >
                    {card.img_url ? (
                      <Image
                        src={card.img_url}
                        alt={card.name || 'Carte'}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base mx-auto'
                      />
                    ) : (
                      <div className='w-[120px] h-[180px] bg-gray-200 rounded shadow-base mx-auto flex items-center justify-center text-sm text-gray-500'>
                        Image manquante
                      </div>
                    )}

                    <CardSelector
                      cardId={card.official_id}
                      listedCardIds={listedCardIds}
                      wishlistCardIds={wishlistCardIds}
                      toggleListedCard={() =>
                        toggleListedCard(card.official_id, card._id)
                      }
                      toggleWishlistCard={() =>
                        toggleWishlistCard(card.official_id, card._id)
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </ProtectedPage>
  );
}
