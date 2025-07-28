import { ListNotasByCnpjDateUseCase } from "@/application/use-cases/list-notas-by-cnpj-date"
import { NotasRepository } from "../repositories/notas-repository"
import { cacheFactory } from "./cache.factory"
import { firebirdBlobFactory, firebirdFactory } from "./firebird.factory"
import { CountNotasByCnpjUseCase } from "@/application/use-cases/count-notas-by-cnpj"
import { FindByFiltersUseCase } from "@/application/use-cases/find-by-filters"
import { DownloadXmlByChaveUseCase } from "@/application/use-cases/download-xml-by-chave-use-case"
import { ListNotasController } from "@/presentation/http/controllers/ListNotasController"
import { CountNotasController } from "@/presentation/http/controllers/CountNotasController"
import { DownloadXmlByChaveController } from "@/presentation/http/controllers/DownloadXmlByChaveController"
import { FindByFiltersController } from "@/presentation/http/controllers/FindByFiltersController"

export const notasRepositoryFactory = () => {
    return new NotasRepository(
        firebirdFactory(),
        firebirdBlobFactory(),
        cacheFactory()
    )
}

export const notasUseCaseFactory = () => {
    const repository = notasRepositoryFactory();

    return {
        listNotasByCnpjDateUseCase: new ListNotasByCnpjDateUseCase(repository),
        countNotasByCnpjUseCase: new CountNotasByCnpjUseCase(repository),
        findByFiltersUseCase: new FindByFiltersUseCase(repository),
        downloadXmlByChaveUseCase: new DownloadXmlByChaveUseCase(repository)
    }
}

export const notasControllerFactory = () => {
    const useCases = notasUseCaseFactory();

    return {
        listNotasController: new ListNotasController(useCases.listNotasByCnpjDateUseCase),
        countNotasController: new CountNotasController(useCases.countNotasByCnpjUseCase),
        downloadXmlByChaveController: new DownloadXmlByChaveController(useCases.downloadXmlByChaveUseCase),
        findByFiltersController: new FindByFiltersController(useCases.findByFiltersUseCase)
    }
}