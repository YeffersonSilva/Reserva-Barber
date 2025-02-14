// src/modules/auth/AuthService.ts
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { RegisterUserDTO } from "./dto/RegisterUserDTO";
import { LoginUserDTO } from "./dto/LoginUserDTO";
import { User } from "../../entities/User";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken, verifyToken } from "../../utils/token";
import { AppError } from "../../error/AppError";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  private readonly accessTokenExpiry = "15m";
  private readonly refreshTokenExpiry = "3d";

  public async register(
    data: RegisterUserDTO
  ): Promise<{ token: string; refreshToken: string; user: User }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("E-mail já registrado", 400);
    }

    const hashedPassword = await hashPassword(data.password);

    // Si en el DTO de registro se incluye companyId (o se asigna de otra forma), se utilizará
    const user = await this.userRepository.create(
      new User(
        0,
        data.name,
        data.email,
        hashedPassword,
        data.phone,
        data.role, // Asegúrate de que los roles sean: 'ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CLIENT'
        data.companyId // Si el DTO incluye companyId, de lo contrario, se quedará undefined
      )
    );

    // Incluir companyId en el payload
    const payload = { id: user.id, role: user.role, companyId: user.companyId };
    const token = signToken(payload, this.accessTokenExpiry);
    const refreshToken = signToken(payload, this.refreshTokenExpiry);

    return { token, refreshToken, user };
  }

  // Ejemplo en src/modules/auth/AuthService.ts (método login)
  public async login(
    data: LoginUserDTO
  ): Promise<{ token: string; refreshToken: string; user: User }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.password!
    );
    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      companyId: user.companyId,
    };
    const token = signToken(tokenPayload, this.accessTokenExpiry);
    const refreshToken = signToken(tokenPayload, this.refreshTokenExpiry);

    return { token, refreshToken, user };
  }

  public async updateUserCompany(
    userId: number,
    companyId: number
  ): Promise<void> {
    await this.userRepository.update(userId, { companyId });
  }
}
