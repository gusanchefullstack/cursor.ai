import { Router } from 'express';
import measuringPointController from '../controllers/measuringPoint.controller';

const router = Router();

/**
 * @route   GET /api/measuring-points
 * @desc    Get all measuring points
 * @access  Public
 */
router.get('/', measuringPointController.getAllMeasuringPoints);

/**
 * @route   GET /api/measuring-points/site/:siteId
 * @desc    Get measuring points by site ID
 * @access  Public
 */
router.get('/site/:siteId', measuringPointController.getMeasuringPointsBySiteId);

/**
 * @route   GET /api/measuring-points/:id
 * @desc    Get measuring point by ID
 * @access  Public
 */
router.get('/:id', measuringPointController.getMeasuringPointById);

/**
 * @route   POST /api/measuring-points
 * @desc    Create a new measuring point
 * @access  Public
 */
router.post('/', measuringPointController.createMeasuringPoint);

/**
 * @route   PUT /api/measuring-points/:id
 * @desc    Update an existing measuring point
 * @access  Public
 */
router.put('/:id', measuringPointController.updateMeasuringPoint);

/**
 * @route   DELETE /api/measuring-points/:id
 * @desc    Delete a measuring point
 * @access  Public
 */
router.delete('/:id', measuringPointController.deleteMeasuringPoint);

export default router; 