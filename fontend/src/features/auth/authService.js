import API from "../../services/api";

export const login = async (info) => {
    const result = await API.post('/auth/login', info)
    return result.data;
}


export const register = async (info) => {
    const result = await API.post('/auth/register', info)
    return result.data;
}