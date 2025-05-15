export const rarities = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const rarityIcons: Record<(typeof rarities)[number], string> = {
  1: '/rarities/1.png',
  2: '/rarities/2.png',
  3: '/rarities/3.png',
  4: '/rarities/4.png',
  5: '/rarities/5.png',
  6: '/rarities/6.png',
  7: '/rarities/7.png',
  8: '/rarities/8.png',
};
