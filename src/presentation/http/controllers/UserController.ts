import { FindUserById } from "@/application/use-cases/find-user-by-id";
import { FirebirdError } from "@/core/shared/errors/FirebirdError";
import { NodeCacheProvider } from "@/infra/cache/NodeCacheProvider";
import { UserRepository } from "@/infra/repositories/users-repository";
import { FirebirdService } from "@/infra/services/firebird.service";
import { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
    private readonly usersRepository: UserRepository;
    private readonly findUserById: FindUserById;

    constructor() {
        const firebirdService = new FirebirdService;
        const cacheProvider = new NodeCacheProvider(300);

        this.usersRepository = new UserRepository(firebirdService, cacheProvider);
        this.findUserById = new FindUserById(this.usersRepository);
    }

    async findUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        try {
            const user = await this.findUserById.execute(id);

            return reply.status(201).send({ user });
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