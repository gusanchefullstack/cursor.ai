import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import organizationRoutes from './routes/organization.routes';
import siteRoutes from './routes/site.routes';
import measuringPointRoutes from './routes/measuringPoint.routes';
import boardRoutes from './routes/board.routes';
import sensorRoutes from './routes/sensor.routes';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// API Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/measuring-points', measuringPointRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/sensors', sensorRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the IoT Hierarchy API',
    endpoints: {
      organizations: '/api/organizations',
      sites: '/api/sites',
      measuringPoints: '/api/measuring-points',
      boards: '/api/boards',
      sensors: '/api/sensors'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 