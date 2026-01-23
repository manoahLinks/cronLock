import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  description: string;
  address: string;
  price: number;
  isActive: boolean;
  lockTime: number
}

const DeviceSchema = new Schema<IDevice>({
  deviceId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  address: {type: String},
  price: {type: Number, default: 0},
  isActive: {type: Boolean, default: false},
  lockTime: {type: Number}
});

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);

