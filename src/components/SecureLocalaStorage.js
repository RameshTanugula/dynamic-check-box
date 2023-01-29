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

export const basUrl = "http://65.0.6.118:8080/";
export const subjectsUrl=basUrl + 'files/get/subjects';

export const categoriesUrl=basUrl + 'get/categories';
export const usersUrl=basUrl + 'get/users/';


