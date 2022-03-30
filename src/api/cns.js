import request from '@/utils/request'
import request2 from '@/utils/request2'

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
    return request2({
        url: '/cns/register',
        method: 'post',
        data
    })
}