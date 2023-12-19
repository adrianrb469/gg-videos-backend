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

export async function login(
    req: FastifyRequest<{
        Body: LoginInput;
    }>,
    reply: FastifyReply
) {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return reply.code(401).send({
            message: "User not found",
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return reply.code(401).send({
            message: "Incorrect password",
        });
    }

    const payload = {
        id: user.user_id,
        email: user.email,
    };

    const accessToken = req.jwt.sign(payload, { expiresIn: "15m" }); // access token expires in 15 minutes

    const refreshToken = req.jwt.sign(payload, { expiresIn: "7d" }); // refresh token expires in 7 days

    reply.setCookie("refresh_token", refreshToken, {
        path: "/",
        httpOnly: true,
    });

    return reply.code(200).send({
        message: "logged in",
        access_token: accessToken,
    });
}
