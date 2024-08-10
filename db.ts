// src/db.ts
import { Pool } from "pg";
import { resourceLimits } from "worker_threads";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "35.193.128.97",
  database: process.env.DB_NAME || "surgeview-main",
  password: process.env.DB_PASSWORD || "_DzC*eqay/*M2@~S",
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfuly", result.rows[0]);
  } catch (err) {
    console.error("Databse connection error", err);
  }
};

export const query = (text: string, params?: any[]) => pool.query(text, params);
