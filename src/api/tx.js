import request from '@/utils/request'

// 查询链上的交易信息
export function getTxList(data) {
    return request({
        url: '/txs',
        method: 'post',
        data
    })
}

export function getTxByHash(data) {
    return request({
        url: '/tx/hash',
        method: 'post',
        data
    })
}