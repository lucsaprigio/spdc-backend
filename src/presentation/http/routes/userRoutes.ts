import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";

export async function userRoutes(app: FastifyInstance) {
    const userController = new UserController();

    app.get('/:id', async (req, reply) => userController.findUser(req, reply));
}