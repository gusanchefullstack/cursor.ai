import { Request, Response } from 'express';
import DatabaseService from '../services/database.service';

class MeasuringPointController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all measuring points
   */
  public getAllMeasuringPoints = (req: Request, res: Response): void => {
    try {
      const measuringPoints = this.dbService.getAllMeasuringPoints();
      res.status(200).json(measuringPoints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching measuring points', error });
    }
  };

  /**
   * Get measuring points by site ID
   */
  public getMeasuringPointsBySiteId = (req: Request, res: Response): void => {
    try {
      const siteId = req.params.siteId;
      const measuringPoints = this.dbService.getMeasuringPointsBySiteId(siteId);
      res.status(200).json(measuringPoints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching measuring points', error });
    }
  };

  /**
   * Get measuring point by ID
   */
  public getMeasuringPointById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const measuringPoint = this.dbService.getMeasuringPointById(id);
      
      if (!measuringPoint) {
        res.status(404).json({ message: `Measuring point with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(measuringPoint);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching measuring point', error });
    }
  };

  /**
   * Create a new measuring point
   */
  public createMeasuringPoint = (req: Request, res: Response): void => {
    try {
      const mpData = req.body;
      
      // Basic validation
      if (!mpData.name || !mpData.siteId) {
        res.status(400).json({ 
          message: 'Measuring point name and site ID are required' 
        });
        return;
      }
      
      // Validate latitude and longitude if provided
      if (mpData.latitude !== undefined && (isNaN(mpData.latitude) || mpData.latitude < -90 || mpData.latitude > 90)) {
        res.status(400).json({ 
          message: 'Latitude must be a valid number between -90 and 90' 
        });
        return;
      }
      
      if (mpData.longitude !== undefined && (isNaN(mpData.longitude) || mpData.longitude < -180 || mpData.longitude > 180)) {
        res.status(400).json({ 
          message: 'Longitude must be a valid number between -180 and 180' 
        });
        return;
      }
      
      const newMp = this.dbService.createMeasuringPoint(mpData);
      
      if (!newMp) {
        res.status(400).json({ 
          message: `Could not create measuring point. Site with ID ${mpData.siteId} not found.` 
        });
        return;
      }
      
      res.status(201).json(newMp);
    } catch (error) {
      res.status(500).json({ message: 'Error creating measuring point', error });
    }
  };

  /**
   * Update an existing measuring point
   */
  public updateMeasuringPoint = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const mpData = req.body;
      
      // Validate latitude and longitude if provided
      if (mpData.latitude !== undefined && (isNaN(mpData.latitude) || mpData.latitude < -90 || mpData.latitude > 90)) {
        res.status(400).json({ 
          message: 'Latitude must be a valid number between -90 and 90' 
        });
        return;
      }
      
      if (mpData.longitude !== undefined && (isNaN(mpData.longitude) || mpData.longitude < -180 || mpData.longitude > 180)) {
        res.status(400).json({ 
          message: 'Longitude must be a valid number between -180 and 180' 
        });
        return;
      }
      
      const updatedMp = this.dbService.updateMeasuringPoint(id, mpData);
      
      if (!updatedMp) {
        res.status(404).json({ 
          message: `Measuring point with ID ${id} not found or referenced site not found` 
        });
        return;
      }
      
      res.status(200).json(updatedMp);
    } catch (error) {
      res.status(500).json({ message: 'Error updating measuring point', error });
    }
  };

  /**
   * Delete a measuring point
   */
  public deleteMeasuringPoint = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const deleted = this.dbService.deleteMeasuringPoint(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Measuring point with ID ${id} not found` });
        return;
      }
      
      res.status(200).json({ message: `Measuring point with ID ${id} successfully deleted` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting measuring point', error });
    }
  };
}

export default new MeasuringPointController(); 