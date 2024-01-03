import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";
import fs from "fs";
import https from "https";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
import { Readable } from "stream";
const pump = promisify(pipeline);

const REGION = "";
const BASE_HOSTNAME = "storage.bunnycdn.com";
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = "ggreviews";
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const CDN_URL = "https://ggreviews.b-cdn.net";

export async function newSubmission(req: FastifyRequest, reply: FastifyReply) {
    try {
        const data = await req.file();
        if (!data) {
            return reply.code(400).send({
                message: "No file uploaded",
            });
        }
        const email = data.fields.email.value;
        const review = data.fields.review.value;
        const rating = data.fields.rating.value;

        if (!email || !review || !rating) {
            return reply.code(400).send({
                message: "Missing required fields",
            });
        }
        const filename = encodeURIComponent(data.filename);
        const video_url = `${CDN_URL}/referrals/${filename}`;

        const submission = await prisma.submissions.create({
            data: {
                email: email,
                review: review,
                rating: +rating,
                video_url: video_url,
            },
        });

        const extension = path.extname(data.filename);

        // Upload to BunnyCDN
        const options = {
            method: "PUT",
            host: HOSTNAME,
            path: `/${STORAGE_ZONE_NAME}/referrals/${filename}`,
            headers: {
                AccessKey: ACCESS_KEY,
                "Content-Type": "application/octet-stream",
            },
        };

        console.log("here");
        const req2 = https.request(options, (res) => {
            console.log(res);
            res.on("data", (chunk) => {
                console.log(chunk.toString("utf8"));
            });
        });
        req2.on("error", (error) => {
            console.log("here");
            console.error(error);
        });
        await pump(data.file, req2);
        // await pump(data.file, fs.createWriteStream(data.filename));
        reply.code(201).send({
            message: "File uploaded successfully",
            submission: submission,
        });
    } catch (err) {
        console.error(err);
        reply.code(500).send({
            message: "An error occurred while uploading the file",
        });
    }
}
