import { FastifyInstance } from "fastify";
import { ListNotasController } from "../controllers/ListNotasController";
import { FirebirdService } from "@/infra/services/firebird.service";
import { NodeCacheProvider } from "@/infra/cache/NodeCacheProvider";
import { NotasRepository } from "@/infra/repositories/notas-repository";
import { adapterFastifyRoute } from "../adapters/fastify-adapter";
import { ListNotasByCnpjDateUseCase } from "@/application/use-cases/list-notas-by-cnpj-date";
import { CountNotasController } from "../controllers/CountNotasController";
import { CountNotasByCnpjUseCase } from "@/application/use-cases/count-notas-by-cnpj";
import { FindByFiltersController } from "../controllers/FindByFiltersController";
import { FindByFiltersUseCase } from "@/application/use-cases/find-by-filters";

export async function notasRoutes(app: FastifyInstance) {
    const firebirdService = new FirebirdService();
    const cacheProvider = new NodeCacheProvider(3600);
    const notasRepository = new NotasRepository(firebirdService, cacheProvider);

    const listNotasByCnpjDateUseCase = new ListNotasByCnpjDateUseCase(notasRepository);
    const listNotasController = new ListNotasController(listNotasByCnpjDateUseCase);

    const countNotasByCnpjUseCase = new CountNotasByCnpjUseCase(notasRepository);
    const countNotasController = new CountNotasController(countNotasByCnpjUseCase);

    const findByFiltersUseCase = new FindByFiltersUseCase(notasRepository);
    const findByFiltersController = new FindByFiltersController(findByFiltersUseCase)

    app.get("/", adapterFastifyRoute(listNotasController));
    app.get("/count", adapterFastifyRoute(countNotasController));
    app.get("/filter", adapterFastifyRoute(findByFiltersController));
}