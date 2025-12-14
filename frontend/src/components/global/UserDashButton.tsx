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

  const role = userDetails?.onboardingData?.role;
  let roleColorClass = '';
  if (role === 'student') {
    roleColorClass =
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  } else if (role === 'pupil') {
    roleColorClass =
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
  } else if (role === 'teacher') {
    roleColorClass =
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open dashboard — ${title}`}
      className={`flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-1 text-sm text-foreground hover:shadow-sm transition dark:border-border dark:bg-card dark:text-foreground ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-input-background dark:bg-input/30 text-muted-foreground dark:text-muted-foreground flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        {!compact && <span className="font-medium">Your Dash</span>}
      </div>

      <span className="ml-2 text-xs bg-card-foreground/5 dark:bg-card-foreground/10 border border-border dark:border-border rounded-full px-2 py-0.5 text-muted-foreground dark:text-muted-foreground truncate max-w-[8rem] flex items-center gap-1">
        <span className="text-sm">{badgeIcon}</span>
        <span>{title}</span>
      </span>

      {role && roleColorClass && (
        <span
          className={`ml-1 text-xs border rounded-full w-6 h-6 flex items-center justify-center font-bold ${roleColorClass}`}
          title={role}
        >
          S
        </span>
      )}
    </button>
  );
}

export default UserDashButton;
