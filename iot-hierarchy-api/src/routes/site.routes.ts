import { Router } from 'express';
import siteController from '../controllers/site.controller';

const router = Router();

/**
 * @route   GET /api/sites
 * @desc    Get all sites
 * @access  Public
 */
router.get('/', siteController.getAllSites);

/**
 * @route   GET /api/sites/organization/:organizationId
 * @desc    Get sites by organization ID
 * @access  Public
 */
router.get('/organization/:organizationId', siteController.getSitesByOrganizationId);

/**
 * @route   GET /api/sites/:id
 * @desc    Get site by ID
 * @access  Public
 */
router.get('/:id', siteController.getSiteById);

/**
 * @route   POST /api/sites
 * @desc    Create a new site
 * @access  Public
 */
router.post('/', siteController.createSite);

/**
 * @route   PUT /api/sites/:id
 * @desc    Update an existing site
 * @access  Public
 */
router.put('/:id', siteController.updateSite);

/**
 * @route   DELETE /api/sites/:id
 * @desc    Delete a site
 * @access  Public
 */
router.delete('/:id', siteController.deleteSite);

export default router; 