import { Router } from 'express';
import organizationController from '../controllers/organization.controller';

const router = Router();

/**
 * @route   GET /api/organizations
 * @desc    Get all organizations
 * @access  Public
 */
router.get('/', organizationController.getAllOrganizations);

/**
 * @route   GET /api/organizations/:id
 * @desc    Get organization by ID
 * @access  Public
 */
router.get('/:id', organizationController.getOrganizationById);

/**
 * @route   POST /api/organizations
 * @desc    Create a new organization
 * @access  Public
 */
router.post('/', organizationController.createOrganization);

/**
 * @route   PUT /api/organizations/:id
 * @desc    Update an existing organization
 * @access  Public
 */
router.put('/:id', organizationController.updateOrganization);

/**
 * @route   DELETE /api/organizations/:id
 * @desc    Delete an organization
 * @access  Public
 */
router.delete('/:id', organizationController.deleteOrganization);

export default router; 