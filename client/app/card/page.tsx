'use client';

import { useMemo, useState } from 'react';
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

import { Card, Set as CardSet } from '@/app/types';
import useRemoveWishlistCard from '../hooks/useRemoveWishlistCard';
import useRemoveListedCard from '../hooks/useRemoveListedCard';
import useRemoveMatchesByCard from '../hooks/useRemoveMatchesByCard';
import ProtectedLayout from '../components/auth/ProtectedLayout';
import TradeIcon from '../components/svgs/TradeIcon';
import { ChevronDown, ChevronRight, HeartIcon } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import { rarityIcons } from '../data/rarities';
import ShimmerCard from '../components/ui/ShimmerCard';
import { useDebounce } from 'use-debounce';
import Loader from '../components/ui/Loader';
import Footer from '../components/layout/Footer';
import { useListedCardQuantity } from '../hooks/useListedCardQuantity';
import CardsFilters from '../components/ui/CardsFilters';

export default function CardPage() {
  const { sets, cardsBySet, loadingCards } = useGlobalData();

  const listedCards = useCollectionStore((s) => s.listedCards);
  const wishlistCards = useCollectionStore((s) => s.wishlistCards);
  const [isCardImageLoaded, setCardImageLoaded] = useState(false);

  const addListedCardToStore = useCollectionStore(
    (s) => s.addListedCardToStore,
  );
  const addWishlistCardToStore = useCollectionStore(
    (s) => s.addWishlistCardToStore,
  );
  const removeWishlistCardFromStore = useCollectionStore(
    (s) => s.removeWishlistCardFromStore,
  );
  const removeListedCardFromStore = useCollectionStore(
    (s) => s.removeListedCardFromStore,
  );

  const { removeMatchesByCard } = useRemoveMatchesByCard();
  const isMobile = useIsMobile();

  const [filter, setFilter] = useState<'all' | 'listed' | 'wishlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
  const [openSetCodes, setOpenSetCodes] = useState<string[]>([]);
  const [visibleCardCount, setVisibleCardCount] = useState(30);

  const { addListedCard } = useAddListedCard();
  const { addWishlistCard } = useAddWishlistCard();

  const { removeListedCard } = useRemoveListedCard();
  const { removeWishlistCard } = useRemoveWishlistCard();

  const listedCardIds = listedCards.map((item) => item.card._id);
  const wishlistCardIds = wishlistCards.map((item) => item.card._id);

  const { incrementListedCard, decrementListedCard } = useListedCardQuantity();

  const getQuantityByCardId = useCollectionStore((s) => s.getQuantityByCardId);

  const handleIncrement = async (cardId: string) => {
    await incrementListedCard(cardId);
  };

  const handleDecrement = async (cardId: string) => {
    await decrementListedCard(cardId);
  };

  const toggleListedCard = async (cardId: string) => {
    if (listedCards.some((c) => c.card._id === cardId)) {
      await removeListedCard(cardId);
      removeListedCardFromStore(cardId);
      removeMatchesByCard(cardId);
    } else if (wishlistCards.some((c) => c.card._id === cardId)) {
      await removeWishlistCard(cardId);
      removeWishlistCardFromStore(cardId);
      const added = await addListedCard(cardId);
      if (added) {
        addListedCardToStore(added);
      }
    } else {
      const added = await addListedCard(cardId);
      if (added) {
        addListedCardToStore(added);
      }
    }
  };
  const toggleWishlistCard = async (cardId: string) => {
    if (wishlistCards.some((c) => c.card._id === cardId)) {
      await removeWishlistCard(cardId);
      removeWishlistCardFromStore(cardId);
      removeMatchesByCard(cardId);
    } else if (listedCards.some((c) => c.card._id === cardId)) {
      await removeListedCard(cardId);
      removeListedCardFromStore(cardId);
      const added = await addWishlistCard(cardId);
      if (added) {
        addWishlistCardToStore(added);
      }
    } else {
      const added = await addWishlistCard(cardId);
      if (added) {
        addWishlistCardToStore(added);
      }
    }
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedSets.length > 0 ||
      selectedRarities.length > 0 ||
      filter !== 'all'
    );
  }, [searchQuery, selectedSets, selectedRarities, filter]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSets([]);
    setSelectedRarities([]);
    setFilter('all');
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

  const countByRarity = (cards: Card[]) => {
    return cards.reduce<Record<number, number>>((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      return acc;
    }, {});
  };

  const sortSetsByReleaseDate = (
    sets: CardSet[],
    order: 'asc' | 'desc' = 'asc',
  ): CardSet[] => {
    return [...sets].sort((a, b) => {
      const aDate = new Date(a.release_date).getTime();
      const bDate = new Date(b.release_date).getTime();
      return order === 'asc' ? aDate - bDate : bDate - aDate;
    });
  };

  const listedIds = new Set(listedCards.map((c) => c.card._id));
  const wishlistIds = new Set(wishlistCards.map((c) => c.card._id));

  const filteredCards = useMemo(() => {
    return Object.entries(cardsBySet)
      .flatMap(([setCode, cards]) => {
        const set = sets.find((s) => s.code === setCode);
        if (!set) return [];

        return cards.filter((card) => {
          const matchesSearch =
            !debouncedSearchQuery ||
            matchCard(card, set, debouncedSearchQuery.toLowerCase());

          const matchesSet =
            selectedSets.length === 0 || selectedSets.includes(card.set_code);

          const matchesRarity =
            selectedRarities.length === 0 ||
            selectedRarities.includes(card.rarity);

          const matchesFilter =
            filter === 'all' ||
            (filter === 'listed' && listedIds.has(card._id)) ||
            (filter === 'wishlist' && wishlistIds.has(card._id));

          return matchesSearch && matchesSet && matchesRarity && matchesFilter;
        });
      })
      .sort((a, b) => a.official_id.localeCompare(b.official_id));
  }, [
    cardsBySet,
    sets,
    debouncedSearchQuery,
    selectedSets,
    selectedRarities,
    filter,
    listedIds,
    wishlistIds,
  ]);

  return (
    <ProtectedPage>
      <ProtectedLayout>
        <FiltersWrapper className='mt-10 mb-5 md:flex gap-6'>
          <div className='w-full md:w-[600px] mx-auto md:mx-0'>
            <SearchBar
              placeholder='Rechercher une carte...'
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <div className='w-full md:w-auto gap-4 mt-4 md:mt-0 sm:justify-start flex md:items-start  '>
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

            <CardsFilters
              listedCount={listedCards.length}
              wishlistCount={wishlistCards.length}
              filter={filter}
              setFilter={setFilter}
            />
            <ResetFilters
              onClick={resetAllFilters}
              disabled={!hasActiveFilters}
            />
          </div>
        </FiltersWrapper>

        <div className='w-full max-w-[1400px] mx-auto p-2 md:p-0'>
          <div className='mb-6 flex flex-col items-center md:items-start gap-4'>
            {/* <div className='bg-white rounded-xl shadow-base px-4 py-3 flex gap-6'>
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <TradeIcon className='w-5 h-5 fill-primarygreen' />
                <span>
                  <strong>{listedCards.length}</strong> doublon(s)
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <HeartIcon className='w-5 h-5 fill-pink-400 text-transparent' />
                <span>
                  <strong>{wishlistCards.length}</strong> carte(s) recherchée(s)
                </span>
              </div>
            </div> */}

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
              <div className='flex items-center gap-2'>
                <TradeIcon className='w-6 h-6 fill-primarygreen shrink-0' />
                <span className='text-gray-base text-sm'>
                  : Ajouter cette carte à vos{' '}
                  <strong>cartes disponibles pour échange </strong> (vos
                  doublons)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <HeartIcon className='w-6 h-6 fill-pink-400 text-transparent shrink-0' />
                <span className='text-gray-base text-sm'>
                  : Ajouter cette carte à votre <strong>wishlist</strong> (vos
                  cartes recherchées)
                </span>
              </div>
            </div>
          </div>

          {(hasActiveFilters || searchQuery) && (
            <>
              {searchQuery !== debouncedSearchQuery ? (
                <Loader />
              ) : filteredCards.length === 0 ? (
                <p className='text-center text-gray-xl'>
                  Aucune carte ne correspond aux filtres.
                </p>
              ) : selectedSets.length > 0 ? (
                selectedSets.map((setCode) => {
                  const set = sets.find((s) => s.code === setCode);
                  if (!set) return null;

                  const cardsForSet = filteredCards
                    .filter((card) => card.set_code === setCode)
                    .sort((a, b) => a.official_id.localeCompare(b.official_id));

                  if (cardsForSet.length === 0) return null;
                  console.log(set.img_url);
                  return (
                    <div key={setCode} className='mb-10'>
                      {/* ✅ Logo du set */}
                      <div className='flex items-center gap-4 mb-4'>
                        <Image
                          src={set.img_url}
                          alt={set.name}
                          width={50}
                          height={50}
                          className='w-[50px] h-auto'
                          unoptimized
                        />
                        <h2 className='text-dark-lg font-semibold'>
                          {set.name}
                        </h2>
                      </div>

                      {/* 🔽 Cartes du set */}
                      <div className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                        {cardsForSet.map((card) => (
                          <div
                            className='flex flex-col items-center gap-2'
                            key={card._id}
                          >
                            <div
                              key={card.official_id}
                              className='justify-self-center relative '
                            >
                              <div className='absolute top-1 right-1 rounded-full bg-white/90 backdrop-blur-lg px-2 py-1 shadow-base flex flex-col items-center justify-center text-light-sm'>
                                #{card.official_id}
                              </div>
                              {!isCardImageLoaded && (
                                <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10' />
                              )}
                              {card.img_url ? (
                                <Image
                                  src={card.img_url}
                                  alt={card.name || 'Carte'}
                                  width={0}
                                  height={0}
                                  sizes='100vw'
                                  className='w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base mx-auto'
                                  onLoad={() => setCardImageLoaded(true)}
                                  priority={true}
                                />
                              ) : (
                                <div className='w-[120px] h-[180px] bg-gray-200 rounded shadow-base mx-auto flex items-center justify-center text-sm text-gray-500'>
                                  Image manquante
                                </div>
                              )}

                              <CardSelector
                                cardId={card._id}
                                quantity={getQuantityByCardId(card._id)}
                                increment={() => handleIncrement(card._id)}
                                decrement={() => handleDecrement(card._id)}
                                isListed={listedCardIds.includes(card._id)}
                                isWishlisted={wishlistCardIds.includes(
                                  card._id,
                                )}
                                toggleListedCard={() =>
                                  toggleListedCard(card._id)
                                }
                                toggleWishlistCard={() =>
                                  toggleWishlistCard(card._id)
                                }
                              />
                            </div>
                            <Image
                              src={
                                rarityIcons[
                                  card.rarity as keyof typeof rarityIcons
                                ]
                              }
                              alt={`Rareté`}
                              width={0}
                              height={0}
                              sizes='100vw'
                              className='h-8 lg:h-10 w-auto object-contain'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                  {filteredCards.slice(0, visibleCardCount).map((card) => (
                    <div
                      className='flex flex-col items-center gap-2'
                      key={card._id}
                    >
                      <div
                        key={card.official_id}
                        className='justify-self-center relative '
                      >
                        <div className='absolute top-1 right-1 rounded-full bg-white/90 backdrop-blur-lg px-2 py-1 shadow-base flex flex-col items-center justify-center text-light-sm'>
                          #{card.official_id}
                        </div>
                        {!isCardImageLoaded && (
                          <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10' />
                        )}
                        {card.img_url ? (
                          <Image
                            src={card.img_url}
                            alt={card.name || 'Carte'}
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base mx-auto'
                            onLoad={() => setCardImageLoaded(true)}
                            priority={true}
                          />
                        ) : (
                          <div className='w-[120px] h-[180px] bg-gray-200 rounded shadow-base mx-auto flex items-center justify-center text-sm text-gray-500'>
                            Image manquante
                          </div>
                        )}

                        <CardSelector
                          cardId={card._id}
                          quantity={getQuantityByCardId(card._id)}
                          increment={() => handleIncrement(card._id)}
                          decrement={() => handleDecrement(card._id)}
                          isListed={listedCardIds.includes(card._id)}
                          isWishlisted={wishlistCardIds.includes(card._id)}
                          toggleListedCard={() => toggleListedCard(card._id)}
                          toggleWishlistCard={() =>
                            toggleWishlistCard(card._id)
                          }
                        />
                      </div>
                      <Image
                        src={
                          rarityIcons[card.rarity as keyof typeof rarityIcons]
                        }
                        alt={`Rareté`}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-8 lg:h-10 w-auto object-contain'
                      />
                    </div>
                  ))}

                  {filteredCards.length > visibleCardCount && (
                    <div className='text-center mt-4 col-span-full'>
                      <button
                        onClick={() => setVisibleCardCount((prev) => prev + 15)}
                        className='px-4 py-2 bg-primarygreen text-white rounded-lg hover:bg-primarygreen/80 transition'
                      >
                        Charger plus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!searchQuery &&
            !hasActiveFilters &&
            sortSetsByReleaseDate(sets).map((set: CardSet) => {
              const cards = cardsBySet[set.code]
                ?.filter(
                  (card: Card) =>
                    matchCard(card, set, searchQuery) &&
                    (selectedSets.length === 0 ||
                      selectedSets.includes(card.set_code)) &&
                    (selectedRarities.length === 0 ||
                      selectedRarities.includes(card.rarity)),
                )
                ?.sort((a, b) => a.official_id.localeCompare(b.official_id));

              if (!cards || cards.length === 0) return null;

              const listedBySet = listedCards
                .filter((c) => c.card.set_code === set.code)
                .map((c) => c.card);
              const wishlistBySet = wishlistCards
                .filter((c) => c.card.set_code === set.code)
                .map((c) => c.card);

              const listedCount = countByRarity(listedBySet);
              const wishlistCount = countByRarity(wishlistBySet);

              const isOpen = openSetCodes.includes(set.code);

              return (
                <section key={set.code} className='mb-2 '>
                  <div
                    className='flex items-center justify-center mx-auto md:justify-start w-full bg-white rounded-xl p-3 shadow-base gap-3 mb-6 md:w-max  hover:cursor-pointer hover:bg-gray-100 transition-all sticky top-0 z-10'
                    onClick={() =>
                      setOpenSetCodes((prev) =>
                        prev.includes(set.code)
                          ? prev.filter((c) => c !== set.code)
                          : [...prev, set.code],
                      )
                    }
                  >
                    <Image
                      src={set.img_url}
                      alt={set.name}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='w-auto h-[50px]'
                    />
                    <span className='text-dark-base md:text-dark-lg min-w-[90px]'>
                      {set.card_count} cartes
                    </span>
                    {!isMobile && (
                      <div className='flex flex-col gap-2 text-gray-lg'>
                        {/* Icone Listed */}
                        <div className='flex items-center justify-center gap-2'>
                          <div className='flex items-center justify-center'>
                            <TradeIcon className='w-6 h-6 fill-primarygreen' />
                          </div>

                          {[1, 2, 3, 4, 5].map((rarity) => (
                            <div
                              key={`row-listed-${rarity}`}
                              className='flex items-center gap-1 bg-gray-100 px-2 py-2 rounded-md'
                            >
                              <Image
                                src={`/rarities/${rarity}.png`}
                                alt={`Rareté ${rarity}`}
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='object-contain w-auto h-[25px]'
                              />
                              <span className='font-medium min-w-[35px] max-w-[35px]  text-center'>
                                {listedCount[rarity] || 0}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Icone Wishlist */}
                        <div className='flex items-center justify-center gap-2'>
                          <div className='flex items-center justify-center'>
                            <HeartIcon className='w-6 h-6 fill-pink-400 text-transparent' />
                          </div>

                          {[1, 2, 3, 4, 5].map((rarity) => (
                            <div
                              key={`row-wishlist-${rarity}`}
                              className='flex items-center gap-1 bg-gray-100 px-2 py-2 rounded-md'
                            >
                              <Image
                                src={`/rarities/${rarity}.png`}
                                alt={`Rareté ${rarity}`}
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='object-contain w-auto h-[25px]'
                              />
                              <span className='font-medium min-w-[35px] max-w-[35px] text-center'>
                                {wishlistCount[rarity] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isOpen ? (
                      <ChevronDown className='w-5 h-5' />
                    ) : (
                      <ChevronRight className='w-5 h-5' />
                    )}
                  </div>
                  {isOpen && (
                    <>
                      {isMobile && (
                        <div className='text-gray-base grid grid-cols-1 gap-2 mb-4 sticky top-22 z-10'>
                          {/* Listed cards */}
                          {Object.values(listedCount).some(
                            (count) => count > 0,
                          ) && (
                            <div className='flex items-center gap-1 flex-wrap'>
                              <TradeIcon className='w-6 h-6 fill-primarygreen' />
                              {Object.entries(listedCount)
                                .filter(([, count]) => count > 0)
                                .map(([rarity, count]) => (
                                  <div
                                    key={`row-listed-${rarity}`}
                                    className='flex items-center gap-1 bg-gray-200 px-1 py-2 rounded-md'
                                  >
                                    <Image
                                      src={`/rarities/${rarity}.png`}
                                      alt={`Rareté ${rarity}`}
                                      width={0}
                                      height={0}
                                      sizes='100vw'
                                      className='object-contain w-auto h-[14px]'
                                    />
                                    <span className='font-medium text-sm min-w-[30px] max-w-[35px] text-center'>
                                      {count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* Wishlist cards */}
                          {Object.values(wishlistCount).some(
                            (count) => count > 0,
                          ) && (
                            <div className='flex items-center gap-1 flex-wrap'>
                              <HeartIcon className='w-6 h-6 fill-pink-400 text-transparent' />
                              {Object.entries(wishlistCount)
                                .filter(([, count]) => count > 0)
                                .map(([rarity, count]) => (
                                  <div
                                    key={`row-wishlist-${rarity}`}
                                    className='flex items-center gap-1 bg-gray-200 px-1 py-2 rounded-md'
                                  >
                                    <Image
                                      src={`/rarities/${rarity}.png`}
                                      alt={`Rareté ${rarity}`}
                                      width={0}
                                      height={0}
                                      sizes='100vw'
                                      className='object-contain w-auto h-[14px]'
                                    />
                                    <span className='font-medium text-sm min-w-[30px] max-w-[35px] text-center'>
                                      {count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className='grid gap-6 justify-center grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(130px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] xl:grid-cols-8'>
                        {loadingCards ? (
                          <>
                            {Array.from({ length: 30 }).map((_, idx) => (
                              <ShimmerCard key={idx} />
                            ))}
                          </>
                        ) : (
                          cards.map((card: Card) => (
                            <div
                              className='flex flex-col items-center gap-2'
                              key={card._id}
                            >
                              <div
                                key={card.official_id}
                                className='justify-self-center relative '
                              >
                                <div className='absolute top-1 right-1 rounded-full bg-white/90 backdrop-blur-lg px-2 py-1 shadow-base flex flex-col items-center justify-center text-light-sm'>
                                  #{card.official_id}
                                </div>
                                {!isCardImageLoaded && (
                                  <div className='absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10' />
                                )}
                                {card.img_url ? (
                                  <Image
                                    src={card.img_url}
                                    alt={card.name || 'Carte'}
                                    width={0}
                                    height={0}
                                    sizes='100vw'
                                    className='w-[120px] sm:w-[130px] md:w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px] h-auto rounded-md shadow-base mx-auto'
                                    onLoad={() => setCardImageLoaded(true)}
                                    priority={true}
                                  />
                                ) : (
                                  <div className='w-[120px] h-[180px] bg-gray-200 rounded shadow-base mx-auto flex items-center justify-center text-sm text-gray-500'>
                                    Image manquante
                                  </div>
                                )}

                                <CardSelector
                                  cardId={card._id}
                                  quantity={getQuantityByCardId(card._id)}
                                  increment={() => handleIncrement(card._id)}
                                  decrement={() => handleDecrement(card._id)}
                                  isListed={listedCardIds.includes(card._id)}
                                  isWishlisted={wishlistCardIds.includes(
                                    card._id,
                                  )}
                                  toggleListedCard={() =>
                                    toggleListedCard(card._id)
                                  }
                                  toggleWishlistCard={() =>
                                    toggleWishlistCard(card._id)
                                  }
                                />
                              </div>
                              <Image
                                src={
                                  rarityIcons[
                                    card.rarity as keyof typeof rarityIcons
                                  ]
                                }
                                alt={`Rareté`}
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='h-8 lg:h-10 w-auto object-contain'
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </section>
              );
            })}
        </div>
        <Footer />
      </ProtectedLayout>
    </ProtectedPage>
  );
}
