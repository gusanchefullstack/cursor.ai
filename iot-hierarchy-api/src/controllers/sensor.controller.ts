import { Request, Response } from 'express';
import DatabaseService from '../services/database.service';
import { SensorType } from '../models/types';

class SensorController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all sensors
   */
  public getAllSensors = (req: Request, res: Response): void => {
    try {
      const sensors = this.dbService.getAllSensors();
      res.status(200).json(sensors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sensors', error });
    }
  };

  /**
   * Get sensors by board ID
   */
  public getSensorsByBoardId = (req: Request, res: Response): void => {
    try {
      const boardId = req.params.boardId;
      const sensors = this.dbService.getSensorsByBoardId(boardId);
      res.status(200).json(sensors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sensors', error });
    }
  };

  /**
   * Get sensor by ID
   */
  public getSensorById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const sensor = this.dbService.getSensorById(id);
      
      if (!sensor) {
        res.status(404).json({ message: `Sensor with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(sensor);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sensor', error });
    }
  };

  /**
   * Create a new sensor
   */
  public createSensor = (req: Request, res: Response): void => {
    try {
      const sensorData = req.body;
      
      // Basic validation
      if (!sensorData.name || !sensorData.boardId || !sensorData.type || !sensorData.unit) {
        res.status(400).json({ 
          message: 'Sensor name, board ID, type, and unit are required' 
        });
        return;
      }
      
      // Validate sensor type
      if (!Object.values(SensorType).includes(sensorData.type)) {
        res.status(400).json({ 
          message: `Invalid sensor type. Must be one of: ${Object.values(SensorType).join(', ')}` 
        });
        return;
      }
      
      // Set default for isActive if not provided
      if (sensorData.isActive === undefined) {
        sensorData.isActive = true;
      }
      
      const newSensor = this.dbService.createSensor(sensorData);
      
      if (!newSensor) {
        res.status(400).json({ 
          message: `Could not create sensor. Board with ID ${sensorData.boardId} not found.` 
        });
        return;
      }
      
      res.status(201).json(newSensor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating sensor', error });
    }
  };

  /**
   * Update an existing sensor
   */
  public updateSensor = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const sensorData = req.body;
      
      // Validate sensor type if provided
      if (sensorData.type && !Object.values(SensorType).includes(sensorData.type)) {
        res.status(400).json({ 
          message: `Invalid sensor type. Must be one of: ${Object.values(SensorType).join(', ')}` 
        });
        return;
      }
      
      const updatedSensor = this.dbService.updateSensor(id, sensorData);
      
      if (!updatedSensor) {
        res.status(404).json({ 
          message: `Sensor with ID ${id} not found or referenced board not found` 
        });
        return;
      }
      
      res.status(200).json(updatedSensor);
    } catch (error) {
      res.status(500).json({ message: 'Error updating sensor', error });
    }
  };

  /**
   * Delete a sensor
   */
  public deleteSensor = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const deleted = this.dbService.deleteSensor(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Sensor with ID ${id} not found` });
        return;
      }
      
      res.status(200).json({ message: `Sensor with ID ${id} successfully deleted` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting sensor', error });
    }
  };

  /**
   * Update sensor reading
   */
  public updateSensorReading = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const { currentValue } = req.body;
      
      if (currentValue === undefined) {
        res.status(400).json({ message: 'Current value is required' });
        return;
      }
      
      const sensor = this.dbService.getSensorById(id);
      
      if (!sensor) {
        res.status(404).json({ message: `Sensor with ID ${id} not found` });
        return;
      }
      
      // Validate the value against min/max if they exist
      if (sensor.minValue !== undefined && currentValue < sensor.minValue) {
        res.status(400).json({ 
          message: `Current value ${currentValue} is below the minimum value ${sensor.minValue}`
        });
        return;
      }
      
      if (sensor.maxValue !== undefined && currentValue > sensor.maxValue) {
        res.status(400).json({ 
          message: `Current value ${currentValue} is above the maximum value ${sensor.maxValue}`
        });
        return;
      }
      
      const updatedSensor = this.dbService.updateSensor(id, { currentValue });
      res.status(200).json(updatedSensor);
    } catch (error) {
      res.status(500).json({ message: 'Error updating sensor reading', error });
    }
  };
}

export default new SensorController(); 