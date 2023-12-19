import Fastify from 'fastify';

const app = Fastify({ logger: true });

async function main() {
    await app.listen({
        port: 3000,
        host: '0.0.0.0'
    });
}

app.get('/healthcheck', (req, res) => {
    res.send({ message: 'Success' })
  })

main();

