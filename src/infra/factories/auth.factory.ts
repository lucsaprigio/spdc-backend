import { IAuthService } from "@/domain/interfaces/IAuthService";
import { JwtService } from "../services/jwt.service";
import { AuthenticateUseCase } from "@/application/use-cases/authenticate-use-case";
import { userRepositoryFactory } from "./user.factory";
import { LoginController } from "@/presentation/http/controllers/LoginController";
import { AuthMiddleware } from "@/presentation/http/middlewares/auth.middleware";

export const authDependenciesFactory = () => {
    const userRepository = userRepositoryFactory();
    const jwtService = new JwtService(userRepository);
    const authService: IAuthService = new JwtService(userRepository);

    return {
        authService,
        authenticateUseCase: new AuthenticateUseCase(authService, userRepository),
        jwtService,
    }
}

export const authMiddlewareFactory = () => {
    const { jwtService } = authDependenciesFactory();

    return {
        authMiddleware: new AuthMiddleware(jwtService)
    }
}

export const authControllerFactory = () => {
    const { authenticateUseCase } = authDependenciesFactory();

    return {
        loginController: new LoginController(authenticateUseCase)
    }
}