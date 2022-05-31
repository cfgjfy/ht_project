import request from '@/utils/request'

// 商品分类区域数据请求
// 获取商品分类数据
export const categoriesAPI = (params) => {
    return request({
        url: 'categories',
        params
    })
}
// 获取父类层级数据
export const addCateAPI = (params) => {
    return request({
        url: 'categories',
        params
    })
}

// 添加分类参数
export const addCate = (data) => {
    return request({
        url: 'categories',
        method: 'post',
        data
    })
}

// 删除分类
export const delCateAPI = (val) => {
    return request({
        url: `categories/${ val }`,
        method: 'delete'
    })
}

// 根据id查询分类
export const queryCateId = (id) => {
    return request({
        url: `categories/${ id }`
    })
}

// 提交编辑商品分类
export const editCateAPI = (id, data) => {
    return request({
        url: `categories/${ id }`,
        method: 'put',
        data
    })
}


// 分类参数区域的数请求
export const paramsListAPI = (id, params) => {
    return request({
        url: `categories/${ id }/attributes`,
        params
    })
}

// 添加动态参数/静态属性
export const addParamsAPI = (id, data) => {
    return request({
        url: `categories/${ id }/attributes`,
        method: 'post',
        data
    })
}

// 根据ID查询参数
export const queryIdParamsAPI = (id, attrId, params) => {
    return request({
        url: `categories/${ id }/attributes/${ attrId }`,
        params
    })
}

// 提交修改的分类数据
export const setParamsAPI = (id, attrId, data) => {
    return request({
        url: `categories/${ id }/attributes/${ attrId }`,
        method: 'put',
        data
    })
}

// 删除参数
export const delParamsAPI = (id, attrId) => {
    return request({
        url: `categories/${ id }/attributes/${ attrId }`,
        method: 'delete'
    })
}

// 添加分类参数
export const addCateParamsAPI = (id, attrId, data) => {
    return request({
        url: `categories/${ id }/attributes/${ attrId }`,
        method: 'put',
        data
    })
}


// 商品列表接口请求
export const goodsListAPI = (params) => {
    return request({
        url: 'goods',
        params
    })
}

// 删除商品信息
export const delGoodsAPI = (id) => {
    return request({
        url: `goods/${ id }`,
        method: 'delete'
    })
}

// 添加商品
export const addGoodsAPI = (data) => {
    return request({
        url: 'goods',
        method: 'post',
        data
    })
}
