import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: 'aes' });

export const set = (key, value) => {
    ls.set(key, value);
}

export const get = (key) => {
    return ls.get(key)
}

export const remove = (key) => {
    ls.remove(key)
}

// export const baseUrl = "http://65.0.6.118:8080/";
export const baseUrl = "http://3.6.37.141:8080/";
export const omrScriptUrl = "http://3.6.37.141:5000/"
export const subjectsUrl = baseUrl + 'files/get/subjects';

export const categoriesUrl = baseUrl + 'get/categories';
export const usersUrl = baseUrl + 'get/users/';
export const allActiveUsersUrl = baseUrl + 'users/list';


