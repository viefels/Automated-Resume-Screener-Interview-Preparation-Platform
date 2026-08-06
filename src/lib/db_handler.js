import { Pool } from "pg";

const poolConfig = {
    max:5,
    min:2,
    idleTimeoutMillis:600000
};
const Database = "mydb";
const Username = "myuser";
const Password = "mypassword";

poolConfig.connectionString = `postgres://${Username}:${Password}@localhost:5432/${Database}`;

const client = new Pool(poolConfig);

export default async function updateDB(token) {
    try {
        const query = {
            text: `UPDATE test_token
            SET value = $1,
            created_on = $2
            WHERE key = $3
            `,
            values: [token, new Date(), "test_token"]
        };

        const res = await client.query(query);
        return res;
    } catch (err) {
        // Handle or log error here
        console.error("Database update failed:", err);
        throw err; // Re-throw if you need the caller to know it failed
    }
}