import { app } from "./app";
import {env } from './infra/env';

app.listen({
    host: '0.0.0.0',
    port: 3333

}).then(() => {
    console.log (`💥 Server started at http://localhost:${env.PORT}/api/v1`)
})