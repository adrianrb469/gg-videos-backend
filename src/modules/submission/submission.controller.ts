import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";

interface Query {
    page?: string;
    limit?: string;
}

export async function getSubmissions(
    req: FastifyRequest<{ Querystring: Query }>,
    reply: FastifyReply
) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 10;

    const submissions = await prisma.submissions.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            submission_id: "desc",
        },
    });

    reply.code(200).send(submissions);
}

export async function approveSubmission(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = req.params;

    const submission = await prisma.submissions.update({
        where: {
            submission_id: Number(id),
        },
        data: {
            status: 1,
        },
    });

    reply.code(200).send(submission);
}

export async function rejectSubmission(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    const { id } = req.params;

    const submission = await prisma.submissions.update({
        where: {
            submission_id: Number(id),
        },
        data: {
            status: 2,
        },
    });

    reply.code(200).send(submission);
}
