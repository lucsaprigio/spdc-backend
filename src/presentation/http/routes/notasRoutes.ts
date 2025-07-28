import { FastifyInstance } from "fastify";
import { ListNotasController } from "../controllers/ListNotasController";
import { FirebirdService } from "@/infra/services/firebird.service";
import { NodeCacheProvider } from "@/infra/cache/NodeCacheProvider";
import { NotasRepository } from "@/infra/repositories/notas-repository";
import { FastifyAdapter } from "../adapters/fastify-adapter";
import { ListNotasByCnpjDateUseCase } from "@/application/use-cases/list-notas-by-cnpj-date";
import { CountNotasController } from "../controllers/CountNotasController";
import { CountNotasByCnpjUseCase } from "@/application/use-cases/count-notas-by-cnpj";
import { FindByFiltersController } from "../controllers/FindByFiltersController";
import { FindByFiltersUseCase } from "@/application/use-cases/find-by-filters";
import { FirebirdBlobService } from "@/infra/services/firebird.blob.service";
import { DownloadXmlByChaveUseCase } from "@/application/use-cases/download-xml-by-chave-use-case";
import { DownloadXmlByChaveController } from "../controllers/DownloadXmlByChaveController";
import { authControllerFactory, authMiddlewareFactory } from "@/infra/factories/auth.factory";
import { notasControllerFactory } from "@/infra/factories/notas.factory";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export async function notasRoutes(app: FastifyInstance) {
    const { countNotasController, downloadXmlByChaveController, findByFiltersController, listNotasController } = notasControllerFactory();
    const { authMiddleware } = authMiddlewareFactory();

    /*     const firebirdService = new FirebirdService();
        const firebirdBlobService = new FirebirdBlobService();
        const cacheProvider = new NodeCacheProvider(3600);
        const notasRepository = new NotasRepository(firebirdService, firebirdBlobService, cacheProvider);
    
        const listNotasByCnpjDateUseCase = new ListNotasByCnpjDateUseCase(notasRepository);
        const listNotasController = new ListNotasController(listNotasByCnpjDateUseCase);
    
        const countNotasByCnpjUseCase = new CountNotasByCnpjUseCase(notasRepository);
        const countNotasController = new CountNotasController(countNotasByCnpjUseCase);
    
        const findByFiltersUseCase = new FindByFiltersUseCase(notasRepository);
        const findByFiltersController = new FindByFiltersController(findByFiltersUseCase);
    
        const downloadXmlByChaveUseCase = new DownloadXmlByChaveUseCase(notasRepository);
        const downloadXmlByChaveController = new DownloadXmlByChaveController(downloadXmlByChaveUseCase); */

    app.addHook("preHandler", authMiddleware.verify.bind(authMiddleware));

    app.get("/", FastifyAdapter.handle(listNotasController));
    app.get("/count", FastifyAdapter.handle(countNotasController));
    app.get("/filter", FastifyAdapter.handle(findByFiltersController));
    app.get("/download/:chave", FastifyAdapter.handle(downloadXmlByChaveController));
}