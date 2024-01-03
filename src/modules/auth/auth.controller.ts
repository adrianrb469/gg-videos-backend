// authController.ts

import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../utils/prisma";
import { UserPayload } from "../../utils/types";

export async function refresh(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.code(401).send({ message: "No refresh token provided" });
    }

    let payload: UserPayload;
    try {
        payload = req.jwt.verify(refreshToken) as UserPayload;
    } catch (err) {
        return res.code(401).send({ message: "Invalid refresh token" });
    }

    const user = await prisma.users.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        return res.code(401).send({ message: "User not found" });
    }

    const newAccessToken = req.jwt.sign(
        {
            id: user.user_id,
            email: user.email,
        },
        { expiresIn: "15m" }
    );
    console.log("i has cookies", req.cookies);

    return res.code(200).send({
        user: {
            email: user.email,
            username: user.username,
            user_id: user.user_id,
            is_admin: user.is_admin,
        },
        access_token: newAccessToken,
    });
}

export async function logout(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.code(401).send({ message: "No refresh token provided" });
    }

    // Invalidate the refresh token in your database here

    res.clearCookie("refresh_token");

    return res.code(200).send({ message: "Logged out successfully" });
}
