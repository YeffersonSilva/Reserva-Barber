import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Express } from 'express';

const swaggerDocument = YAML.load('./docs/swagger.yaml');

export default (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}; 