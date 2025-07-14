import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/AuthController";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController();

    app.post('/login', async (req, reply) => authController.login(req, reply));
}