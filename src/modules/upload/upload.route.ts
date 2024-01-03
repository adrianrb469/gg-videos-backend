import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { newSubmission } from "./upload.controller";

export async function uploadRoutes(app: FastifyInstance) {
    app.post("/submission", newSubmission);
}
