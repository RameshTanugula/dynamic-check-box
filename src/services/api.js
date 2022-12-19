// import axios from "axios";
// export default async function api(reqObj, url, type) {
//     return await axios({
//         url: url,
//         method: type,
//         headers: {
//             "Authorization": "1",
//             "Access-Control-Allow-Origin": "http://master.d3iov9q4fsd2xh.amplifyapp.com/",
//             "Access-Control-Allow-Headers" : "Content-Type, Authorization, *",
//             "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
//             "Access-Control-Allow-Credentials": true,
//         },
//         data: reqObj,
//     })
//         .then((res) => {
//             return res;
//         })
//         .catch((err) => {
//             return err;
//         });
// }

import axios from "axios";
export default async function api(reqObj, url, type) {
    return await axios({
        url: url,
        method: type,
        headers: {
            "Authorization": "1",
            "Access-Control-Allow-Origin": "http://treeviewdatamapping-env.eba-jsbuwrm8.us-east-2.elasticbeanstalk.com/",
            "Access-Control-Allow-Headers" : "Content-Type, Authorization, *",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
            "Access-Control-Allow-Credentials": true,
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