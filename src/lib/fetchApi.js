// @ts-nocheck

export async function fetchApi(url, method, name, details) {
    if (method == 'POST') {
        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify({ name, details }),
                headers: {
                    'content-type': 'application/json'
                }
            });

            let data = await response.json();
            let status = response.status
            if (data.result) {
                return { data: data.result, resStatus: 200 }
            } else {
                return { data: data.error || data.message, resStatus: 422 }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return { error: error, status }
        }
    } else if (method == 'GET') {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'content-type': 'application/json'
                }
            });

            let data = await response.json();
            let status = response.status
            if (data.result) {
                return { data: data.result, resStatus: 200 }
            } else {
                return { data: data.error || data.message, resStatus: 422 }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            return { error: error, status }
        }
    }

}