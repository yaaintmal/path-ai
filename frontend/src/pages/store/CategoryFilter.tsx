import { Star, Sparkles, Gift, ShoppingCart } from 'lucide-react';
import type { StoreItem } from './types';

interface CategoryFilterProps {
  selectedCategory: 'all' | StoreItem['category'];
  onCategoryChange: (category: 'all' | StoreItem['category']) => void;
}

const CATEGORY_ICONS: Record<StoreItem['category'], React.ReactNode> = {
  badge: <Star className="w-4 h-4" />,
  theme: <Sparkles className="w-4 h-4" />,
  boost: <Gift className="w-4 h-4" />,
  cosmetic: <ShoppingCart className="w-4 h-4" />,
};

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-purple-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400'
        }`}
      >
        All
      </button>
      {(['cosmetic', 'badge', 'theme', 'boost'] as const).map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedCategory === cat
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400'
          }`}
        >
          {CATEGORY_ICONS[cat]}
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
