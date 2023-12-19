import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "./user.schema";
import { createUser } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
    app.get("/", async (req: FastifyRequest, res: FastifyReply) => {
        res.send({ message: "Success" });
    });

    app.post(
        "/register",
        {
            schema: {
                body: $ref("createUserSchema"),
                response: {
                    201: $ref("createUserResponseSchema"),
                },
            },
        },
        createUser
    );

    app.post(
        "/login",
        {
            schema: {
                body: $ref("loginSchema"),
                response: {
                    201: $ref("loginResponseSchema"),
                },
            },
        },
        () => {}
    );

    app.delete("/logout", () => {});

    app.log.info("user routes registered");
}
