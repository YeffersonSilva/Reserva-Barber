import express from 'express';
import cors from 'cors'; // Importa cors
import routes from './routes';
import { errorHandler } from './middlewares/ErrorHandler';

const app = express();

// Configura CORS con las opciones necesarias (puedes personalizarlo)
app.use(cors({
	origin(_requestOrigin, callback) {
		callback(null, true);
	},
})); // Usar CORS
app.use(express.json());

app.use('/', routes);
app.use(errorHandler);

export default app;
