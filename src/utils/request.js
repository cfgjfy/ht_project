import axios from 'axios'
import { getToken } from './auth'
const request = axios.create({
    baseURL: "http://liufusong.top:8899/api/private/v1/",
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
    const token = getToken()
    // 请求时将token 放入请求头字段中
    if (token) {
        config.headers.Authorization = token
    }
    return config
})
export default request
