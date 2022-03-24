<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover" class="mgb20 infoTable" style='height: 100px'>
                    <el-table
                        :show-header="false"
                        :data="chainData"
                        style="width: 100%;font-size: 14px;min-width: 80px;margin-top: -5px"
                        size='mini'
                        :cell-style="{background:'#fff'}">
                        <el-table-column prop="name" width='80px' className='cell1' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="value" className='cell2' :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="mgb20 infoTable" style='height: 100px'>
                    <el-table
                        :show-header="false"
                        :data="chainData2"
                        style="width: 100%;margin-top: -5px;font-size: 14px;min-width: 200px"
                        size='mini'
                        :cell-style="{background:'#fff'}">
                        <el-table-column prop="name" width='100px' className='cell1' :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="value" className='cell2' :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-document-copy grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link :to = "'/blocks/' + chainId">
                                        <div class="grid-num">{{ stats.latest_height }}</div>
                                        <div>{{ $t('i18n.bkh') }}</div>
                                    </router-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-tickets grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link :to = "'/txs/' + chainId">
                                        <div class="grid-num">{{ stats.total_tx }}</div>
                                        <div>{{ $t('i18n.txcnt') }}</div>
                                    </router-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-order grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link :to = "'/contracts/' + chainId">
                                        <div class="grid-num">{{ stats.total_contract }}</div>
                                        <div>{{ $t('i18n.sccnt') }}</div>
                                    </router-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-card shadow="hover">
            <NodeShow :nodeList="nodeList" />
        </el-card>
        <Explorer v-if="chainId !== undefined" ref="explorer" :chainId="chainId" :bkList="bkList" :txList="txList" style="margin-top: 20px;"></Explorer>
    </div>
</template>

<script>
import Schart from 'vue-schart'
import Explorer from './Explorer'
import NodeShow from './NodeShow'
import { queryChainById, chainStats, chainTxStats } from "@/api/chain"
import { getBlockList } from '@/api/block'
import { getTxList } from '@/api/tx'
import { getNodeList } from '@/api/node'
export default {
    name: 'Chain',
    data() {
        return {
            chainInfo: {},
            chainData: [
                {name:this.$t('i18n.chainName')+'：', value:''},
                {name:'IP：',value:''}
            ],
            chainData2: [
                {name:this.$t('i18n.rpcPort')+'：', value:''},
                {name:this.$t('i18n.p2pPort')+'：', value:''}
            ],
            stats: {
                latest_height: 0,
                total_tx: 0,
                total_contract: 0,
                total_node: 0
            },
            bkList: [],
            txList: [],
            nodeList: [],
            websocket: null,
            chainId: this.$route.params.chainId
        };
    },
    methods: {
        getWebsocket() {
            if (this.websocket === null) {
                let that = this
                let host = process.env.VUE_APP_BASE_WS + '/ws/' + this.chainId
                that.websocket = new WebSocket(host);
                //连接发生错误的回调方法
                that.websocket.onerror = function() {
                    console.log("connection error")
                    that.websocket = null
                    that.$message.error('socket connection error');

                };

                //连接成功建立的回调方法
                that.websocket.onopen = function(event) {
                    console.log("connection success")
                }

                //接收到消息的回调方法
                that.websocket.onmessage = function(event) {
                    if (typeof event.data === 'string') {
                        console.log('str:', event.data)
                    } else {
                        var reader = new FileReader();
                        reader.readAsText(event.data, "utf-8")
                        reader.onload = function (){
                            try {
                                let content = JSON.parse(this.result)
                                that.distribution(content)
                            } catch(err) {
                                console.log(this.result)
                                console.log(err)
                            }
                        }
                    }
                }

                //连接关闭的回调方法
                that.websocket.onclose = function() {
                    console.log("connection closed")
                }
            }
        },
        websocketClose() {
            if (this.websocket !== null) {
                this.websocket.close()
            }
        },
        distribution(result) {
            if (result.type === undefined) {
                console.log("content type error")
                console.log(result)
                return
            }
            const type = result.type.toLowerCase()
            switch (type) {
                case 'newblock':
                    let list = Array.concat([result.content], this.bkList.slice(0, this.bkList.length - 1))
                    this.bkList = list
                    break
                case 'newtx':
                    list = Array.concat([result.content], this.txList.slice(0, this.txList.length - 1))
                    this.txList = list
                    break
                case 'newstats':
                    this.stats = result.content
                    break
                case 'newnodeinfo':
                    this.nodeList = result.content
                    break
            }
        },
        getChain() {
            queryChainById(this.chainId).then((res) => {
                if (res.data != null) {
                    this.chainInfo = res.data
                    this.chainData[0].value = res.data.name
                    this.chainData[1].value = res.data.ip
                    this.chainData2[0].value = res.data.rpc_port
                    this.chainData2[1].value = res.data.p2p_port
                }
            })
        },
        getStats() {
            chainStats(this.chainId).then((res) => {
                if (res.data != undefined) {
                    this.stats = res.data
                }
            })

        },
        getBlock() {
            let data = {
                chain_id: this.chainId,
                page_index: 1,
                page_size: 7
            }
            getBlockList(data).then((res) => {
                if (res.data != null) {
                    this.bkList = res.data.items
                }
            })
        },
        getTx() {
            let data = {
                chain_id: this.chainId,
                page_index: 1,
                page_size: 7
            }
            getTxList(data).then((res) => {
                if (res.data != null) {
                    this.txList = res.data.items
                }
            })
        },
        getNode() {
            let data = {
                chain_id: this.chainId
            }
            getNodeList(data).then((res) => {
                if (res.data != null) {
                    this.nodeList = res.data.items
                }
            })
        },
    },
    components: {
        Explorer,
        NodeShow,
        Schart
    },
    mounted: function () {
        this.getChain()
        this.getStats()
        this.getBlock()
        this.getTx()
        this.getNode()
        this.getWebsocket()
    },
    beforeDestroy: function () {
        console.log('beforeDestroy')
        this.websocketClose()
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.user-avator {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 10px;
    margin-bottom: 10px;
    flex: 1;
    font-size: 14px;
}
.user-info-name {
    float: right;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    line-height: 25px;
    display: inline-block;
    margin-left: 10px;
    text-align: right;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 6px;
}

.mgb20 .el-form-item{
    margin: 0;
}

.infoTable >>> .el-table__row>td{
    border: none;
}

.infoTable >>> .el-table::before{
    height: 0;
}

.infoTable >>> .el-table .cell1 {
    text-align: right;
    vertical-align: top;
    font-size: 14px;
}

.infoTable >>> .el-table .cell2 {
    text-align: left;
    vertical-align: top;
    font-size: 14px;
}

/deep/.el-table .cell {
    padding-left: 0;
    padding-right: 0;
}

.schart {
    width: 100%;
    height: 180px;
}
</style>
