import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  description: string;
}

const DeviceSchema = new Schema<IDevice>({
  deviceId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);

