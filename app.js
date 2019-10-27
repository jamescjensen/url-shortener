'use strict';

const app = require('express')();
const config = require('config');
const fs = require('fs');
const http = require('http');
const path = require('path');
const swaggerTools = require('swagger-tools');
const YAML = require('js-yaml');

const serverPort = config.get('port');

// swaggerRouter configuration
const options = {
  controllers: './api/controllers',
  useStubs: config.util.getEnv('NODE_ENV') === 'development' ? true : false,
};

// eslint-disable-next-line no-undef
const swaggerPath = path.join(__dirname, 'api', 'swagger', 'swagger.yaml');
const swaggerDoc = YAML.safeLoad(fs.readFileSync(swaggerPath, 'utf8'));

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function() {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  });
});
