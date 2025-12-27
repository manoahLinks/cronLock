import express from "express";
import {DeviceController} from '../controllers/device.controller'

const controller = new DeviceController();
const router = express.Router();

router.post('/', controller.registerDevice.bind(controller));

export default router;