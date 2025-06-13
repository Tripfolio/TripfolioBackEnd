const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
require("dotenv").config();

//多資料庫支援
const poolMember = new Pool ({
	connectionString: process.env.DATABASE_MEMBER,
});

const poolSchedule = new Pool ({
	connectionString: process.env.DATABASE_SCHEDULE,
});

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const dbMember = drizzle(poolMember);
const dbSchedule = drizzle(poolSchedule);

const db = drizzle(pool);
module.exports = { db, dbMember, dbSchedule };

