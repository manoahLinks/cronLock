import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../lib/interfaces/api.interface.js';
// import mongoose from 'mongoose';

export class DeviceController {
    
    public async registerDevice(req: Request, res: Response, next: NextFunction): Promise<Response | void>  {
        try {
            const { deviceId } = req.body ?? {};

            if(!deviceId) {
                return res.status(HttpCode.BadRequest).json({error: 'missing fields'})
            }

          
            
        } catch (e) {
            next(e)
        }
    }

    // public async getDevice (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {

            
    //     } catch (e) {
    //         next(e)
    //     }
    // }
}