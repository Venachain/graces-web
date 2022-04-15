<template>
    <div>
        <div slot="header" style="margin-bottom: 10px">
            <span>{{ $t('i18n.nodeList') }}</span>
            <!-- <el-button style="float: right; padding: 3px 10px" type="text" v-if="showEdit" @click="openDialog2">{{
                $t('i18n.addNodeAccess')
            }}</el-button> -->
            <!-- <el-button style="float: right; padding: 3px 10px" type="text" v-if="showEdit" @click="openDialog">{{
                $t('i18n.deployNewNode')
            }}</el-button> -->
        </div>

        <el-scrollbar style="height: 100%">
            <el-table :data="nodeList" :max-height="height" style="width: 100%" :show-header="false">
                <el-table-column>
                    <template v-slot="scope">
                        <div class="node_icon"><span>Node</span></div>
                        <div class="node_icon_right">
                            <div class="node_key">
                                <el-tooltip popper-class='tooltip' effect="dark" :content="scope.row.name + '(' + scope.row.public_key + ')'" placement="top">
                                    <router-link v-if="isAlive(scope.row)" :to="'/node/' + scope.row.id + '/' + chainId">
                                        {{ brief(scope.row.name + '(' + scope.row.public_key + ')') }}
                                    </router-link>
                                    <div v-else>
                                        {{ brief(scope.row.name + '(' + scope.row.public_key + ')') }}
                                    </div>
                                </el-tooltip>
                            </div>
                            <div style="display: inline-block">{{ scope.row.p2p_port }}</div>
                            <div style="display: inline-block; margin-left: 20px; font-weight: bold">
                                {{ 'BlockNumber：' + scope.row.blocknumber }}
                            </div>
                            <div class="node_role" v-if="scope.row.type == 1">Validator</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :width="150">
                    <template v-slot="scope"
                        ><div class="node_status" :class="{ 'node-item-error': !isAlive(scope.row) }">
                            {{  isAlive(scope.row) ? 'Normal' : 'Error' }}
                        </div></template
                    >
                </el-table-column>
                <!-- <el-table-column width="120" v-if="showEdit">
                    <template>
                        <el-button type="danger" @click="removeNode">{{ $t('i18n.removeNode') }}</el-button>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column type="expand" v-if="showEdit">
                    <template slot-scope="props">
                        <el-button @click="start(props.row)">{{ $t('i18n.startNode') }}</el-button>
                        <el-button @click="stop(props.row)">{{ $t('i18n.stopNode') }}</el-button>
                        <el-button @click="restart(props.row)">{{ $t('i18n.restartNode') }}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-scrollbar>

        <el-dialog :title="'Add Node'" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="150px" :label-position="'left'">
                <el-form-item :label="$t('i18n.remoteUserName') + ':'">
                    <el-input v-model="form.remoteUserName" :placeholder="'server user name'"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.remoteIp') + ':'">
                    <el-input v-model="form.remoteIp" :placeholder="'server ip'"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('i18n.cancel') }}</el-button>
                <el-button type="primary" @click="nodeCreate">{{ $t('i18n.confirm') }}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'Node'" :visible.sync="dialogForm2Visible">
            <el-form :model="form2" label-width="150px" :label-position="'left'">
                <el-form-item :label="$t('i18n.nodeName') + ':'">
                    <el-input v-model="form2.nodeName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.role')">
                    <el-select v-model="form2.status" placeholder="">
                        <el-option key="Normal" :label="'Normal'" value="Normal"></el-option>
                        <el-option key="Validator" :label="'Validator'" value="Validator"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'Node Pubkey:'">
                    <el-input v-model="form2.nodePubKey"></el-input>
                </el-form-item>
                <el-form-item :label="'Node IP:'">
                    <el-input v-model="form2.nodeip"></el-input>
                </el-form-item>
                <el-form-item :label="'Node P2P Port:'">
                    <el-input v-model="form2.p2pPort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('i18n.cancel') }}</el-button>
                <el-button type="primary" @click="nodeAdd">{{ $t('i18n.confirm') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog title="Terminal" :visible.sync="dialogForm3Visible" :before-close="handleClose">
            <el-scrollbar
                style="height:400px;background-color:#F5F5DC;color:black;margin-top: -20px;"
            >
                <ul>
                  <li v-for="line in lines"> >>> {{line}}</li>
                </ul>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import { getNodeList } from '@/api/node'
export default {
    data() {
        return {
            nodeList: [],
            dialogFormVisible: false,
            dialogForm2Visible: false,
            dialogForm3Visible: false,
            canRequest: true,
            form: {
                remoteUserName: '',
                remoteIp: '',
            },

            form2: {
                nodeName: '',
                status: 'Normal',
                nodeip: '',
                nodePubKey: '',
                p2pPort: ''
            },
            chainId: this.$route.params.chainId,
            lines: [],
            websocket: null,
            sendFlag: false
        }
    },
    methods: {
        resetLines() {
            this.lines = ['start working...']
        },
        handleClose() {
            console.log("dialog close")
            this.dialogForm3Visible = false
            this.websocketClose()
            this.sendFlag = false
            this.resetLines()
            this.websocket = null
        },
        getWebsocket(jsonStr) {
            if (this.websocket === null) {
                let that = this
                let host = this.BASE_WS + '/ws/deploy'
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
                    that.dialogForm3Visible = true
                    that.sendFlag = true
                    that.websocket.send(jsonStr)
                }

                //接收到消息的回调方法
                that.websocket.onmessage = function(event) {
                    if (typeof event.data === 'string') {
                        that.lines.push(event.data)
                    } else {
                        var reader = new FileReader();
                        reader.readAsText(event.data, "utf-8")
                        reader.onload = function (){
                            that.lines.push(this.result)
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
        messageSend(msg) {
            if (this.websocket !== null && this.sendFlag) {
                this.websocket.send(msg)
            } else {
                this.$message.error('socket connection error');
            }
        },
        getData() {
            if (this.canRequest) {
                let data = {
                    chain_id: this.chainId
                }
                getNodeList(data).then((res) => {
                    if (res.data != null) {
                        this.nodeList = res.data.items
                    }
                })

            }
        },
        removeNode() {
            this.$confirm(this.$t('i18n.confirmRemove'), '', {
                confirmButtonText: this.$t('i18n.confirm'),
                cancelButtonText: this.$t('i18n.cancel'),
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: this.$t('i18n.removeSuccess')
                });
            });
        },
        openDialog() {
            this.resetForm();
            this.dialogFormVisible = true;
        },
        openDialog2() {
            this.resetForm();
            this.dialogForm2Visible = true;
        },
        resetForm() {
            this.form = {
                remoteUserName: '',
                remoteIp: ''
            };

            this.form2 = {
                nodeName: '',
                status: 'Normal',
                nodeip: '',
                nodePubKey: '',
                p2pPort: ''
            };
        },
        nodeCreate() {
            if (this.form.remoteUserName === '' || this.form.remoteIp === '') {
                return
            }
            let info = {
                method: "create",
                chainId: this.chainId,
                remoteName: this.form.remoteUserName,
                remoteIp: this.form.remoteIp
            }
            var jsonStr = JSON.stringify(info)
            console.log(jsonStr)
            this.getWebsocket(jsonStr)
        },
        nodeAdd() {
            console.log(this.chainId);
        },
        cancel() {
            this.resetForm();
            this.dialogFormVisible = false;
            this.dialogForm2Visible = false;
        },
        start(row) {
            var info = {
                method: "startNode",
                chainID: row.chain_id,
                nodeID: row.name
            }
            var jsonStr = JSON.stringify(info)
            console.log(jsonStr)
            this.getWebsocket(jsonStr)
        },
        stop(row) {
            var info = {
                method: "stopNode",
                chainID: row.chain_id,
                nodeID: row.name
            }
            var jsonStr = JSON.stringify(info)
            console.log(jsonStr)
            this.getWebsocket(jsonStr)
        },
        restart(row) {
            var info = {
                method: "restartNode",
                chainID: row.chain_id,
                nodeID: row.name
            }
            var jsonStr = JSON.stringify(info)
            console.log(jsonStr)
            this.getWebsocket(jsonStr)
        },
        isAlive(row) {
            return row.is_alive && row.status==1 && row.blocknumber > 0
        },
        brief(v){
            if (v.length>50){
                v = v.slice(0,50)+'...'
            }
            return v
        }
    },
    mounted: function () {
        this.getData();
        this.resetLines()
        // this.timer = setInterval(this.getData, 5000)
    },
    beforeDestroy: function () {
        if(this.timer !== undefined) {
            clearInterval(this.timer)
        }
        this.websocketClose()
        this.canRequest = false;
    },
    props: {
        height: {
            default: 270
        },
        showEdit: {
            default: false
        }
    }
};
</script>

<style scoped>
/deep/ .el-scrollbar .el-scrollbar__wrap{
    padding-bottom: 20px;
}

.node_icon {
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    border-radius: 5px;
    float: left;
}

.node_icon_right {
    display: inline-block;
    height: 40px;
    margin-left: 5px;
}

.node_status {
    width: 60px;
    height: 20px;
    background-color: dodgerblue;
    color: white;
    text-align: center;
    border-radius: 3px;
    margin-left: 50px;
}
.node-item-error {
    background-color: crimson;
}
.node_key {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 460px;
}

.node_role {
    width: 70px;
    height: 20px;
    background-color: rgba(119, 131, 143, 0.1);
    color: #e6a23c;
    text-align: center;
    border-radius: 3px;
    margin-left: 20px;
    font-weight: bold;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    transition: 0.2s ease-in-out;
    display: inline-block;
}
</style>
<style>
.tooltip{
    max-width: 400px;
    word-wrap: break-word;
}
</style>