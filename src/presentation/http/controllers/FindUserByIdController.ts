import { IController } from "@/application/repositories/IController";
import { FindUserById } from "@/application/use-cases/find-user-by-id";
import { FirebirdError } from "@/core/shared/errors/FirebirdError";
import { User } from "@/domain/spdc/dto/users";
import { FastifyReply, FastifyRequest } from "fastify";

export class FindUserByIdController implements IController<{ id: string }, User[] | null> {
    constructor(
        private findUserById: FindUserById
    ) { }

    async handle(request: { id: string }) {
        return this.findUserById.execute(request.id);
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