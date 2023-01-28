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


