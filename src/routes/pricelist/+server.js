// @ts-nocheck
import pool from '../../../static/db';
import { json } from '@sveltejs/kit';
import jsPDF from 'jspdf';


export async function POST({ request, cookies }) {
    let data = await request.json();
    console.log(data, 'api')
    let details = data.details

    try {

        console.log(details, "details of the api")
        if (data.name == "getImage") {
        } else if (data.name == "createPdf") {
            const pdf = new jsPDF();
            pdf.text(details.html, 10, 10);

            const pdfBytes = pdf.output('arraybuffer');

            return new Response(pdfBytes, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="crackers-list.pdf"'
                }
            });
        } else if (data.name == 'updateBulk') {
            let updateBulk = await pool.query(`SELECT update_crackers_stock_bulk($1)`, [JSON.stringify(details)])

            console.log(updateBulk.rows[0])

            if (!updateBulk.rows[0]) {
                return json({ error: updateBulk.rows[0].error })
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

