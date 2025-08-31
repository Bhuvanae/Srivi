
// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';



export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details

    try {
        console.log(details, "details of the api")
        if (data.name == "createOrder") {

            try {
                const insert = await pool.query(
                    `SELECT create_orders($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                    [details.name, details.mobile, JSON.stringify(details.cartData), details.actual, details.amount, details.coupon, details.address, details.city, details.email]
                );

                console.log(insert.rows[0], 'result');

                if (!insert.rows[0]) {
                    console.log('check the value')
                    return json({ error: insert.rows[0].error })
                } else {
                    return json({ result: insert.rows[0] });
                }
            } catch (error) {
                console.error('Upload or DB Error:', error);
                return new Response(JSON.stringify({ error: 'Internal server error' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else if (data.name == "confirmOrder") {
            console.log(details)

            let update = await pool.query(`SELECT confirm_order1($1, $2,$3)`, [details.id, details.account, details.status])

            console.log(update.rows[0].confirm_order1, 'resultupdate')


            if (!update.rows[0].confirm_order1.status) {
                return json({ error: update.rows[0].confirm_order1.error })
            } else {
                console.log("check")
                return json({ result: update.rows[0].confirm_order1.message });
            }

        } else if (data.name == "deleteOrder") {
            console.log('check delete order')
            let deleteOrder = await pool.query(`delete from orders where id = $1`, [details.id])
            console.log(deleteOrder.rows[0], 'result')
            // if (!deleteOrder.rows[0]) {
            //     return json({ error: deleteOrder.rows[0].error })
            // } else {
            return json({ result: 'Order removed successfully' });
            // }
        } else if (data.name == 'getAccount') {
            console.log(details.id, 'id check ')
            let addFavorite = await pool.query(
                `SELECT confirm_order($1,$2)`,
                [details.id, 1]
            );
            console.log(addFavorite.rows[0], "favorite result")
            if (addFavorite.rows[0]) {
                return json({ error: addFavorite.rows[0].error })
            } else {
                return json({ result: "success" });
            }
        } else if (data.name == 'cartItems') {
            let addCart = await pool.query(
                `UPDATE crackers SET cart = cart + $2 WHERE id = $1`,
                [details.id, 1]
            );
            console.log(addCart.rows[0], "cart result ")
            if (addCart.rows[0]) {
                return json({ error: addCart.rows[0].error })
            } else {
                return json({ result: "success" });
            }
        }
    }
    catch (err) {
        console.log(err, 'test error')
        return { error: err.error }
    }

}

export async function GET({ request, url }) {

    let getData = await pool.query(`SELECT
    o.id AS order_id,
    o.status,
    o.name AS customer_name,
    o.email,
    o.number AS phone_number,
    o.createdat AS order_date,
    o.amount ,
    o.coupons,
    o.awd as amount_with_discount,
    o.confirmby,
   o.saddress as address,
   o.city,
    jsonb_agg(
        jsonb_build_object(
            'item_id', oi.itemid,
            'name', (select name from crackers where id=oi.itemid),
            'quantity', oi.nitems
        )
    ) AS items
FROM
    orders o
LEFT JOIN
    ordereditem oi ON o.id = oi.orderid
   
GROUP BY
    o.id
ORDER BY
    o.createdat DESC;`)





    let getAccount = await pool.query(`select account from admin`)
    console.log(getAccount.rows)

    let data = { list: getData.rows, account: getAccount.rows }


    let value = { result: data }

    return json(value)
}
