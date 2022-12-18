import axios from "axios";
export default async function api(reqObj, url, type) {
    return await axios({
        url: url,
        method: type,
        headers: {
            "Authorization": "1",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
        data: reqObj,
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        });
}