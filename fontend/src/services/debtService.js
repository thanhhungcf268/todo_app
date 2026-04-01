import API from "./api";

export const getListDebtService = async (value) => {
    const results = await API.get('/list-debt', {params: value})
    return results.data;
}

export const getListDebtByUserService = async (idUser) => {
    const results = await API.get(`/list-debt/${idUser}`);
    return results.data;
}