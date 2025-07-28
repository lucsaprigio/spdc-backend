import { FindUserByIdController } from "@/presentation/http/controllers/FindUserByIdController";
import { UserRepository } from "../repositories/users-repository";
import { cacheFactory } from "./cache.factory";
import { firebirdFactory } from "./firebird.factory";
import { FindUserById } from "@/application/use-cases/find-user-by-id";

export const userRepositoryFactory = () => {
    return new UserRepository(
        firebirdFactory(),
        cacheFactory()
    )
}

export const usersUseCaseFactory = () => {
    const repository = userRepositoryFactory();

    return {
        findUserByIdUseCase: new FindUserById(repository)
    }
}

export const usersControllerFactory = () => {
    const useCases = usersUseCaseFactory();

    return {
        findUserController: new FindUserByIdController(useCases.findUserByIdUseCase),
    }
}
