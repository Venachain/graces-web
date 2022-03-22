import request from '@/utils/request'
import request2 from '@/utils/request2'

// 查询链信息
export function getChainList(data) {
    return request({
        url: '/chains',
        method: 'post',
        data
    })
}

// 添加链信息
export function addChain(data) {
    return request2({
        url: '/chain',
        method: 'post',
        data
    })
}

export function queryChainById(chainId) {
    return request({
        url: '/chain/id/' + chainId,
        method: 'get'
    })
}

export function chainStats(chainId) {
    return request({
        url: '/chain/stats/' + chainId,
        method: 'get'
    })
}

export function chainTxStats(chainId) {
    return request({
        url: '/chain/stats/tx/count/' + chainId,
        method: 'get'
    })
}

export function chainFullSync(chainId) {
    return request({
        url: '/chain/fullsync/start/' + chainId,
        method: 'get'
    })
}

export function chainIncrementSync(chainId) {
    return request({
        url: '/chain/incrsync/start/' + chainId,
        method: 'get'
    })
}
