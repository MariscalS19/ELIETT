import mysql from "mysql2/promise";

//forcing the poo as global to avoid duplicates in next.js hot reload
const globalForDb = globalThis as unknown as {
    connPool: mysql.Pool | undefined;
};

export const pool =
    globalForDb.connPool ||
    mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

if (process.env.NODE_ENV !== "production") globalForDb.connPool = pool;

