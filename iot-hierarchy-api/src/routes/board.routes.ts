import { Router } from 'express';
import boardController from '../controllers/board.controller';

const router = Router();

/**
 * @route   GET /api/boards
 * @desc    Get all boards
 * @access  Public
 */
router.get('/', boardController.getAllBoards);

/**
 * @route   GET /api/boards/measuring-point/:measuringPointId
 * @desc    Get boards by measuring point ID
 * @access  Public
 */
router.get('/measuring-point/:measuringPointId', boardController.getBoardsByMeasuringPointId);

/**
 * @route   GET /api/boards/:id
 * @desc    Get board by ID
 * @access  Public
 */
router.get('/:id', boardController.getBoardById);

/**
 * @route   POST /api/boards
 * @desc    Create a new board
 * @access  Public
 */
router.post('/', boardController.createBoard);

/**
 * @route   PUT /api/boards/:id
 * @desc    Update an existing board
 * @access  Public
 */
router.put('/:id', boardController.updateBoard);

/**
 * @route   DELETE /api/boards/:id
 * @desc    Delete a board
 * @access  Public
 */
router.delete('/:id', boardController.deleteBoard);

export default router; 