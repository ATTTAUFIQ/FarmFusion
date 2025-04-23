import axios from 'axios';
export const backend_api='http://localhost:8000/api';
const api = axios.create({
    baseURL: backend_api,
    withCredentials: true,
});
export default api;
 export const  get=async (url:string)=>{
    return await api.get(url);
 }