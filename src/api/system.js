import request from '@/utils/request'

// 查询系统配置信息
export function getSystemConfig(chainId) {
    return request({
        url: '/chain/getsystemconfig/' + chainId,
        method: 'get'
    })
}

// 设置系统配置信息
export function setSystemConfig(data) {
    return request({
        url: '/chain/setsystemconfig',
        method: 'post',
        data
    })
}


