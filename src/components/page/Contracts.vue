<template>
    <div>
        <el-form :model="param" label-width="0px" class="ms-content" @submit.native.prevent>
            <el-form-item prop="info">
                <el-input v-model="param.info" :placeholder="`${$t('i18n.scAddr')}`" @keyup.enter.native="submitForm()">
                    <el-button slot="prepend" icon="el-icon-lx-search" @click='submitForm'></el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <div style="padding:0px 30px 10px 30px">
            <el-card shadow="hover">
                <el-button type="primary" round style="margin-bottom:10px" @click="dialogFormVisible = true">{{
                    $t('i18n.deploy')
                }}</el-button>

                <el-dialog :title="$t('i18n.deploy')" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item :label="$t('i18n.contractFile')">
                            <div style="display:inline-block">
                                <el-upload ref="upload" drag action="" multiple
                                           :http-request="httpRequest"
                                           :auto-upload="false"
                                           :file-list="fileList"
                                           :on-change='handleChange'
                                           :on-exceed="handleExceed"
                                           :limit='2'>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                        {{ $t('i18n.dragFile') }}<em>{{ $t('i18n.clickUpload') }}</em>
                                    </div>
                                    <div class="el-upload__tip" slot="tip">{{ $t('i18n.twoFile') }}</div>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('i18n.isSetCNS')">
                            <el-switch v-model="form.setCNS"></el-switch>
                            <el-input v-model="form.CNS" :placeholder="`${$t('i18n.cnsName')}`" v-if="form.setCNS" maxlength="100"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">{{ $t('i18n.cancel') }}</el-button>
                        <el-button type="primary" @click="submitDeploy" :loading="deployLoading">{{ $t('i18n.confirm') }}</el-button>
                    </div>
                </el-dialog>

                <el-table :data="contracts">
                    <el-table-column :label="`${$t('i18n.scName')}`" :max-width="250" show-overflow-tooltip>
                        <template slot-scope="scope"
                            ><router-link :to="'/contract/' + scope.row.address + '/chain/' + chainId">{{
                                '(' + getAddress(scope.row) + ')' + scope.row.address
                            }}</router-link></template
                        >
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.creator')}`" show-overflow-tooltip :max-width="250">
                        <template slot-scope="scope">{{ scope.row.creator }}</template>
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.Transaction')}`" show-overflow-tooltip :max-width="250">
                        <template slot-scope="scope"
                            ><router-link :to="'/tx/' + scope.row.tx_hash + '/chain/' + chainId">{{
                                scope.row.tx_hash
                            }}</router-link></template
                        >
                    </el-table-column>
                    <el-table-column :label="`${$t('i18n.time')}`" :width="150">
                        <template slot-scope="scope">
                            <span>{{ scope.row.timestamp }}</span>
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
                >
                </el-pagination>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getContractList, deployContract } from '@/api/contract';
import { cnsRegister } from '@/api/cns';
export default {
    data: function() {
        return {
            param: {
                info: ''
            },
            contracts: [],
            currentPage: 1,
            pageSize: 10,
            totalCount: 100,
            form: {
                setCNS: false,
                CNS: ''
            },
            file: [],
            fileList: [],
            dialogFormVisible: false,
            chainId: this.$route.params.chainId,
            deployLoading: false
        };
    },
    methods: {
        getAddress(row) {
            if (row.cns !== null && row.cns.length > 0) {
                return row.cns[0].name;
            }
            return '';
        },
        submitForm() {
            if (this.param.info === ""){
                this.getData();
            }else{
                let data = {
                    chain_id: this.chainId,
                    address: this.param.info
                };
                getContractList(data).then(res => {
                    if (res.data !== null) {
                        this.contracts = res.data.items;
                        this.totalCount = res.data.total;
                    } else {
                        this.contracts = [];
                        this.totalCount = 0;
                    }
                });
            }
        },
        handleChange(file, fileList){
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            const whiteList = ['json','wasm'];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$message.warning(this.$t('i18n.fileExt'))
                this.fileList=fileList.slice(0,fileList.length-1)
                return false;
            }
        },
        handleExceed() {
            this.$message.warning(this.$t('i18n.twoFiles'));
        },
        httpRequest(param) {
            if (this.file.length > 1) {
                return;
            }
            this.file.push(param.file);
        },
        submitDeploy() {
            this.$refs.upload.submit();
            if (this.file.length === 0){
                this.$message.warning(this.$t('i18n.conAdd'))
                return
            }
            var updata = new FormData();
            this.file.forEach(function(file) {
                updata.append('file', file, file.name);
            });
            updata.append('body', JSON.stringify(this.form));
            this.deployLoading = true;

            deployContract(this.chainId, updata)
                .then(res => {
                    //set cns
                    if (res.code === 200 && this.form.setCNS && this.form.CNS != '') {
                        let data = {
                            chain_id: this.chainId,
                            Name: this.form.CNS,
                            Version: '0.0.0.1',
                            Address: res.data.contractAddress
                        };
                        cnsRegister(data).then(res => {
                            console.log(data);
                            console.log(res);
                            this.$message.success(this.$t('i18n.ConSuccess'))
                            this.getData()
                            this.deployLoading = false
                            this.dialogFormVisible = false
                            this.$refs.upload.clearFiles();
                            this.resetForm()
                        })
                        .catch(err=>{
                            console.log(err)
                            this.$message.warning(this.$t('i18n.ConCnsFailed'))
                            this.getData()
                            this.deployLoading = false
                            this.dialogFormVisible = false
                            this.$refs.upload.clearFiles();
                            this.resetForm()
                        });
                    }else{
                        this.$message.success(this.$t('i18n.ConSuccess'));
                        this.getData()
                        this.deployLoading = false
                        this.dialogFormVisible = false
                        this.$refs.upload.clearFiles()
                        this.resetForm()
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message.error(this.$t('i18n.ConFailed'))
                    this.deployLoading = false
                });
        },
        getData() {
            let data = {
                chain_id: this.chainId,
                page_index: this.currentPage,
                page_size: this.pageSize
            };
            getContractList(data).then(res => {
                if (res.data !== null) {
                    this.contracts = res.data.items;
                    this.totalCount = res.data.total;
                }
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        },
        resetForm(){
            this.form.CNS = ''
            this.form.setCNS = false
        }
    },
    mounted: function() {
        this.getData();
        // setInterval(this.getData(),2000)
    },
    computed: {
        rules() {
            return {
                info: [{ required: true, message: this.$t('i18n.searchInfo'), trigger: 'blur' }]
            };
        }
    }
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
</style>
