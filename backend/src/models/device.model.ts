import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  description: string;
  address: string;
  price: number;
  isActive: boolean;
}

const DeviceSchema = new Schema<IDevice>({
  deviceId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  address: {type: String},
  price: {type: Number},
  isActive: {type: Boolean, default: false}
});

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);

