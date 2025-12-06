import { Schema, model } from 'mongoose';

const UserInventorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserInventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default model('UserInventory', UserInventorySchema);
