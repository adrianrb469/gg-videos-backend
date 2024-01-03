import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { logout, refresh } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
    app.get("/", async (req: FastifyRequest, res: FastifyReply) => {
        res.send({ message: "Success" });
    });

    app.get("/refresh", refresh);
    app.post("/logout", logout);
}
