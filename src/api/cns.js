import request from '@/utils/request'

// 查询节点信息
export function getCnsList(data) {
    return request({
        url: '/cnss',
        method: 'post',
        data
    })
}

// 节点监控
export function cnsRegister(data) {
    return request({
        url: '/cns/register',
        method: 'post',
        data
    })
}