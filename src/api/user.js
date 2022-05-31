import request from '@/utils/request'

// 获取用户列表数据
export const userAPI = (params) => {
    return request({
        url: 'users',
        params
    })
}

// 修改用户状态
export const stateAPI = (val) => {
    return request({
        method: "put",
        url: `users/${ val.id }/state/${ val.mg_state }`,
    })
}

// 添加用户
export const addUserAPI = (data)=>{
    return request({
        method:'post',
        url:'users',
        data
    })
}

// 删除用户
export const delUserAPI = (val) => {
    return request({
        method:`delete`,
        url:`users/${val}`
    })
}

// 根据Id查询用户信息
export const queryIdAPI = (val)=>{
    return request({
        url:`users/${val}`,
        method:'get'
    })
}

// 修改用户信息
export const editUserAPI = (val,data)=>{
    return request({
        url:`users/${val}`,
        method:'put',
        data
    })
}

// 分配角色
export const assignRolesAPI = (id,data)=>{
    return request({
        method:'put',
        url:`users/${id}/role`,
        data
    })
}
