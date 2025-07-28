import { IAuthService } from "@/domain/interfaces/IAuthService";
import { IUsersRepository } from "@/application/repositories/IUsersRepository";

export class AuthenticateUseCase{
    constructor(private authService: IAuthService, private usersRepository: IUsersRepository) { }

    async execute(email: string, password: string) {
        if (!email || !password) {
            throw new Error("Email e senha são obrigatórios.");
        }

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new Error("Email ou senha inválidos.");
        }

        const isValidPassword = password === user[0].SENHA_CLIENTE;
        if (!isValidPassword) {
            throw new Error("Email ou senha inválidos.");
        }

        return this.authService.login(user[0]);
    }
}