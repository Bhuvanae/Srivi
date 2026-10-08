// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details

    try {
        if (data.name == "signin") {
            if (!details.email && !details.password) {
                return json({ error: signin.rows[0].user_signin.error })
            } else {
                // return json({ result: signin.rows[0] });
                // return json({result:{resStatus:200, message: "success", id: 1}});
                const signin = await pool.query(`select * from admin where email='${details.email}' and password_hash='${details.password}'`)

                console.log(signin.rows[0], 'result')
                if (!signin.rows[0].id) {
                    return json({ error: signin.rows[0].user_signin.error })
                } else {
                    return json({ result: signin.rows[0] });
                }
                // bob1@example.com','12345678'
            }



        } else if (data.name == "forget") {
            const forget = await pool.query(`select * from forgot_password($1)`, [details.email])

            console.log(forget.rows[0].forgot_password, 'result')
            if (forget.rows[0].forgot_password.error) {
                return json({ error: forget.rows[0].forgot_password.error })
            } else {
                return json({ result: forget.rows[0].forgot_password });
            }
            // bob1@example.com','12345678'
        } else if (data.name == 'changePassword') {
            const changePass = await pool.query(`select * from update_password($1,$2,$3)`, [details.email, details.otp, details.password])

            console.log(changePass.rows[0].update_password, 'result')
            if (changePass.rows[0].update_password.error) {
                return json({ error: changePass.rows[0].update_password.error })
            } else {
                return json({ result: changePass.rows[0].update_password });
            }
        }
    }
    catch (err) {
        console.log(err, 'test error')
        return { err }
    }

}