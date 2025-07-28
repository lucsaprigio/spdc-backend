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

    /*     async login(request: FastifyRequest, reply: FastifyReply) {
            const { email, password } = request.body as { email: string, password: string };
    
            try {
                const { token, users } = await this.authenticate.execute(email, password);
                return reply.status(200).send({ token, users });
            } catch (error) {
                if (error instanceof FirebirdError) {
                    return reply.status(error.statusCode).send({
                        error: {
                            ...error.toJSON(),
                        }
                    });
                }
    
                const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
                return reply.status(401).send({ error: errorMessage });
            }
        } */
}