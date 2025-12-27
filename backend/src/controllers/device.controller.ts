import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../lib/interfaces/api.interface.js';
import { Device } from '../models/device.model.js';

export class DeviceController {
    public async getAllDevices(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const devices = await Device.find();
            return res.status(HttpCode.Ok).json(devices);
        } catch (e) {
            next(e);
        }
    }

    
    public async registerDevice(req: Request, res: Response, next: NextFunction): Promise<Response | void>  {
        try {
            const { deviceId, description } = req.body ?? {};

            if (!deviceId || !description) {
                return res.status(HttpCode.BadRequest).json({error: 'missing fields'});
            }

            const existingDevice = await Device.findOne({ deviceId });
            if (existingDevice) {
                return res.status(HttpCode.Conflict).json({ error: 'Device already exists' });
            }

            const device = new Device({ deviceId, description });
            await device.save();
            return res.status(HttpCode.Created).json(device);
        } catch (e) {
            next(e);
        }
    }

    public async getDevice (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { deviceId } = req.params;
            if (!deviceId) {
                return res.status(HttpCode.BadRequest).json({ error: 'Device ID required' });
            }
            const device = await Device.findOne({ deviceId });
            if (!device) {
                return res.status(HttpCode.NotFound).json({ error: 'Device not found' });
            }
            return res.status(HttpCode.Ok).json(device);
        } catch (e) {
            next(e);
        }
    }
}