import { IController } from "@/application/repositories/IController";
import { FastifyReply, FastifyRequest } from "fastify";

interface IHttpRequest {
    header: Record<string, string>;
    body: any;
    params: Record<string, string>
    query: Record<string, string>;
}

interface IHttpResponse {
    statusCode: number;
    body: any;
}

export function adapterFastifyRoute(
    controller: IController<unknown, unknown>) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const requestData = {
                ...(request.body || {}),
                ...(request.params || {}),
                ...(request.query || {})
            }

            const response = await controller.handle(requestData);
            reply.send(response)
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: error })
        }
    }
}