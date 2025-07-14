import { User } from "@/domain/spdc/dto/users";
import { env } from "@/infra/env";
import { IAuthService } from "@/application/repositories/IAuthService";
import { IUsersRepository } from "@/application/repositories/IUsersRepository";
import { sign, verify } from "jsonwebtoken";

export class JwtService implements IAuthService {
    private readonly jwtSecret = env.JWT_SECRET;

    constructor(
        private readonly userRepository: IUsersRepository
    ) {}

    async login(user: User): Promise<{ token: string, users: User[] | null }> {
        const token = sign(
            { id: user.CD_CLIENTE, email: user.EMAIL_CLIENTE },
            this.jwtSecret,
            { expiresIn: '3d' }
        );

        const users = await this.userRepository.findById(user.CD_CLIENTE.toString());

        return {
            token,
            users
        }
    }

    /*     async validateToken(token: string): Promise<Omit<User, 'SENHA_CLIENTE'>> {
            // Regra de validação do token
            try {
                const decoded = verify(token, this.jwtSecret) as { id: string, email: string };
    
                
            } catch (error) {
    
            }
        } */
}