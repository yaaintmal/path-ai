import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { ReactNode } from 'react';
import { getApiUrl } from '../config/app.config';
import { BookmarkContext } from './bookmarkContextValue';
import type { BookmarkItem, LearnedItem } from './bookmarkContextValue';

// Note: types for Bookmark context are located in `bookmarkContextValue.ts`

// BookmarkContext is defined in `bookmarkContextValue.ts` to avoid exporting non-component items

interface BookmarkProviderProps {
  children: ReactNode;
}

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  // We keep implementation identical to prior code in AuthContext.tsx but scoped to this file
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [learnedTopics, setLearnedTopics] = useState<LearnedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      setLoading(true);
      try {
        const bookmarksRes = await fetch(getApiUrl('/api/users/bookmarks'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookmarksRes.ok) {
          const data = await bookmarksRes.json();
          setBookmarks(data.bookmarks || []);
        }

        const learnedRes = await fetch(getApiUrl('/api/users/learned-topics'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (learnedRes.ok) {
          const data = await learnedRes.json();
          setLearnedTopics(data.learnedTopics || []);
        }
      } catch (err) {
        console.error('Error fetching user data (bookmarks/learned):', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addBookmark = async (topicName: string, type: 'topic' | 'subtopic' = 'topic') => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/api/users/bookmarks'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topicName, type }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      } else {
        const errorData = await res.json();
        console.error('Error adding bookmark:', res.status, errorData);
      }
    } catch (err) {
      console.error('Error adding bookmark:', err);
    }
  };

  const removeBookmark = async (topicName: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/api/users/bookmarks'), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topicName }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      } else {
        const errorData = await res.json();
        console.error('Error removing bookmark:', res.status, errorData);
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  const markAsLearned = async (topicName: string, type: 'topic' | 'subtopic', score: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/api/users/learned-topics'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topicName, type, score }),
      });
      if (res.ok) {
        const data = await res.json();
        setLearnedTopics(data.learnedTopics || []);
        setBookmarks(data.bookmarks || []);
      } else {
        const errorData = await res.json();
        console.error('Error marking as learned:', res.status, errorData);
      }
    } catch (err) {
      console.error('Error marking as learned:', err);
    }
  };

  const isBookmarked = (topicName: string) => {
    return bookmarks.some((b) => b.title === topicName);
  };

  const isLearned = (topicName: string) => {
    return learnedTopics.some((t) => t.title === topicName);
  };

  const getBookmarkType = (topicName: string): 'topic' | 'subtopic' | null => {
    const bookmark = bookmarks.find((b) => b.title === topicName);
    return bookmark?.type || null;
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        learnedTopics,
        loading,
        addBookmark,
        removeBookmark,
        markAsLearned,
        isBookmarked,
        isLearned,
        getBookmarkType,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
