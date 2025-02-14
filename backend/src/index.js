const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');
const pexelsRoutes = require('./routes/pexels');

const organizationForAuthRoutes = require('./routes/organizationLogin');

const openaiRoutes = require('./routes/openai');

const usersRoutes = require('./routes/users');

const human_resourcesRoutes = require('./routes/human_resources');

const inventoryRoutes = require('./routes/inventory');

const machineryRoutes = require('./routes/machinery');

const quality_controlRoutes = require('./routes/quality_control');

const raw_materialsRoutes = require('./routes/raw_materials');

const suppliersRoutes = require('./routes/suppliers');

const work_ordersRoutes = require('./routes/work_orders');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const organizationsRoutes = require('./routes/organizations');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'bbgg',
      description:
        'bbgg Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/pexels', pexelsRoutes);
app.enable('trust proxy');

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/human_resources',
  passport.authenticate('jwt', { session: false }),
  human_resourcesRoutes,
);

app.use(
  '/api/inventory',
  passport.authenticate('jwt', { session: false }),
  inventoryRoutes,
);

app.use(
  '/api/machinery',
  passport.authenticate('jwt', { session: false }),
  machineryRoutes,
);

app.use(
  '/api/quality_control',
  passport.authenticate('jwt', { session: false }),
  quality_controlRoutes,
);

app.use(
  '/api/raw_materials',
  passport.authenticate('jwt', { session: false }),
  raw_materialsRoutes,
);

app.use(
  '/api/suppliers',
  passport.authenticate('jwt', { session: false }),
  suppliersRoutes,
);

app.use(
  '/api/work_orders',
  passport.authenticate('jwt', { session: false }),
  work_ordersRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

app.use(
  '/api/organizations',
  passport.authenticate('jwt', { session: false }),
  organizationsRoutes,
);

app.use(
  '/api/openai',
  passport.authenticate('jwt', { session: false }),
  openaiRoutes,
);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes,
);

app.use('/api/org-for-auth', organizationForAuthRoutes);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.NODE_ENV === 'dev_stage' ? 3000 : 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
