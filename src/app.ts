import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "./modules/auth/auth.route";

const app = Fastify({ logger: true });

//jwt
app.register(fjwt, {
    secret: process.env.ACCESS_TOKEN as string,
});

app.addHook("preHandler", (req, res, next) => {
    req.jwt = app.jwt;
    return next();
});

// cookies
app.register(fCookie, {
    secret: "some-secret-key",
    hook: "preHandler",
});

app.register(userRoutes, { prefix: "/users" });
app.register(authRoutes, { prefix: "/auth" });

app.decorate("authenticate", async (req: FastifyRequest, res: FastifyReply) => {
    try {
        await req.jwtVerify();
    } catch (e) {
        res.status(401).send({ message: "Authentication required" });
    }
});

for (let schema of [...userSchemas]) {
    app.addSchema(schema);
}

async function main() {
    await app.listen({
        port: 3000,
        host: "0.0.0.0",
    });
}

app.get("/healthcheck", (req, res) => {
    res.send({ message: "Success" });
});

// Shutsdown the server gracefully
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await app.close();
        process.exit(0);
    });
});

main();
