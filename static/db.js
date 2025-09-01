// @ts-nocheck


import pkg from 'pg';
// import 'dotenv/config';
const { Pool } = pkg;


const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_vEH1iyhs4XtN@ep-calm-bird-a1lr7z4x-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }


})
export default pool