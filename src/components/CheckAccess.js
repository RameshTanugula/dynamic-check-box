import * as securedLocalStorage from "./SecureLocalaStorage";





export const checkAccess = (screen, type) => {
    const roles = securedLocalStorage.get("roles");
    const currentRole = securedLocalStorage.get("currentrole");
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