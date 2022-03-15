import request from '@/utils/request'

// 根据hash查询区块信息
export function getContractByAddress(data) {
    return request({
        url: '/contract/address',
        method: 'post',
        data
    })
}

// 查询所有区块信息
export function getContractList(data) {
    return request({
        url: '/contracts',
        method: 'post',
        data
    })
}

export function deployContract(chainId, data) {
    return request({
        url: '/chain/deploy/contract/' + chainId,
        method: 'post',
        header: {'Content-Type': 'multipart/form-data' },
        data
    })
}