import fastify from "fastify";
import { env } from "./infra/env";
import { ZodError } from "zod";
import cors from '@fastify/cors'
import { authRoutes } from "./presentation/http/routes/authRoutes";
import { userRoutes } from "./presentation/http/routes/userRoutes";
import { notasRoutes } from "./presentation/http/routes/notasRoutes";

export const app = fastify();

app.register(cors, {
    origin: [
        'http://localhost:3000',
        'https://api.speedautomac.app.br',
        'https://api.speedautomac.app.br:5445',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
})

app.register(async (api) => {
    api.register(authRoutes, { prefix: '/auth' });
    api.register(userRoutes, { prefix: '/users' });
    api.register(notasRoutes, { prefix: '/notas' })
}, { prefix: '/api/v1' });

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: Here we should log to an external tool like Sentry
    }

    return reply.status(500).send({ message: 'Internal server error' });
});