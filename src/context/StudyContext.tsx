import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { SrsCard, newCard, reviewCard, isDue } from '../utils/srs';
import { loadStudyList, saveStudyList } from '../utils/storage';

interface StudyContextValue {
  cards: SrsCard[];
  dueCards: SrsCard[];
  addWord: (word: string) => void;
  removeWord: (word: string) => void;
  reviewWord: (word: string, rating: 'again' | 'good') => void;
  hasWord: (word: string) => boolean;
  isLoaded: boolean;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadStudyList().then(loaded => {
      setCards(loaded);
      setIsLoaded(true);
    });
  }, []);

  const addWord = useCallback((word: string) => {
    setCards(prev => {
      if (prev.some(c => c.word === word)) return prev;
      const next = [...prev, newCard(word)];
      saveStudyList(next);
      return next;
    });
  }, []);

  const removeWord = useCallback((word: string) => {
    setCards(prev => {
      const next = prev.filter(c => c.word !== word);
      saveStudyList(next);
      return next;
    });
  }, []);

  const reviewWord = useCallback((word: string, rating: 'again' | 'good') => {
    setCards(prev => {
      const next = prev.map(c => (c.word === word ? reviewCard(c, rating) : c));
      saveStudyList(next);
      return next;
    });
  }, []);

  const hasWord = useCallback(
    (word: string) => cards.some(c => c.word === word),
    [cards],
  );

  const dueCards = cards.filter(isDue);

  return (
    <StudyContext.Provider
      value={{ cards, dueCards, addWord, removeWord, reviewWord, hasWord, isLoaded }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
}
