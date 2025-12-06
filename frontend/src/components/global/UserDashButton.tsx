import React from 'react';
import { useAuth } from '../../contexts/useAuth';
import { getCurrentBadge } from '../../utils/BadgeSystem';

type Props = {
  onClick?: (e: React.MouseEvent) => void;
  compact?: boolean;
  className?: string;
};

export function UserDashButton({ onClick, compact = false, className = '' }: Props) {
  const { user, userDetails } = useAuth();

  const name = user?.name ?? 'You';
  const initials = name
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Use pointsBreakdown.exp like the store page does
  const exp = (userDetails as any)?.pointsBreakdown?.exp ?? 0;
  const computedBadge = getCurrentBadge(exp);
  const title = computedBadge.title ?? 'Learner';
  const badgeIcon = computedBadge.icon ?? '📚';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open dashboard — ${title}`}
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 hover:shadow-sm transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        {!compact && <span className="font-medium">Your Dash</span>}
      </div>

      <span className="ml-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-300 truncate max-w-[8rem] flex items-center gap-1">
        <span className="text-sm">{badgeIcon}</span>
        <span>{title}</span>
      </span>
    </button>
  );
}

export default UserDashButton;
