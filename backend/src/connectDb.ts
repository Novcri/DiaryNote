import { Client, createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const TURSO_URL = process.env.TURSO_URL;
const TURSO_TOKEN = process.env.TURSO_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
    throw new Error("Missing TURSO_URL or TURSO_TOKEN in environment variables.");
}

export const db: Client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
});
