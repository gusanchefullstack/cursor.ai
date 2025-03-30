import { Request, Response } from 'express';
import DatabaseService from '../services/database.service';

class SiteController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all sites
   */
  public getAllSites = (req: Request, res: Response): void => {
    try {
      const sites = this.dbService.getAllSites();
      res.status(200).json(sites);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sites', error });
    }
  };

  /**
   * Get sites by organization ID
   */
  public getSitesByOrganizationId = (req: Request, res: Response): void => {
    try {
      const organizationId = req.params.organizationId;
      const sites = this.dbService.getSitesByOrganizationId(organizationId);
      res.status(200).json(sites);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sites', error });
    }
  };

  /**
   * Get site by ID
   */
  public getSiteById = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const site = this.dbService.getSiteById(id);
      
      if (!site) {
        res.status(404).json({ message: `Site with ID ${id} not found` });
        return;
      }
      
      res.status(200).json(site);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching site', error });
    }
  };

  /**
   * Create a new site
   */
  public createSite = (req: Request, res: Response): void => {
    try {
      const siteData = req.body;
      
      // Basic validation
      if (!siteData.name || !siteData.organizationId || !siteData.location) {
        res.status(400).json({ 
          message: 'Site name, organization ID, and location are required' 
        });
        return;
      }
      
      const newSite = this.dbService.createSite(siteData);
      
      if (!newSite) {
        res.status(400).json({ 
          message: `Could not create site. Organization with ID ${siteData.organizationId} not found.` 
        });
        return;
      }
      
      res.status(201).json(newSite);
    } catch (error) {
      res.status(500).json({ message: 'Error creating site', error });
    }
  };

  /**
   * Update an existing site
   */
  public updateSite = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const siteData = req.body;
      
      const updatedSite = this.dbService.updateSite(id, siteData);
      
      if (!updatedSite) {
        res.status(404).json({ 
          message: `Site with ID ${id} not found or referenced organization not found` 
        });
        return;
      }
      
      res.status(200).json(updatedSite);
    } catch (error) {
      res.status(500).json({ message: 'Error updating site', error });
    }
  };

  /**
   * Delete a site
   */
  public deleteSite = (req: Request, res: Response): void => {
    try {
      const id = req.params.id;
      const deleted = this.dbService.deleteSite(id);
      
      if (!deleted) {
        res.status(404).json({ message: `Site with ID ${id} not found` });
        return;
      }
      
      res.status(200).json({ message: `Site with ID ${id} successfully deleted` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting site', error });
    }
  };
}

export default new SiteController(); 