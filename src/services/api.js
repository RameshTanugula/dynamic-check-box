import axios from "axios";
export default async function api(reqObj, url, type) {
    return await axios({
url: "http://localhost:3000" + url,
method: type,
headers: {
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