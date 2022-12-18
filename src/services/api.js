import axios from "axios";
export default async function api(reqObj, url, type) {
    return await axios({
url:  url,
method: type,
headers: {
    "Authorization":"1"
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