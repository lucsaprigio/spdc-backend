import { FastifyInstance } from "fastify";
import { FastifyAdapter } from "../adapters/fastify-adapter";
import { usersControllerFactory } from "@/infra/factories/user.factory";

export async function userRoutes(app: FastifyInstance) {
    const controller = usersControllerFactory();

    app.get('/:id', FastifyAdapter.handle(controller.findUserController));
}