import API from "./api";

export const getListProducts = async (info) => {
    const result = await API.get('/list-product', {params: info})
    return result.data;
}


export const addProduct = async (info) => {
    const result = await API.post('/add-product', info)
    return result.data;
}
export const updateProductService = async (info) => {
    const result = await API.post('/update-product', info)
    return result.data;
}
export const getFeeByIdProductService = async (info) => {
    const result = await API.get('/get-fee', {params: info})
    return result.data;
}