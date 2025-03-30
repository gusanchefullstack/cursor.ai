import { Request, Response } from 'express';
import DatabaseService from '../services/database.service';

class BoardController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all boards
   */
  public getAllBoards = (req: Request, res: Response): void => {
    try {
      const boards = this.dbService.getAllBoards();
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching boards', error });
    }
  };

  /**
   * Get boards by measuring point ID
   */
  public getBoardsByMeasuringPointId = (req: Request, res: Response): void => {
    try {
      const measuringPointId = req.params.measuringPointId;
      const boards = this.dbService.getBoardsByMeasuringPointId(measuringPointId);
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching boards', error });
    }
  };

  /**
   * Get board by ID
   */
  public getBoardById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const board = this.dbService.getBoardById(id);
      
      if (!board) {
        res.status(404).json({ message: `Board with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(board);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching board', error });
    }
  };

  /**
   * Create a new board
   */
  public createBoard = (req: Request, res: Response): void => {
    try {
      const boardData = req.body;
      
      // Basic validation
      if (!boardData.name || !boardData.measuringPointId || !boardData.serialNumber || !boardData.firmwareVersion) {
        res.status(400).json({ 
          message: 'Board name, measuring point ID, serial number, and firmware version are required' 
        });
        return;
      }
      
      const newBoard = this.dbService.createBoard(boardData);
      
      if (!newBoard) {
        res.status(400).json({ 
          message: `Could not create board. Measuring point with ID ${boardData.measuringPointId} not found.` 
        });
        return;
      }
      
      res.status(201).json(newBoard);
    } catch (error) {
      res.status(500).json({ message: 'Error creating board', error });
    }
  };

  /**
   * Update an existing board
   */
  public updateBoard = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const boardData = req.body;
      
      const updatedBoard = this.dbService.updateBoard(id, boardData);
      
      if (!updatedBoard) {
        res.status(404).json({ 
          message: `Board with ID ${id} not found or referenced measuring point not found` 
        });
        return;
      }
      
      res.status(200).json(updatedBoard);
    } catch (error) {
      res.status(500).json({ message: 'Error updating board', error });
    }
  };

  /**
   * Delete a board
   */
  public deleteBoard = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const deleted = this.dbService.deleteBoard(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Board with ID ${id} not found` });
        return;
      }
      
      res.status(200).json({ message: `Board with ID ${id} successfully deleted` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting board', error });
    }
  };
}

export default new BoardController(); 