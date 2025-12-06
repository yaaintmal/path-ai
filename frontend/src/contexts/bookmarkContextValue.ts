import { createContext } from 'react';

export interface BookmarkItem {
  id: string;
  title: string;
  type: 'topic' | 'subtopic';
  addedAt: string;
}

export interface LearnedItem {
  id: string;
  title: string;
  type: 'topic' | 'subtopic';
  completedAt: string;
  score: number;
}

export interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  learnedTopics: LearnedItem[];
  loading: boolean;
  addBookmark: (topicName: string, type: 'topic' | 'subtopic') => Promise<void>;
  removeBookmark: (topicName: string) => Promise<void>;
  markAsLearned: (topicName: string, type: 'topic' | 'subtopic', score: number) => Promise<void>;
  isBookmarked: (topicName: string) => boolean;
  isLearned: (topicName: string) => boolean;
  getBookmarkType: (topicName: string) => 'topic' | 'subtopic' | null;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);
