import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { RegisterUserDTO } from "./dto/RegisterUserDTO";
import { LoginUserDTO } from "./dto/LoginUserDTO";
import { User } from "../../entities/User";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken,verifyToken } from "../../utils/token";
import { AppError } from "../../error/AppError";
import { isValidCpf } from "../../utils/cpf";




export class AuthService {
  constructor(
    private userRepository: IUserRepository,

  ) {}

  private readonly accessTokenExpiry = "15m";
  private readonly refreshTokenExpiry = "3d";

 public async register(data: RegisterUserDTO): Promise<{ token: string; refreshToken: string; user: User }> {
    if (!isValidCpf(data.cpf)) {
      throw new AppError("CPF inválido", 400);
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("E-mail já registrado", 400);
    }

    const existingCpfUser = await this.userRepository.findByCpf(data.cpf);
    if (existingCpfUser) {
      throw new AppError("CPF já registrado", 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create(
      new User(
        0,
        data.name,
        data.email,
        hashedPassword,
        data.phone,
        data.cpf,
        data.role,


      )
    );

    const token = signToken({ id: user.id, role: user.role }, this.accessTokenExpiry);
    const refreshToken = signToken({ id: user.id, role: user.role }, this.refreshTokenExpiry);

    return { token, refreshToken, user };
  }
  

  public async login(
    data: LoginUserDTO
  ): Promise<{ token: string; refreshToken: string; user: User }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const isPasswordValid = await comparePassword(data.password, user.password!);
    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = signToken({ id: user.id, role: user.role }, this.accessTokenExpiry);
    const refreshToken = signToken({ id: user.id, role: user.role }, this.refreshTokenExpiry);

    if (data.firebaseToken) {
      await this.userRepository.addFirebaseToken(user.id, data.firebaseToken);
    }

    return { token, refreshToken, user };
  }

  public async updateFirebaseToken(userId: number, firebaseToken: string): Promise<void> {
    // Adiciona o token à lista
    await this.userRepository.addFirebaseToken(userId, firebaseToken);
  }

  public async getFirebaseTokens(userId: number): Promise<string[]> {
    const tokens = await this.userRepository.getFirebaseTokensById(userId);
    if (!tokens || tokens.length === 0) {
      throw new AppError("Nenhum token do Firebase encontrado para este usuário", 404);
    }
    return tokens;
  }

  public async removeFirebaseToken(userId: number, firebaseToken: string): Promise<void> {
    // Remove o token da lista
    await this.userRepository.removeFirebaseToken(userId, firebaseToken);
  }

  public async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const payload = verifyToken(refreshToken);
      const userId = payload.id;

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      const token = signToken({ id: user.id, role: user.role }, this.accessTokenExpiry);
      const newRefreshToken = signToken({ id: user.id, role: user.role }, this.refreshTokenExpiry);

      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError("Refresh token inválido ou expirado", 401);
    }
  }
  }
  

