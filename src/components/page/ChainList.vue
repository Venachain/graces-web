<template>
    <div class="blocks">
        <div style="padding:0px 30px 10px 30px">
            <div class="button-line">
<!--                <el-button type="primary" @click="dialogChainVisible = true">部署链</el-button>-->
                <el-button type="primary" @click="dialogFormVisible = true">{{ $t('i18n.addChain') }}</el-button>
            </div>
            <el-card shadow="hover">
                <el-table :data="chainList">
                    <el-table-column type="index" width="50"> </el-table-column>
                    <el-table-column :label="`${$t('i18n.chainName')}`" :width="120" show-overflow-tooltip>
                        <template slot-scope="scope"
                            ><router-link :to="'/chain/' + scope.row.id">{{ scope.row.name }}</router-link></template
                        >
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.internalIP')}`" :width="120">
                        <template slot-scope="scope">{{ scope.row.ip }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.rpcPort')}`" :width="120">
                        <template slot-scope="scope">{{ scope.row.rpc_port }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.p2pPort')}`" :width="120">
                        <template slot-scope="scope">{{ scope.row.p2p_port }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.wsPort')}`" :width="120">
                        <template slot-scope="scope">{{ scope.row.ws_port }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.time')}`">
                        <template slot-scope="scope">
                            {{ scope.row.create_time }}
                        </template>
                    </el-table-column>
                    <el-table-column width="140">
                        <template slot-scope="scope">
                            <el-button @click="fullSync(scope.row.id)" type="text" size="small">全量同步</el-button>
                            <el-button @click="incrementSync(scope.row.id)" type="text" size="small">增量同步</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    style="padding-top:10px"
                >
                </el-pagination>
            </el-card>
        </div>
        <el-dialog :title="$t('i18n.add')" :visible.sync="dialogFormVisible">
            <p class="notify">{{ $t('i18n.chainNotify') }}</p>
            <el-form ref="chainForm" :model="chainForm" label-width="100px" :rules='chainRules' class='chainForm'>
                <el-form-item :label="$t('i18n.chainName') + ':'" prop='name'>
                    <el-input v-model="chainForm.name" :placeholder="$t('i18n.chainName')" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="'IP :'" prop='ip'>
                    <el-input v-model="chainForm.ip" :placeholder="'IP'"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.rpcPort') + ':'" prop='rpc_port'>
                    <el-input type='number' v-model.number="chainForm.rpc_port" :placeholder="$t('i18n.rpcPort')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.p2pPort') + ':'" prop='p2p_port'>
                    <el-input type='number' v-model.number="chainForm.p2p_port" :placeholder="$t('i18n.p2pPort')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.wsPort') + ':'" prop='ws_port'>
                    <el-input type='number' v-model.number="chainForm.ws_port" :placeholder="$t('i18n.wsPort')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('i18n.cancel') }}</el-button>
                <el-button v-loading="saveLoading" type="primary" @click="submitForm">{{ $t('i18n.confirm') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('i18n.add')" :visible.sync="dialogChainVisible">
            <el-form :model="addChainForm" label-width="150px" :label-position="'left'">
                <el-form-item :label="$t('i18n.chainName') + ':'">
                    <el-input v-model="addChainForm.name" :placeholder="$t('i18n.chainName')"></el-input>
                </el-form-item>
                <el-form-item :label="'IP :'">
                    <el-input v-model="addChainForm.ip" :placeholder="'IP'"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.userName') + ':'">
                    <el-input v-model="addChainForm.username" :placeholder="$t('i18n.userName')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddChain">{{ $t('i18n.cancel') }}</el-button>
                <el-button v-loading="saveLoading" type="primary" @click="deployChain()">{{ $t('i18n.confirm') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog title="Terminal" :visible.sync="dialogForm3Visible" :before-close="handleClose">
            <el-scrollbar style="height:400px;background-color:#F5F5DC;color:black;margin-top: -20px;">
                <ul>
                    <li v-for="line in lines" :key="line">{{ line }}</li>
                </ul>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
import { getChainList, queryChain, addChain, chainFullSync, chainIncrementSync } from '@/api/chain';
import { dataUrl } from '@/config';
export default {
    data: function() {
        let _this = this
        const valid = {
            name : (rule, value, callback)=>{
                if (value.length === 0){
                    callback(new Error(_this.$t('i18n.chainNameLimit')))
                }else if(value.length >20 ){
                    callback(new Error('链名称不得超过20字'))
                }else{
                    callback()
                }
            },
            ip : (rule, value, callback)=>{
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!reg.test(value)){
                    callback(new Error(_this.$t('i18n.IPLimit')))
                }else{
                    callback()
                }
            },
            port : (rule, value, callback)=>{
                if (!(value > 0 && value <= 65535)){
                    callback(new Error(_this.$t('i18n.PortLimit')))
                }else{
                    callback()
                }
            }
        }
        return {
            chainList: [],
            currentPage: 1,
            pageSize: 10,
            totalCount: 100,
            dialogFormVisible: false,
            dialogChainVisible: false,
            dialogForm3Visible: false,
            saveLoading: false,
            chainForm: {
                name: '',
                ip: '',
                rpc_port: '',
                p2p_port: '',
                ws_port: ''
            },
            addChainForm: {
                name: '',
                ip: '',
                username: ''
            },
            lines: [],
            websocket: null,
            sendFlag: false,
            chainRules:{
                name: [
                    { required: true,trigger: 'blur', validator: valid.name },
                ],
                ip: [
                    { required: true, trigger: 'blur', validator: valid.ip }
                ],
                rpc_port: [
                    { required: true, trigger: 'blur', validator: valid.port }
                ],
                p2p_port: [
                    { required: true, trigger: 'blur', validator: valid.port }
                ],
                ws_port: [
                    { required: true, trigger: 'blur', validator: valid.port }
                ],
            },
        };
    },
    methods: {
        getChainsData() {
            let data = {
                page_index: this.currentPage,
                page_size: this.pageSize
            };
            getChainList(data).then(res => {
                if (res.data == null) {
                    this.chainList = [];
                } else {
                    this.chainList = res.data.items;
                    this.totalCount = res.data.total;
                }
            });
        },
        resetLines() {
            this.lines = ['start working...'];
        },
        handleClose() {
            console.log('dialog close');
            this.dialogForm3Visible = false;
            this.websocketClose();
            this.sendFlag = false;
            this.resetLines();
            this.websocket = null;
        },
        getWebsocket(jsonStr) {
            if (this.websocket === null) {
                let that = this;
                let host = process.env.VUE_APP_BASE_WS + '/ws/deploy';
                that.websocket = new WebSocket(host);
                //连接发生错误的回调方法
                that.websocket.onerror = function() {
                    console.log('connection error');
                    that.websocket = null;
                    that.$message.error('socket connection error');
                };

                //连接成功建立的回调方法
                that.websocket.onopen = function(event) {
                    console.log('connection success');
                    that.dialogForm3Visible = true;
                    that.sendFlag = true;
                    that.resetAddFrom();
                    that.websocket.send(jsonStr);
                };

                //接收到消息的回调方法
                that.websocket.onmessage = function(event) {
                    if (typeof event.data === 'string') {
                        that.lines.push(event.data);
                    } else {
                        var reader = new FileReader();
                        reader.readAsText(event.data, 'utf-8');
                        reader.onload = function() {
                            that.lines.push(this.result);
                        };
                    }
                };

                //连接关闭的回调方法
                that.websocket.onclose = function() {
                    console.log('connection closed');
                };
            }
        },
        websocketClose() {
            if (this.websocket !== null) {
                this.websocket.close();
            }
        },
        deployChain() {
            if (this.addChainForm.name === '' || this.addChainForm.ip === '' || this.addChainForm.username === '') {
                this.dialogChainVisible = false;
                return;
            }
            if (this.addChainForm.ip.split('.').length !== 4) {
                this.dialogChainVisible = false;
                return;
            }
            let data = {
                method: 'deploy',
                projectName: this.addChainForm.name,
                remoteIP: this.addChainForm.ip,
                remoteName: this.addChainForm.username
            };
            let jsonStr = JSON.stringify(data);
            this.dialogForm3Visible = true;
            this.getWebsocket(jsonStr);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getChainsData();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getChainsData();
        },
        submitForm() {
            let _this = this
            this.$refs['chainForm'].validate((valid)=>{
                if(valid){
                    let data = {
                        name: this.chainForm.name,
                        ip: this.chainForm.ip,
                        rpc_port: this.chainForm.rpc_port,
                        p2p_port: this.chainForm.p2p_port,
                        ws_port: this.chainForm.ws_port
                    };
                    this.saveLoading = true;
                    addChain(data)
                        .then(res => {
                            this.$message({
                                type: 'success',
                                message: this.$t('i18n.submitSuccess')
                            });
                            this.resetForm();
                            this.getChainsData();
                            this.dialogFormVisible = false;
                            this.saveLoading = false;
                        })
                        .catch(err => {
                            _this.showError(err)
                            this.saveLoading = false;
                        });
                }else{
                    this.$message({
                        type: 'error',
                        message: this.$t('i18n.submitFailed')
                    });
                    console.log('params error');
                }
            })
        },
        showError(err){
            let msg = ''
            if (err.code){
                msg = this.$t('i18n.addChainError.'+err.code)
            }
            if (msg.length === 0) {
                msg = this.$t('i18n.addChainError.others')
            }
            this.$message.error(msg)
        },
        cancel() {
            this.dialogFormVisible = false;
            this.resetForm();
        },
        cancelAddChain() {
            this.dialogChainVisible = false;
            this.resetAddFrom();
        },
        resetForm() {
            this.chainForm = {
                name: '',
                ip: '',
                rpc_port: '',
                p2p_port: '',
                ws_port: ''
            };
        },
        resetAddFrom() {
            this.addChainForm = {
                name: '',
                ip: '',
                username: ''
            };
        },
        fullSync(chainId) {
            if (chainId === undefined) {
                return;
            }
            chainFullSync(chainId)
                .then(res => {
                    if (res.code === 200) {
                        this.$message.success(this.$t('i18n.submitSuccess'));
                    } else {
                        this.$message.error(this.$t('i18n.submitFailed'));
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t('i18n.submitFailed'));
                    console.log(err);
                });
        },
        incrementSync(chainId) {
            if (chainId === undefined) {
                return;
            }
            chainIncrementSync(chainId)
                .then(res => {
                    if (res.code === 200) {
                        this.$message.success(this.$t('i18n.submitSuccess'));
                    } else {
                        this.$message.error(this.$t('i18n.submitFailed'));
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t('i18n.submitFailed'));
                    console.log(err);
                });
        }
    },
    mounted: function() {
        this.getChainsData();
        this.resetLines();
    },
    beforeDestroy: function() {
        this.websocketClose();
    },
};
</script>

<style scoped>
.ms-content {
    padding: 30px 30px 10px 30px;
}

.btn {
    width: 100%;
}

a {
    color: #3498db;
}

.button-line {
    margin-bottom: 6px;
    display: flex;
    justify-content: flex-end;
}

.notify {
    margin: -20px 0 20px;
    color: red;
}
</style>
