import { IController } from "@/application/repositories/IController";
import { AuthenticateUseCase } from "@/application/use-cases/authenticate-use-case";
import { User } from "@/domain/spdc/dto/users";

export class LoginController implements IController<{ email: string, password: string }, { token: string, users: User[] | null }> {
    constructor(
        private authenticateUseCase: AuthenticateUseCase
    ) { }

    async handle(request: { email: string; password: string; }) {
        return this.authenticateUseCase.execute(request.email, request.password);
    }
}