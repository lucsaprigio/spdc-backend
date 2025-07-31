import { IController } from "@/application/repositories/IController";
import { AppError } from "@/core/shared/errors/AppError";
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

export class FastifyAdapter {

    static handle(controller: IController<unknown, unknown>) {
        return new FastifyAdapter(controller).execute;
    }

    constructor(private controller: IController<unknown, unknown>) {
        this.execute = this.execute.bind(this);
    }

    private async execute(request: FastifyRequest, reply: FastifyReply) {
        try {
            const requestData = {
                ...(request.body || {}),
                ...(request.params || {}),
                ...(request.query || {})
            }

            const response = await this.controller.handle(requestData);

            if (this.isXmlResponse(response)) {
                const { file } = response;
                const { chave } = request.params as any;

                reply.header('Content-type', 'aplication/xml')
                    .header('Content-Disposition', `attachment; filename="${chave}.xml"`)
                    .send(file);
            } else {
                reply.send(response)
            }
        } catch (error) {
            this.handleError(error, reply);
        }
    }

    private isXmlResponse(response: unknown): response is { file: string } {
        return (
            typeof response === 'object' &&
            response !== null &&
            'file' in response &&
            typeof (response as { file: unknown }).file === 'string'
        );
    }

    private handleError(error: unknown, reply: FastifyReply) {
        console.error('Adapter error: ', error);
        if (error instanceof AppError) {
            reply.status(error.statusCode).send({
                error: error.message,
                statusCode: error.statusCode
            })
        } else {
            reply.status(500).send({
                error: 'Internal server Error',
            })
        }
    }
}