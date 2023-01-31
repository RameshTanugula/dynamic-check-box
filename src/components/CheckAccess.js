import * as securedLocalStorage from "./SecureLocalaStorage";
import jwt_decode from "jwt-decode";

export const checkAccess = (screen, type) => {
    const userdata = jwt_decode(securedLocalStorage.get("token"));
    const roles = userdata?.userRoles;
    const currentRole = userdata?.userRoleName;
    let value = false;
    roles?.forEach(e => {
        if (e.page.toLowerCase() === screen.toLowerCase()) {
            e?.roles?.forEach(ele => {
                if (ele.role === currentRole) {
                    value = ele[type];
                }
            })
        }
    });

    return value;
}