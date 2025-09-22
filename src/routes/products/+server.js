// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';
import { count } from 'console';
// import { fsync } from 'fs';
import { check } from 'prettier';


export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details

    try {
        let imageResponse = {}

        if (data.name == "addCracker" || data.name == "updateCracker") {
            if (details.imageSrc && details.imageSrc !== null) {

                const API_KEY = '4254069028d7a8ad8ac35489b9b97bad';
                let base64 = details.imageSrc.replace(/^data:image\/\w+;base64,/, '')
                const formData = new FormData();
                formData.append('key', API_KEY);
                formData.append('image', base64);
                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });

                imageResponse = await response.json();

            }
        }
        if (data.name == "addCracker") {

            try {
                const insert = await pool.query(
                    `SELECT insert_multiple_crackers3($1)`,
                    [JSON.stringify({
                        item1: [{
                            name: details.name,
                            description: details.description,
                            image: imageResponse.data ? imageResponse.data.url : null,
                            type: details.type,
                            actualprice: details.actualprice,
                            discount: details.discount,
                            price: Math.trunc(details.actualprice * ((100 - details.discount) / 100)),
                            quantity: details.quantity,
                            videourl: details.videourl || null,
                            stocks: details.stocks,
                            deleteimg: imageResponse.data ? imageResponse.data.delete_url : null,
                        }]
                    })]
                );

                if (!insert.rows[0]) {
                    return json({ error: insert.rows[0].error })
                } else {
                    return json({ result: insert.rows[0].insert_multiple_crackers3.data[0] });
                }

            } catch (error) {
                console.error('Upload or DB Error:', error);
                return new Response(JSON.stringify({ error: 'Internal server error' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else if (data.name == "updateCracker") {
            let update = await pool.query(`SELECT * FROM bulk_update_crackers_json1($1)`, [JSON.stringify([
                {
                    id: details.id,
                    name: details.name,
                    description: details.description,
                    image: imageResponse.data ? imageResponse.data.url : details.image !== "" ? details.image : null,
                    type: details.type,
                    price: Math.trunc(details.actualprice * ((100 - details.discount) / 100)),
                    actualprice: details.actualprice,
                    cart: details.cart,
                    favorite: details.favorite,
                    discount: details.discount,
                    quantity: details.quantity,
                    videourl: details.videourl || null,
                    stocks: details.stocks,
                    deleteimg: imageResponse.data ? imageResponse.data.delete_url : null,
                },

            ])])

            if (!update.rows[0]) {
                return json({ error: update.rows[0].error })
            } else {
                return json({ result: update.rows[0].bulk_update_crackers_json1.data[0].to_jsonb });
            }

        } else if (data.name == "deleteCracker") {

            let update = await pool.query(`update crackers set active=FALSE where id=$1 RETURNING *;`, [details.id])
            console.log(update.rows[0], 'result')
            if (!update.rows[0].id) {
                return json({ error: update.rows[0].error })
            } else {
                return json({ result: update.rows[0] });
            }
        } else if (data.name == "re-addcracker") {
            let readd = await pool.query(`update crackers set active=TRUE where id=$1 RETURNING *;`, [details.id])
            console.log(readd.rows[0], 'result')
            if (!readd.rows[0].id) {
                return json({ error: readd.rows[0].error })
            } else {
                return json({ result: readd.rows[0] });
            }


        } else if (data.name == 'favorite') {
            console.log(details.id, 'id check ')
            let addFavorite = await pool.query(
                `UPDATE crackers SET favorite = favorite + $2 WHERE id = $1`,
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
        return { err }
    }

}

export async function GET({ request, url }) {

    let getData = await pool.query(`select * from crackers where type!='PACK'`)
    // let typeData = await pool.query(`SELECT jsonb_build_object('type', type, 'data', jsonb_agg(jsonb_build_object('id', id, 'name', name, 'description', description, 'image', image, 'type', type, 'actualprice', actualprice, 'discount', discount, 'price', price, 'quantity', quantity, 'favorite', favorite, 'cart', cart, 'created_at', created_at, 'stocks', stocks,'videourl',videourl))) AS result FROM crackers where active= TRUE GROUP BY type;`)
    let typeData = await pool.query(`SELECT jsonb_build_object(
    'type', type,
    'data', jsonb_agg(
        jsonb_build_object(
            'id', id,
            'name', name,
            'description', description,
            'image', image,
            'type', type,
            'actualprice', actualprice,
            'discount', discount,
            'price', price,
            'quantity', quantity,
            'favorite', favorite,
            'cart', cart,
            'created_at', created_at,
            'stocks', stocks,
            'videourl', videourl
        ) ORDER BY price ASC
    )
) AS result
FROM crackers
WHERE active = TRUE
GROUP BY type
ORDER BY MIN(created_at) DESC;`)
    let data = { list: getData.rows, type: typeData.rows }

    let value = { result: data }

    return json(value)
}