/**
 * Seed script for StoreItem collection
 * Ensures SKU-based items are created to match frontend store items
 */

import '../src/db';
import { StoreItem } from '../src/models';

const storeItems = [
  {
    sku: '1',
    name: 'Custom Profile Frame',
    description: 'Style your profile frame with a custom glance.',
    price: 5000,
    category: 'cosmetic',
  },
  {
    sku: '2',
    name: 'Blinking Badge Border',
    description: 'Lässt Deinen Badge-Status blinken',
    price: 10000,
    category: 'theme',
  },
  {
    sku: '3',
    name: 'Double XP Boost (24h)',
    description: '2x EXP for 24 Stunden',
    price: 2500,
    category: 'boost',
  },
  {
    sku: '4',
    name: 'Golden Badge',
    description: 'Show off your achievement with a golden badge',
    price: 50000,
    category: 'badge',
  },
  {
    sku: '5',
    name: 'Rainbow Trail',
    description: 'Rainbox trail effect when leveling up',
    price: 30000,
    category: 'cosmetic',
  },
  {
    sku: '6',
    name: 'Streak Shield',
    description: 'Schützt deinen Streak für einen Tag',
    price: 5000,
    category: 'boost',
  },
  {
    sku: '7',
    name: 'Legendary Crown',
    description: 'the legendary crown of wisdom',
    price: 100000,
    category: 'cosmetic',
  },
  {
    sku: '8',
    name: 'Confetti Celebration',
    description: 'confetti effect on level up',
    price: 8000,
    category: 'cosmetic',
  },
  {
    sku: '9',
    name: 'CB2077 Overloaded',
    description: 'Unlocks the CB2077 - Mode',
    price: 77000,
    category: 'theme',
  },
  {
    sku: '10',
    name: 'Quad XP Boost (48h)',
    description: '4x EXP for 48 hours',
    price: 7500,
    category: 'boost',
  },
  {
    sku: '11',
    name: 'Star Badge',
    description: 'only tradeable for 3 golden badges',
    price: 0,
    category: 'badge',
  },
];

async function seed() {
  try {
    console.log('[Seed] Starting StoreItem seeding...');

    // Upsert each item by SKU
    for (const item of storeItems) {
      const existing = await StoreItem.findOne({ sku: item.sku });
      if (existing) {
        console.log(`[Seed] SKU ${item.sku} already exists, skipping`);
      } else {
        await StoreItem.create(item);
        console.log(`[Seed] Created SKU ${item.sku}: ${item.name}`);
      }
    }

    console.log('[Seed] StoreItem seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding StoreItems:', err);
    process.exit(1);
  }
}

seed();
