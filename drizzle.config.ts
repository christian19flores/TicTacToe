import { defineConfig, Config } from 'drizzle-kit'
import 'dotenv/config';

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.PGDATABASE || '',
    },
    verbose: true,
    strict: true,
}) satisfies Config;