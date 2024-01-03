import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "./user.schema";
import { createUser, login } from "./user.controller";

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
        login
    );

    app.get(
        "/me",
        {
            preHandler: app.authenticate,
        },
        () => {
            return { message: "this is a private route!" };
        }
    );
}
