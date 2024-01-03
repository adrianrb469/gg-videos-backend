import { JWT } from "@fastify/jwt";
import { Stream } from "stream";

declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT;
        file: () => Promise<{
            fieldname: string;
            filename: string;
            file: Stream;
            encoding: string;
            mimetype: string;
            data: Stream;
            size: number;
            fields: {
                [key: string]: {
                    value: string;
                    encoding: string;
                    mimetype: string;
                };
            };
        }>;
    }
    export interface FastifyInstance {
        authenticate: any;
    }
}

type UserPayload = {
    id: number;
    email: string;
};

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: UserPayload;
    }
}

export { UserPayload };
