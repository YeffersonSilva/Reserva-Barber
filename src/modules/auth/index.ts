
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import authRoutes from './routes';
import { PrismaUserRepository } from '../../repositories/implementations/PrismaUserRepository';




const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export { authController, authService, authRoutes, userRepository };
