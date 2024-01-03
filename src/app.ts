import Fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "./modules/auth/auth.route";
import { uploadRoutes } from "./modules/upload/upload.route";
import { submissionRoutes } from "./modules/submission/submission.route";

const app = Fastify({ logger: true });

const CLIENT_URL = process.env.CLIENT_URL || "http://127.0.0.1:4173";

app.register(cors, {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});

app.register(require("@fastify/multipart"), {
    attachFieldsToBody: "true",
});

//jwt
app.register(fjwt, {
    secret: process.env.ACCESS_TOKEN as string,
});

app.options("/upload/submission", async (request, reply) => {
    reply
        .code(204)
        .header("Access-Control-Allow-Origin", CLIENT_URL)
        .header("Access-Control-Allow-Methods", "POST")
        .header("Access-Control-Allow-Headers", "Content-Type")
        .send();
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
app.register(uploadRoutes, { prefix: "/upload" });
app.register(submissionRoutes, { prefix: "/submissions" });

app.decorate("authenticate", async (req: FastifyRequest, res: FastifyReply) => {
    try {
        await req.jwtVerify();
    } catch (e) {
        res.status(403).send({ message: "Authentication required" });
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

// Shutsdown the server gracefully
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await app.close();
        process.exit(0);
    });
});

main();
