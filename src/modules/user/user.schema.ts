import {z} from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;

const createUserResponseSchema = z.object({
    user_id: z.string(),
    email: z.string(),
    username: z.string().optional(),
})

const loginSchema = z.object({
    email: z.string(
        {
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }
    ).email(),
    password: z.string().min(6),
})

export type LoginInput = z.infer<typeof loginSchema>;

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
});
    