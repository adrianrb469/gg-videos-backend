import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";

const SALT_ROUNDS = 10;

export async function createUser(
    req: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {
    const { email, password, username } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            email,
        },
    });



    if (user) {
        return reply.code(401).send({
            message: "User already exists with this email",
        });
    }

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.users.create({
            data: {
                password: hash,
                email,
            },
        });

        return reply.code(201).send(user);
    } catch (e) {
        return reply.code(500).send(e);
    }
}
