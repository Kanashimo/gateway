import { z } from "zod"
import "dotenv/config"

const booleanFromString = z.preprocess((value) => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return value;
}, z.boolean());

const AppConfigSchema = z.object({
    listen_port: z.coerce.number().int().min(1).max(65535).default(3000),
    session_duration: z.coerce.number().int().min(1).default(60),
    domain: z.string().default("http://localhost:" + (process.env.LISTEN_PORT || 3000))
});

type AppConfig = z.infer<typeof AppConfigSchema>;

const result = AppConfigSchema.safeParse({
    listen_port: process.env.LISTEN_PORT,
    session_duration: process.env.SESSION_DURATION,
    domain: process.env.DOMAIN
})

if (!result.success) {
    console.error("CONFIG FILE ERROR\n", z.prettifyError(result.error));
    process.exit(1);
}

const config: AppConfig = result.data

export type { AppConfig }
export default config
export { AppConfigSchema }