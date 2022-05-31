import request from '@/utils/request'

// 订单请求数据
export const orderListAPI = (params) => {
    return request({
        url: 'orders',
        params
    })
}


// 获取物流信息
export const logisticsAPI = (val) => {
    return request({
        url: `kuaidi/${ val }`
    })
}
