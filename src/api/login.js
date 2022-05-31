import request from '@/utils/request'

// 登录请求
export const loginAPI = (data)=>{
    return request({
        method:'post',
        url:'login',
        data
    })
}

// 左侧列表请求menus
export const menusAPI = ()=>{
    return request({
        url:'menus',
    })
}
