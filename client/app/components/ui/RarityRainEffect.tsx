'use client';

import { useEffect, useRef } from 'react';

const rarityLevels = [1, 5, 8];

function getRandomRarity() {
  return rarityLevels[Math.floor(Math.random() * rarityLevels.length)];
}

function getRandomDepth() {
  return 0.2 + Math.random() * 0.5;
}

function getRandomRotation() {
  return Math.floor(Math.random() * 60) - 30;
}

function getRandomLeft() {
  return Math.random() * 100;
}

export default function RarityRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spawnDrop = () => {
    if (!containerRef.current || document.visibilityState !== 'visible') return;

    const wrapper = document.createElement('div');
    const img = document.createElement('img');

    const rarity = getRandomRarity();
    const depth = getRandomDepth();
    const size = 20 + (1 - depth) * 60;
    const rotation = getRandomRotation();
    const fallDuration = 6 + depth * 4;

    wrapper.style.position = 'absolute';
    wrapper.style.top = '-60px';
    wrapper.style.left = `${getRandomLeft()}%`;
    wrapper.dataset.depth = depth.toString();
    wrapper.style.willChange = 'transform';
    wrapper.className = 'rarity-wrapper';

    img.src = `/rarities/${rarity}.png`;
    img.style.width = `${size}px`;
    img.style.filter = `blur(${4 * depth}px)`;
    img.style.opacity = `${0.6 + (1 - depth) * 0.6}`;
    img.style.zIndex = '0';
    img.style.transition = `transform ${fallDuration}s linear`;
    img.style.transform = `rotate(${rotation}deg)`;

    wrapper.appendChild(img);
    containerRef.current.appendChild(wrapper);

    requestAnimationFrame(() => {
      img.style.transform = `translateY(120vh) rotate(${rotation}deg)`;
    });

    setTimeout(() => wrapper.remove(), 14000);
  };

  useEffect(() => {
    const startSpawning = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(spawnDrop, 400);
      }
    };

    const stopSpawning = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startSpawning();
      } else {
        stopSpawning();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startSpawning();

    return () => {
      stopSpawning();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const wrappers = containerRef.current?.querySelectorAll(
        '.rarity-wrapper',
      ) as NodeListOf<HTMLElement>;

      wrappers.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '0.5');
        const scrollFactor = 1 - depth;
        el.style.transform = `translateY(${scrollY * scrollFactor * 0.3}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 overflow-hidden pointer-events-none z-[-10]'
    />
  );
}
