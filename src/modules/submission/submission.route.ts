import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
    getSubmissions,
    approveSubmission,
    rejectSubmission,
} from "./submission.controller";

export async function submissionRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: app.authenticate }, getSubmissions);

    app.post(
        "/approve/:id",
        { preHandler: app.authenticate },
        approveSubmission
    );

    app.post("/reject/:id", { preHandler: app.authenticate }, rejectSubmission);
}
