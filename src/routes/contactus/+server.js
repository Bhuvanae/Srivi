// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';
// import { count } from 'console';
// import { fsync } from 'fs';
// import { check } from 'prettier';
// import fs from 'fs';
// import path from 'path';
// import jsPDF from 'jspdf';


export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details
    console.log(details, "details of the api")


    try {
        if (data.name == 'addfeedback') {
            console.log('check works')

            console.log(details, 'id check ')
            let addfeedback = await pool.query(
                `insert into feedback(name,email,message,stars)values($1,$2,$3,$4)`,
                [details.name || null, details.email || null, details.message || null, details.rating || 5]
            );
            console.log(addfeedback.rows[0], "favorite result")
            if (addfeedback.rows[0]) {
                return json({ error: addfeedback.rows[0].error })
            } else {
                return json({ result: "success" });
            }
            // insert into coupons(coupon, discount, min_amount, max_dis, expiredat)values('THUG', 10, 1000, 40, '2025-06-15 14:30:00-05')
        }
    }
    catch (err) {
        console.log(err, 'test error')
        return { err }
    }

}

export async function GET({ request, url }) {

    let getCoupons = await pool.query(`select * from coupons`)

    let data = { coupons: getCoupons.rows }
    let value = { result: data }

    return json(value)
}