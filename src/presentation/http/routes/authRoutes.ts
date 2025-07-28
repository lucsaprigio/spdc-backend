import { FastifyInstance } from "fastify";
import { LoginController } from "../controllers/LoginController";
import { authControllerFactory, authDependenciesFactory } from "@/infra/factories/auth.factory";
import { userRepositoryFactory } from "@/infra/factories/user.factory";
import { FastifyAdapter } from "../adapters/fastify-adapter";

export async function authRoutes(app: FastifyInstance) {
    const { loginController } = authControllerFactory();

    app.post('/login', FastifyAdapter.handle(loginController))
}