import mongoose, { Document, Schema } from 'mongoose';

interface IChangelogEntry extends Document {
  version: string;
  date: string;
  title: string;
  description: string;
  details: string[];
}

const ChangelogEntrySchema: Schema = new Schema({
  version: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: [String], required: true },
});

const ChangelogEntry = mongoose.model<IChangelogEntry>('ChangelogEntry', ChangelogEntrySchema);

export default ChangelogEntry;
