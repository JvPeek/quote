import type { QuoteStyle } from '~/types/index.js';

export const styles: QuoteStyle[] = [
  {
    name: 'style-moody',
    backgroundImage: '/portrait.avif',
    backgroundVideo: { src: '/smoke.webm', loop: true },
  },
  {
    name: 'style-minecraft',
    backgroundImage: '/creeper.avif',
    backgroundVideo: { src: '/smoke.webm', loop: true },
    eligible: true,
    check: (quote) => {
      const lower = quote.text.toLowerCase();
      return [
        'axe',
        'axt',
        'biom',
        'craft',
        'creeper',
        'herstell',
        'mine',
        'pickaxe',
        'redstone',
        'schwert',
        'skeleton',
        'skelett',
        'spitzhacke',
        'sword',
        'zombie',
      ].some((search) => lower.includes(search));
    },
  },
  {
    name: 'style-newspaper',
    backgroundVideo: { src: '/newspaper.webm' },
    sound: { src: '/newspaper.opus' },
    eligible: true,
    check: (quote) => {
      const lower = quote.text.toLowerCase();
      return ['neuigkeit', 'news', 'paper', 'titel', 'überschrift', 'zeitung'].some((search) => lower.includes(search));
    },
  },
  {
    name: 'style-train',
    backgroundVideo: { src: '/train.webm', loop: true },
    foregroundImage: '/i-like.svg',
    sound: { src: '/train.opus' },
    check: (quote) => {
      const lower = quote.text.toLowerCase();
      return ['cargo', 'bahn', 'gleis', 'track', 'train', 'zug', 'züge'].some((search) => lower.includes(search));
    },
  },
  {
    name: 'style-nyan',
    backgroundVideo: { src: '/nyan-stars.webm', loop: true },
    foregroundImage: '/nyan-cat.gif',
    sound: { src: '/nyan.opus', loop: true },
    check: (quote) => {
      const lower = quote.text.toLowerCase();
      return ['cat', 'kätzchen', 'katze', 'kitten', 'kitty', 'nyan'].some((search) => lower.includes(search));
    },
  },
];
