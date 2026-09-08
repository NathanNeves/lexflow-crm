import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./lexflow.db"),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every day session is extended)
  },
  // Set the base URL for the server
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
});
