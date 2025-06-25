// test.js
require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { sql } = require('drizzle-orm'); // <-- 關鍵：確保這行有被加入

async function testConnection() {
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    // 這裡必須是 Drizzle ORM 的 sql 模板字串，而不是原生 postgres 模板
    await db.execute(sql`SELECT 1`); // <-- 關鍵：確保是 sql`SELECT 1`，前面有 `sql`
    console.log("資料庫連線成功！");
  } catch (error) {
    console.error("資料庫連線失敗：", error);
  } finally {
    await client.end();
  }
}

testConnection();