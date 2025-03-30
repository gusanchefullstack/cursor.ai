import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  Organization,
  Site,
  MeasuringPoint,
  Board,
  Sensor
} from '../models/types';

// Define the database structure
interface Database {
  organizations: Organization[];
  sites: Site[];
  measuringPoints: MeasuringPoint[];
  boards: Board[];
  sensors: Sensor[];
}

class DatabaseService {
  private static instance: DatabaseService;
  private dbPath: string;
  private data: Database;

  private constructor() {
    // Set the path to the database file
    this.dbPath = path.join(__dirname, '..', 'data', 'database.json');
    this.data = this.loadData();
  }

  /**
   * Gets the singleton instance of DatabaseService
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Loads data from the database file
   */
  private loadData(): Database {
    try {
      const fileData = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(fileData) as Database;
    } catch (error) {
      console.error('Error loading database:', error);
      return {
        organizations: [],
        sites: [],
        measuringPoints: [],
        boards: [],
        sensors: []
      };
    }
  }

  /**
   * Saves data to the database file
   */
  private saveData(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  /**
   * Refreshes data from the file
   */
  public refreshData(): void {
    this.data = this.loadData();
  }

  // Organization CRUD operations
  /**
   * Gets all organizations
   */
  public getAllOrganizations(): Organization[] {
    return this.data.organizations;
  }

  /**
   * Gets an organization by ID
   */
  public getOrganizationById(id: string): Organization | null {
    return this.data.organizations.find(org => org.id === id) || null;
  }

  /**
   * Creates a new organization
   */
  public createOrganization(orgData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Organization {
    const now = new Date();
    const newOrg: Organization = {
      id: uuidv4(),
      ...orgData,
      createdAt: now,
      updatedAt: now,
      sites: orgData.sites || []
    };
    
    this.data.organizations.push(newOrg);
    this.saveData();
    return newOrg;
  }

  /**
   * Updates an organization
   */
  public updateOrganization(id: string, orgData: Partial<Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>>): Organization | null {
    const orgIndex = this.data.organizations.findIndex(org => org.id === id);
    if (orgIndex === -1) return null;

    const updatedOrg = {
      ...this.data.organizations[orgIndex],
      ...orgData,
      updatedAt: new Date()
    };

    this.data.organizations[orgIndex] = updatedOrg;
    this.saveData();
    return updatedOrg;
  }

  /**
   * Deletes an organization
   */
  public deleteOrganization(id: string): boolean {
    // First, delete all related sites (which will cascade to lower levels)
    const sitesToDelete = this.data.sites.filter(site => site.organizationId === id);
    sitesToDelete.forEach(site => this.deleteSite(site.id));

    const initialLength = this.data.organizations.length;
    this.data.organizations = this.data.organizations.filter(org => org.id !== id);
    
    if (initialLength !== this.data.organizations.length) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Site CRUD operations
  /**
   * Gets all sites
   */
  public getAllSites(): Site[] {
    return this.data.sites;
  }

  /**
   * Gets sites by organization ID
   */
  public getSitesByOrganizationId(organizationId: string): Site[] {
    return this.data.sites.filter(site => site.organizationId === organizationId);
  }

  /**
   * Gets a site by ID
   */
  public getSiteById(id: string): Site | null {
    return this.data.sites.find(site => site.id === id) || null;
  }

  /**
   * Creates a new site
   */
  public createSite(siteData: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Site | null {
    // Verify organization exists
    const org = this.getOrganizationById(siteData.organizationId);
    if (!org) return null;

    const now = new Date();
    const newSite: Site = {
      id: uuidv4(),
      ...siteData,
      createdAt: now,
      updatedAt: now,
      measuringPoints: siteData.measuringPoints || []
    };
    
    this.data.sites.push(newSite);
    this.saveData();
    return newSite;
  }

  /**
   * Updates a site
   */
  public updateSite(id: string, siteData: Partial<Omit<Site, 'id' | 'createdAt' | 'updatedAt'>>): Site | null {
    const siteIndex = this.data.sites.findIndex(site => site.id === id);
    if (siteIndex === -1) return null;

    // If changing organization, verify it exists
    if (siteData.organizationId && 
        !this.getOrganizationById(siteData.organizationId)) return null;

    const updatedSite = {
      ...this.data.sites[siteIndex],
      ...siteData,
      updatedAt: new Date()
    };

    this.data.sites[siteIndex] = updatedSite;
    this.saveData();
    return updatedSite;
  }

  /**
   * Deletes a site
   */
  public deleteSite(id: string): boolean {
    // First, delete all related measuring points (which will cascade to lower levels)
    const mpToDelete = this.data.measuringPoints.filter(mp => mp.siteId === id);
    mpToDelete.forEach(mp => this.deleteMeasuringPoint(mp.id));

    const initialLength = this.data.sites.length;
    this.data.sites = this.data.sites.filter(site => site.id !== id);
    
    if (initialLength !== this.data.sites.length) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Measuring Point CRUD operations
  /**
   * Gets all measuring points
   */
  public getAllMeasuringPoints(): MeasuringPoint[] {
    return this.data.measuringPoints;
  }

  /**
   * Gets measuring points by site ID
   */
  public getMeasuringPointsBySiteId(siteId: string): MeasuringPoint[] {
    return this.data.measuringPoints.filter(mp => mp.siteId === siteId);
  }

  /**
   * Gets a measuring point by ID
   */
  public getMeasuringPointById(id: string): MeasuringPoint | null {
    return this.data.measuringPoints.find(mp => mp.id === id) || null;
  }

  /**
   * Creates a new measuring point
   */
  public createMeasuringPoint(mpData: Omit<MeasuringPoint, 'id' | 'createdAt' | 'updatedAt'>): MeasuringPoint | null {
    // Verify site exists
    const site = this.getSiteById(mpData.siteId);
    if (!site) return null;

    const now = new Date();
    const newMp: MeasuringPoint = {
      id: uuidv4(),
      ...mpData,
      createdAt: now,
      updatedAt: now,
      boards: mpData.boards || []
    };
    
    this.data.measuringPoints.push(newMp);
    this.saveData();
    return newMp;
  }

  /**
   * Updates a measuring point
   */
  public updateMeasuringPoint(id: string, mpData: Partial<Omit<MeasuringPoint, 'id' | 'createdAt' | 'updatedAt'>>): MeasuringPoint | null {
    const mpIndex = this.data.measuringPoints.findIndex(mp => mp.id === id);
    if (mpIndex === -1) return null;

    // If changing site, verify it exists
    if (mpData.siteId && !this.getSiteById(mpData.siteId)) return null;

    const updatedMp = {
      ...this.data.measuringPoints[mpIndex],
      ...mpData,
      updatedAt: new Date()
    };

    this.data.measuringPoints[mpIndex] = updatedMp;
    this.saveData();
    return updatedMp;
  }

  /**
   * Deletes a measuring point
   */
  public deleteMeasuringPoint(id: string): boolean {
    // First, delete all related boards (which will cascade to sensors)
    const boardsToDelete = this.data.boards.filter(board => board.measuringPointId === id);
    boardsToDelete.forEach(board => this.deleteBoard(board.id));

    const initialLength = this.data.measuringPoints.length;
    this.data.measuringPoints = this.data.measuringPoints.filter(mp => mp.id !== id);
    
    if (initialLength !== this.data.measuringPoints.length) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Board CRUD operations
  /**
   * Gets all boards
   */
  public getAllBoards(): Board[] {
    return this.data.boards;
  }

  /**
   * Gets boards by measuring point ID
   */
  public getBoardsByMeasuringPointId(measuringPointId: string): Board[] {
    return this.data.boards.filter(board => board.measuringPointId === measuringPointId);
  }

  /**
   * Gets a board by ID
   */
  public getBoardById(id: string): Board | null {
    return this.data.boards.find(board => board.id === id) || null;
  }

  /**
   * Creates a new board
   */
  public createBoard(boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Board | null {
    // Verify measuring point exists
    const mp = this.getMeasuringPointById(boardData.measuringPointId);
    if (!mp) return null;

    const now = new Date();
    const newBoard: Board = {
      id: uuidv4(),
      ...boardData,
      createdAt: now,
      updatedAt: now,
      sensors: boardData.sensors || []
    };
    
    this.data.boards.push(newBoard);
    this.saveData();
    return newBoard;
  }

  /**
   * Updates a board
   */
  public updateBoard(id: string, boardData: Partial<Omit<Board, 'id' | 'createdAt' | 'updatedAt'>>): Board | null {
    const boardIndex = this.data.boards.findIndex(board => board.id === id);
    if (boardIndex === -1) return null;

    // If changing measuring point, verify it exists
    if (boardData.measuringPointId && 
        !this.getMeasuringPointById(boardData.measuringPointId)) return null;

    const updatedBoard = {
      ...this.data.boards[boardIndex],
      ...boardData,
      updatedAt: new Date()
    };

    this.data.boards[boardIndex] = updatedBoard;
    this.saveData();
    return updatedBoard;
  }

  /**
   * Deletes a board
   */
  public deleteBoard(id: string): boolean {
    // First, delete all related sensors
    const sensorsToDelete = this.data.sensors.filter(sensor => sensor.boardId === id);
    sensorsToDelete.forEach(sensor => this.deleteSensor(sensor.id));

    const initialLength = this.data.boards.length;
    this.data.boards = this.data.boards.filter(board => board.id !== id);
    
    if (initialLength !== this.data.boards.length) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Sensor CRUD operations
  /**
   * Gets all sensors
   */
  public getAllSensors(): Sensor[] {
    return this.data.sensors;
  }

  /**
   * Gets sensors by board ID
   */
  public getSensorsByBoardId(boardId: string): Sensor[] {
    return this.data.sensors.filter(sensor => sensor.boardId === boardId);
  }

  /**
   * Gets a sensor by ID
   */
  public getSensorById(id: string): Sensor | null {
    return this.data.sensors.find(sensor => sensor.id === id) || null;
  }

  /**
   * Creates a new sensor
   */
  public createSensor(sensorData: Omit<Sensor, 'id' | 'createdAt' | 'updatedAt'>): Sensor | null {
    // Verify board exists
    const board = this.getBoardById(sensorData.boardId);
    if (!board) return null;

    const now = new Date();
    const newSensor: Sensor = {
      id: uuidv4(),
      ...sensorData,
      createdAt: now,
      updatedAt: now
    };
    
    this.data.sensors.push(newSensor);
    this.saveData();
    return newSensor;
  }

  /**
   * Updates a sensor
   */
  public updateSensor(id: string, sensorData: Partial<Omit<Sensor, 'id' | 'createdAt' | 'updatedAt'>>): Sensor | null {
    const sensorIndex = this.data.sensors.findIndex(sensor => sensor.id === id);
    if (sensorIndex === -1) return null;

    // If changing board, verify it exists
    if (sensorData.boardId && !this.getBoardById(sensorData.boardId)) return null;

    const updatedSensor = {
      ...this.data.sensors[sensorIndex],
      ...sensorData,
      updatedAt: new Date()
    };

    this.data.sensors[sensorIndex] = updatedSensor;
    this.saveData();
    return updatedSensor;
  }

  /**
   * Deletes a sensor
   */
  public deleteSensor(id: string): boolean {
    const initialLength = this.data.sensors.length;
    this.data.sensors = this.data.sensors.filter(sensor => sensor.id !== id);
    
    if (initialLength !== this.data.sensors.length) {
      this.saveData();
      return true;
    }
    return false;
  }
}

export default DatabaseService; 