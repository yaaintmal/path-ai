import { Coins, ShoppingCart } from 'lucide-react';
import type { StoreItem } from './types';
import { RARITY_COLORS, RARITY_LABELS, RARITY_BADGE_COLORS } from './constants';

interface StoreItemCardProps {
  item: StoreItem;
  canAfford: boolean;
  isPurchasing: boolean;
  onPurchase: (item: StoreItem) => Promise<void>;
}

export function StoreItemCard({ item, canAfford, isPurchasing, onPurchase }: StoreItemCardProps) {
  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all hover:shadow-lg hover:scale-[1.02] ${RARITY_COLORS[item.rarity]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{item.icon}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${RARITY_BADGE_COLORS[item.rarity]}`}
        >
          {RARITY_LABELS[item.rarity]}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{item.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-xl font-bold text-foreground">{item.cost.toLocaleString()}</span>
        </div>
        <button
          onClick={() => onPurchase(item)}
          disabled={isPurchasing || !canAfford}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            canAfford
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-muted-foreground dark:text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isPurchasing ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          {isPurchasing ? 'Kaufe...' : 'Kaufen'}
        </button>
      </div>
    </div>
  );
}
