import { Schema, model } from 'mongoose';

const StoreItemSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default model('StoreItem', StoreItemSchema);
