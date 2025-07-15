import { FastifyInstance } from "fastify";
import { ListNotasController } from "../controllers/ListNotasController";
import { FirebirdService } from "@/infra/services/firebird.service";
import { NodeCacheProvider } from "@/infra/cache/NodeCacheProvider";
import { NotasRepository } from "@/infra/repositories/notas-repository";
import { adapterFastifyRoute } from "../adapters/fastify-adapter";
import { ListNotasByCnpjDateUseCase } from "@/application/use-cases/list-notas-by-cnpj-date";

export async function notasRoutes(app: FastifyInstance) {
    const firebirdService = new FirebirdService();
    const cacheProvider = new NodeCacheProvider(3600);
    const notasRepository = new NotasRepository(firebirdService, cacheProvider);
    const listNotasByCnpjDateUseCase = new ListNotasByCnpjDateUseCase(notasRepository)
    const listNotasController = new ListNotasController(listNotasByCnpjDateUseCase);

    app.get("/", adapterFastifyRoute(listNotasController));
}