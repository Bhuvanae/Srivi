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
        if (data.name == 'addCoupen') {
            console.log('check works')

            console.log(details, 'id check ')
            let addCoupen = await pool.query(
                `insert into coupons(coupon, discount, min_amount, max_dis, expiredat)values($1, $2, $3, $4, $5)`,
                [details.code || null, details.discount || null, details.minAmount || null, details.maxDiscount || null, details.expDate ? `${details.expDate} 23:59:59` : null]
            );
            console.log(addCoupen.rows[0], "favorite result")
            if (addCoupen.rows[0]) {
                return json({ error: addCoupen.rows[0].error })
            } else {
                return json({ result: "success" });
            }
            // insert into coupons(coupon, discount, min_amount, max_dis, expiredat)values('THUG', 10, 1000, 40, '2025-06-15 14:30:00-05')
        } else if (data.name == 'delete') {
            let addCoupen = await pool.query(
                `delete from coupons where id=$1`,
                [details.id]
            );
            console.log(addCoupen.rows[0], "favorite result")
            if (addCoupen.rows[0]) {
                return json({ error: addCoupen.rows[0].error })
            } else {
                return json({ result: "success" });
            }
        } else if (data.name == "getDetails") {
            let getCoupon = await pool.query(
                `select * from get_coupon_details($1)`,
                [details.value]
            );
            console.log(getCoupon.rows[0], "favorite result")
            if (getCoupon.rows[0] == null) {
                return json({ error: getCoupon.rows[0].error })
            } else {
                return json({ result: getCoupon.rows[0] });
            }
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