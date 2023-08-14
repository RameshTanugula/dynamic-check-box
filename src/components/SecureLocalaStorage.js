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
export const baseUrl = "http://52.66.163.55:8080/";
export const omrScriptUrl = "http://52.66.163.55:5000/"
export const subjectsUrl = baseUrl + 'files/get/subjects';

export const categoriesUrl = baseUrl + 'get/categories';
export const usersUrl = baseUrl + 'get/users/';
export const allActiveUsersUrl = baseUrl + 'users/list';


