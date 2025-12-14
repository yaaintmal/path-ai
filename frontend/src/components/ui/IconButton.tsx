import React from 'react';

export function IconButton({
  children,
  ariaLabel,
  title,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={`w-12 h-12 rounded-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 motion-safe:transform-gpu filter grayscale-[69%] hover:grayscale-0 hover:brightness-105 hover:scale-105 transition-all duration-150 ${className}`}
    >
      <span className="inline-flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-150">
        {children}
      </span>
    </button>
  );
}

export default IconButton;
