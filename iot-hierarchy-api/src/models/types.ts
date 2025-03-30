// Define sensor types as enum
export enum SensorType {
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITY = 'HUMIDITY',
  DISSOLVED_OXYGEN = 'DISSOLVED_OXYGEN',
  ORP = 'ORP'
}

// Base interface for all entities with UUID
export interface Entity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Organization entity
export interface Organization extends Entity {
  description?: string;
  sites: Site[];
}

// Site entity
export interface Site extends Entity {
  organizationId: string;
  location: string;
  measuringPoints: MeasuringPoint[];
}

// Measuring Point entity
export interface MeasuringPoint extends Entity {
  siteId: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  boards: Board[];
}

// Board entity
export interface Board extends Entity {
  measuringPointId: string;
  serialNumber: string;
  firmwareVersion: string;
  sensors: Sensor[];
}

// Sensor entity
export interface Sensor extends Entity {
  boardId: string;
  type: SensorType;
  unit: string;
  minValue?: number;
  maxValue?: number;
  currentValue?: number;
  isActive: boolean;
} 