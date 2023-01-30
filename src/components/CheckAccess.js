import * as securedLocalStorage from "./SecureLocalaStorage";



const roles = securedLocalStorage.get("roles");

export const checkAccess = (screen, role, type) => {
    let value = false;
    roles?.forEach(e => {
        if (e.page.toLowerCase() === screen.toLowerCase()) {
            e?.roles?.forEach(ele => {
                if (ele.role === role) {
                    value = ele[type];
                }
            })
        }
    });

    return value;
}