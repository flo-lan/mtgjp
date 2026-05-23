export interface SrsCard {
  word: string;
  addedAt: number;
  interval: number;    // days until next review
  easeFactor: number;  // scheduling multiplier
  reps: number;        // consecutive successful reviews
  nextReview: number;  // timestamp (ms)
}

const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;
const DAY_MS = 24 * 60 * 60 * 1000;

export function newCard(word: string): SrsCard {
  return {
    word,
    addedAt: Date.now(),
    interval: 0,
    easeFactor: INITIAL_EASE,
    reps: 0,
    nextReview: Date.now(),
  };
}

export function reviewCard(card: SrsCard, rating: 'again' | 'good'): SrsCard {
  const now = Date.now();

  if (rating === 'again') {
    return {
      ...card,
      interval: 1,
      easeFactor: Math.max(MIN_EASE, card.easeFactor - 0.2),
      reps: 0,
      nextReview: now + DAY_MS,
    };
  }

  let newInterval: number;
  if (card.reps === 0) {
    newInterval = 1;
  } else if (card.reps === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(card.interval * card.easeFactor);
  }

  return {
    ...card,
    interval: newInterval,
    easeFactor: Math.min(2.5, card.easeFactor + 0.05),
    reps: card.reps + 1,
    nextReview: now + newInterval * DAY_MS,
  };
}

export function isDue(card: SrsCard): boolean {
  return card.nextReview <= Date.now();
}
