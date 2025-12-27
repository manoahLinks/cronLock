import express from "express";
import {DeviceController} from '../controllers/device.controller.js'

const controller = new DeviceController();
const router = express.Router();

router.post('/', controller.registerDevice.bind(controller));
router.get('/', controller.getAllDevices.bind(controller));
router.get('/:deviceId', controller.getDevice.bind(controller));

export default router;