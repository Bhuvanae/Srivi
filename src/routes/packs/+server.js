
// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';



export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details

    try {
        if (data.name == "createPack") {
            console.log('whith in the limit')
            let imageResponse = ""

            if (details.imageSrc !== null) {

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

            // 
            try {
                const insert = await pool.query(
                    `SELECT insert_cracker_pack1($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                    [details.name, details.description, imageResponse.data ? imageResponse.data.url : null, (((100 - details.discount) / 100) * details.actualprice).toFixed(0), details.actualprice, details.discount, details.quantity, null, details.stocks, JSON.stringify(details.items)]
                );

                console.log(insert.rows[0], 'result');

                if (!insert.rows[0]) {
                    console.log('check the value')
                    return json({ error: insert.rows[0].error })
                } else {
                    return json({ result: { message: "Pack added successfully", details: { id: insert.rows[0].insert_cracker_pack1, name: details.name, description: details.description, image: details.image ? details.image : imageResponse.data.url, actualprice: details.actualprice, contents: details.items, created_at: details.created_at, discount: details.discount, price: (((100 - details.discount) / 100) * details.actualprice).toFixed(0), quantity: details.quantity, stocks: details.stocks, videourl: null, created_at: new Date().toISOString() } } });
                }
            } catch (error) {
                console.error('Upload or DB Error:', error);
                return new Response(JSON.stringify({ error: 'Internal server error' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else if (data.name == "updatePack") {

            let imageResponse = ""
            console.log(details.imageSrc, "image src test for the ")

            if (details.imageSrc !== null && details.imageSrc) {

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
                // console.log('Image URL:', imageResponse.data.url);
            } else {
                console.log('else in image url')
            }


            let update = await pool.query(`SELECT update_cracker_pack($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, [details.id, details.name, details.description, details.imageSrc ? imageResponse.data.url : details.imageSrc, ((100 - details.discount) / 100) * details.actualprice, details.actualprice, details.discount, details.quantity, null, details.stocks, JSON.stringify(details.items)])

            console.log(update.rows[0], 'resultupdate')


            if (!update.rows[0]) {
                return json({ error: update.rows[0].confirm_order1.error })
            } else {
                console.log("check")
                return json({ result: { message: "Pack updated successfully", details: { id: details.id, name: details.name, description: details.description, image: details.image ? details.image : imageResponse.data.url, actualprice: details.actualprice, contents: details.items, created_at: details.created_at, discount: details.discount, price: ((100 - details.discount) / 100) * details.actualprice, quantity: details.quantity, stocks: details.stocks, videourl: null, created_at: details.extraData.createdat } } });
            }

        } else if (data.name == "deletePack") {

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
    p.id ,
    p.name,
    p.description,
    p.image,
    p.price,
    p.actualprice,
    p.discount,
    p.quantity,
    p.videourl,
    p.stocks,
    p.active,
    p.created_at,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'itemid', c.id,
            'cracker_name', c.name,
            'nitems', pc.quantity
        )
    ) AS contents
FROM crackers p
JOIN pack_contents pc ON p.id = pc.pack_id
JOIN crackers c ON pc.cracker_id = c.id
WHERE p.type = 'PACK'
GROUP BY 
    p.id, p.name, p.description, p.image, p.price,
    p.actualprice, p.discount, p.quantity, 
    p.videourl, p.stocks, p.created_at;`)



    let crackersList = await pool.query(`select * from crackers where type!='PACK' and active=TRUE`)



    let data = { list: getData.rows, crackers: crackersList.rows }

    let value = { result: data }

    return json(value)
}
