import { Schema, model } from 'mongoose';

const PurchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['purchase', 'consume', 'reward', 'refund'], required: true },
    itemId: { type: String },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number },
    idempotencyKey: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default model('Purchase', PurchaseSchema);
