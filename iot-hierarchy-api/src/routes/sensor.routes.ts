import { Router } from 'express';
import sensorController from '../controllers/sensor.controller';

const router = Router();

/**
 * @route   GET /api/sensors
 * @desc    Get all sensors
 * @access  Public
 */
router.get('/', sensorController.getAllSensors);

/**
 * @route   GET /api/sensors/board/:boardId
 * @desc    Get sensors by board ID
 * @access  Public
 */
router.get('/board/:boardId', sensorController.getSensorsByBoardId);

/**
 * @route   GET /api/sensors/:id
 * @desc    Get sensor by ID
 * @access  Public
 */
router.get('/:id', sensorController.getSensorById);

/**
 * @route   POST /api/sensors
 * @desc    Create a new sensor
 * @access  Public
 */
router.post('/', sensorController.createSensor);

/**
 * @route   PUT /api/sensors/:id
 * @desc    Update an existing sensor
 * @access  Public
 */
router.put('/:id', sensorController.updateSensor);

/**
 * @route   DELETE /api/sensors/:id
 * @desc    Delete a sensor
 * @access  Public
 */
router.delete('/:id', sensorController.deleteSensor);

/**
 * @route   PUT /api/sensors/:id/reading
 * @desc    Update a sensor reading
 * @access  Public
 */
router.put('/:id/reading', sensorController.updateSensorReading);

export default router; 