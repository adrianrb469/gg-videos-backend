import Fastify from 'fastify';
import { userRoutes } from './modules/user/user.route';
import { userSchemas } from './modules/user/user.schema';

const app = Fastify({ logger: true});

app.register(userRoutes, { prefix: '/users' });

for (let schema of [...userSchemas]) {
    app.addSchema(schema);
}

async function main() {
    await app.listen({
        port: 3000,
        host: '0.0.0.0'
    });
}


app.get('/healthcheck', (req, res) => {
    res.send({ message: 'Success' })
  });

// Shutsdown the server gracefully
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await app.close();
        process.exit(0);
    });
}
);

main();

