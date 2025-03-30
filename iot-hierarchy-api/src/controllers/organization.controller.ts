import { Request, Response } from 'express';
import DatabaseService from '../services/database.service';

class OrganizationController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all organizations
   */
  public getAllOrganizations = (req: Request, res: Response): void => {
    try {
      const organizations = this.dbService.getAllOrganizations();
      res.status(200).json(organizations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching organizations', error });
    }
  };

  /**
   * Get organization by ID
   */
  public getOrganizationById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const organization = this.dbService.getOrganizationById(id);
      
      if (!organization) {
        res.status(404).json({ message: `Organization with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(organization);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching organization', error });
    }
  };

  /**
   * Create a new organization
   */
  public createOrganization = (req: Request, res: Response): void => {
    try {
      const orgData = req.body;
      
      // Basic validation
      if (!orgData.name) {
        res.status(400).json({ message: 'Organization name is required' });
        return;
      }
      
      const newOrg = this.dbService.createOrganization(orgData);
      res.status(201).json(newOrg);
    } catch (error) {
      res.status(500).json({ message: 'Error creating organization', error });
    }
  };

  /**
   * Update an existing organization
   */
  public updateOrganization = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const orgData = req.body;
      
      const updatedOrg = this.dbService.updateOrganization(id, orgData);
      
      if (!updatedOrg) {
        res.status(404).json({ message: `Organization with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedOrg);
    } catch (error) {
      res.status(500).json({ message: 'Error updating organization', error });
    }
  };

  /**
   * Delete an organization
   */
  public deleteOrganization = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const deleted = this.dbService.deleteOrganization(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Organization with ID ${id} not found` });
        return;
      }
      
      res.status(200).json({ message: `Organization with ID ${id} successfully deleted` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting organization', error });
    }
  };
}

export default new OrganizationController(); 