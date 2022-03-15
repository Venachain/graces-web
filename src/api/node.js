import request from '@/utils/request'

// 查询节点信息
export function getNodeList(data) {
    return request({
        url: '/nodes',
        method: 'post',
        data
    })
}

export function getNode(id) {
    return request({
        url: '/node/id/' + id,
        method: 'get'
    })
}

// 节点监控
export function nodeSync(data) {
    return request({
        url: '/nodes/sync',
        method: 'post',
        data
    })
}