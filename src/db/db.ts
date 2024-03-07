import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.PGDATABASE
});

const db = drizzle(pool, { schema });

export default db;