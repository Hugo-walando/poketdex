export const rarities = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const rarityIcons: Record<(typeof rarities)[number], string> = {
  1: '/testimgs/rarities/1.png',
  2: '/testimgs/rarities/2.png',
  3: '/testimgs/rarities/3.png',
  4: '/testimgs/rarities/4.png',
  5: '/testimgs/rarities/5.png',
  6: '/testimgs/rarities/6.png',
  7: '/testimgs/rarities/7.png',
  8: '/testimgs/rarities/8.png',
};
