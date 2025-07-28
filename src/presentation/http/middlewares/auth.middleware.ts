import { JwtService } from "@/infra/services/jwt.service";
import { FastifyReply, FastifyRequest } from "fastify";

// Extend FastifyRequest to include 'user'
declare module 'fastify' {
    interface FastifyRequest {
        user?: any;
    }
}

export class AuthMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async verify(request: FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            reply.code(401).send({ error: 'Token não fornecido' });
            return;
        }

        const result = await this.jwtService.validateToken(token);

        if (!result.isValid) {
            reply.code(429).send({ error: result.error })
            return;
        }

        request.user = result.payload;
    }
}