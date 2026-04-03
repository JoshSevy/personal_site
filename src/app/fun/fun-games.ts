export interface FunGameMeta {
  /** URL segment under `/fun/` */
  slug: string;
  title: string;
  tagline: string;
  /** Short label for the card */
  accent: string;
}

export const FUN_GAMES: FunGameMeta[] = [
  {
    slug: 'blogcoin-bonanza',
    title: 'BlogCoin Bonanza',
    tagline: 'Catch the gold, dodge the dumps. Satirical arcade.',
    accent: 'Amber',
  },
  {
    slug: 'reaction',
    title: 'Lightning Tap',
    tagline: 'Wait for green, then tap as fast as you can.',
    accent: 'Emerald',
  },
  {
    slug: 'syntax-quiz',
    title: 'Guess the syntax',
    tagline: 'Snippets from Supabase—curated plus community submissions.',
    accent: 'Violet',
  },
];
