import { FastifyInstance } from "fastify";
import { FastifyAdapter } from "../adapters/fastify-adapter";
import { authMiddlewareFactory } from "@/infra/factories/auth.factory";
import { notasControllerFactory } from "@/infra/factories/notas.factory";

export async function notasRoutes(app: FastifyInstance) {
    const {
        countNotasController,
        downloadXmlByChaveController,
        findByFiltersController,
        listNotasController,
        heelsReportController
    } = notasControllerFactory();
    const { authMiddleware } = authMiddlewareFactory();

    app.addHook("preHandler", authMiddleware.verify.bind(authMiddleware));

    app.get("/", FastifyAdapter.handle(listNotasController));
    app.get("/count", FastifyAdapter.handle(countNotasController));
    app.get("/filter", FastifyAdapter.handle(findByFiltersController));
    app.get("/download/:chave", FastifyAdapter.handle(downloadXmlByChaveController));
    app.get("/heels/report", FastifyAdapter.handle(heelsReportController));
}