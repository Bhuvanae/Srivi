// @ts-nocheck

import { json } from "@sveltejs/kit";
import pool from "../../../static/db";




export async function GET() {

    let getFeedback = await pool.query(`select * from feedback order by  createdat, stars  desc limit 5`)
    let typeData = await pool.query(`SELECT jsonb_build_object('type', type, 'data', jsonb_agg(jsonb_build_object('id', id, 'name', name, 'description', description, 'image', image, 'type', type, 'actualprice', actualprice, 'discount', discount, 'price', price, 'quantity', quantity, 'favorite', favorite, 'cart', cart, 'created_at', created_at, 'stocks', stocks,'videourl',videourl))) AS result FROM crackers where active= TRUE GROUP BY type;`)

    let packs = []

    if (typeData.rows) {
        typeData.rows.forEach(item => {
            if (item.result.type == 'PACK') {
                packs = item.result.data
            }
        })
    }

    let value = { result: { feed: getFeedback.rows, typeData: typeData.rows, packData: packs } }

    return json(value)
}