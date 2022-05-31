import request from '@/utils/request'

// 权限列表数据
export const rightsAPI = () => {
    return request({
        url: `rights/list`
    })
}

// 角色列表数据
export const rolesAPI = () => {
    return request({
        url: 'roles'
    })
}

// 添加角色
export const addRolesAPI = (data) => {
    return request({
        url: 'roles',
        method: 'post',
        data
    })
}

// 删除角色
export const delRoleAPI = (val) => {
    return request({
        url: `roles/${ val }`,
        method: 'delete',
    })
}

// 根据ID查询角色分类
export const queryRoleAPI = (params) => {
    return request({
        url: `roles/${ params }`
    })
}

// 提交修改的角色信息
export const editRolesAPI = (val, data) => {
    return request({
        url: `roles/${ val }`,
        method: 'put',
        data
    })
}

// 删除角色指定权限
export const delRolesAPI = (roles, rightId) => {
    return request({
        url: `roles/${ roles.id }/rights/${ rightId }`,
        method: 'delete'
    })
}

// 添加权限
export const setRightsAPI = () => {
    return request({
        url: `rights/tree`
    })
}

// 角色授权
export const roleRightAPI = (roleId, data) => {
    return request({
        url: `roles/${ roleId }/rights`,
        method: 'post',
        data
    })
}
