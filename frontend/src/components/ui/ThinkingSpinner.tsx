import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import thinkingMessagesData from '../../data/thinkingMessages.json';

const allThinkingMessages = [
  ...thinkingMessagesData.rpgFantasy,
  ...thinkingMessagesData.sportsRacing,
  ...thinkingMessagesData.strategy,
];

interface ThinkingSpinnerProps {
  message?: string;
  showIcon?: boolean;
}

export function ThinkingSpinner({ message, showIcon = true }: ThinkingSpinnerProps) {
  const getRandomMessage = () =>
    allThinkingMessages[Math.floor(Math.random() * allThinkingMessages.length)];

  const [displayMessage, setDisplayMessage] = useState<string>(() => message || getRandomMessage());

  useEffect(() => {
    if (!message) {
      // Change thinking message every 2 seconds
      const interval = setInterval(() => {
        setDisplayMessage(getRandomMessage());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {showIcon && (
        <div className="mb-4 relative">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
          <Sparkles className="w-4 h-4 text-purple-600 absolute top-1 right-1 animate-spin" />
        </div>
      )}
      <p className="text-sm text-muted-foreground text-center max-w-xs h-8 flex items-center">
        {displayMessage}
      </p>
    </div>
  );
}
