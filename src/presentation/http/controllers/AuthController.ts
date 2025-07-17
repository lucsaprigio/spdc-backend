import { Authenticate } from "@/application/use-cases/authenticate";
import { FirebirdError } from "@/core/shared/errors/FirebirdError";
import { NodeCacheProvider } from "@/infra/cache/NodeCacheProvider";
import { UserRepository } from "@/infra/repositories/users-repository";
import { FirebirdService } from "@/infra/services/firebird.service";
import { JwtService } from "@/infra/services/jwt.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
    private usersRepository: UserRepository;
    private jwtService: JwtService;
    private authenticate: Authenticate;

    constructor() {
        const firebirdService = new FirebirdService;
        const cacheProvider = new NodeCacheProvider(300);

        this.usersRepository = new UserRepository(firebirdService, cacheProvider);
        this.jwtService = new JwtService(this.usersRepository);
        this.authenticate = new Authenticate(this.jwtService, this.usersRepository);
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
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
    }
}