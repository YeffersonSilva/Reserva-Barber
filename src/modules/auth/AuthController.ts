  import { Request, Response, NextFunction } from 'express';
  import { AuthService } from './AuthService';
  import { RegisterUserDTO } from './dto/RegisterUserDTO';
  import { LoginUserDTO } from './dto/LoginUserDTO';

  export class AuthController {
    constructor(private authService: AuthService) {}

    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: RegisterUserDTO = req.body;
        const result = await this.authService.register(data); // Result incluye token, refreshToken y user
        res.status(201).json(result); // Retorna token, refreshToken y user
      } catch (error) {
        next(error);
      }
    }
    
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: LoginUserDTO = req.body;
        const result = await this.authService.login(data); // Result incluye token, refreshToken y user
        res.status(200).json(result); // Retorna token, refreshToken y user
      } catch (error) {
        next(error);
      }
    }
    


  }
