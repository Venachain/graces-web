import request from '@/utils/request'

// 根据hash查询区块信息
export function getBlockByHash(data) {
    return request({
        url: '/block/hash',
        method: 'post',
        data
    })
}

// 查询所有区块信息
export function getBlockList(data) {
    return request({
        url: '/blocks',
        method: 'post',
        data
    })
}

export function getBlockById(id) {
    return request({
        url: '/block/id/' + id,
        method: 'get'
    })
}
