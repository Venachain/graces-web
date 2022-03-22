<template>
    <div>
        <div slot="header">
            <span>{{ $t('i18n.cnsList') }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="openDialog">{{ $t('i18n.add') }}</el-button>
        </div>
        <el-scrollbar style="height: 100%">
            <el-table :data="cnsList" :max-height="height" style="width: 100%">
                <el-table-column :label="`${$t('i18n.scName')}`" :width="130">
                    <template slot-scope="scope">
                        <el-button type="text" @click="onRowClick(scope.row)">{{ scope.row.name }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="version" :label="`${$t('i18n.currVersion')}`" width="130"></el-table-column>
                <el-table-column prop="address" :label="`${$t('i18n.currAddr')}`"></el-table-column>
            </el-table>
        </el-scrollbar>

        <el-dialog :title="'CNS'" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="150px" :label-position="'left'" :rules='rules'>
                <el-form-item :label="$t('i18n.cnsContractName') + ':'" style="width: 350px" prop='name'>
                    <el-input v-model="form.name" :placeholder="$t('i18n.pinput')" :disabled="isEdit" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.version') + ':'" style="width: 350px" prop='version'>
                    <el-input v-model="form.version" :placeholder="$t('i18n.version') + ' 0.0.0.1'" :disabled="isEdit" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="$t('i18n.scAddr') + ':'" prop='addr'>
                    <el-input v-model="form.address" :placeholder="$t('i18n.scAddr')" :disabled="isEdit" maxlength="300"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('i18n.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm">{{ $t('i18n.confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCnsList, cnsRegister } from '@/api/cns'
export default {
    props: {
        chainId: {
            type: String,
            required: true
        },
        height: {
            default: 270
        }
    },
    data() {
        return {
            cnsList: [],
            dialogFormVisible: false,
            form: {
                name: '',
                version: '',
                address: ''
            },
            isEdit: false,
            canRequest: true,
            rules:{
                name:[
                    { required: true,trigger: 'blur', message:this.$t('i18n.CNSNameLimit')}
                ],
                version:[
                    { required: true,trigger: 'blur', message:this.$t('i18n.CNSVersionLimit')}
                ],
                addr:[
                    { required: true,trigger: 'blur', message:this.$t('i18n.CNSAddrLimit')}
                ]
            }
        };
    },
    methods: {
        getData() {
            if (this.canRequest) {
                let data = {
                    chain_id: this.chainId,
                    page_index: 1,
                    page_size: 100
                }
                getCnsList(data).then((res) => {
                    if (res.data !== undefined && res.data !== '' && res.data.items !== null) {
                        this.cnsList = res.data.items
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        openDialog() {
            this.resetForm();
            this.isEdit = false;
            this.dialogFormVisible = true;
        },
        onRowClick(row) {
            this.form = {
                name: row.name,
                version: row.version,
                address: row.address
            };
            this.isEdit = true;
            this.dialogFormVisible = true;
        },
        submitForm() {
            if (this.form.name === '' || this.form.version === '' || this.form.address === '') {
                return
            }
            let data ={
                chain_id: this.chainId,
                Name: this.form.name,
                Version: this.form.version,
                Address: this.form.address
            }
            cnsRegister(data).then((res) => {
                this.$message({
                    type: 'success',
                    message: this.$t('i18n.submitSuccess')
                });
                this.getData()
            }).catch((res) => {
                this.$message({
                    type: 'error',
                    message: this.$t('i18n.submitFailed')
                })
            })

            this.dialogFormVisible = false;
        },
        cancel() {
            this.resetForm();
            this.dialogFormVisible = false;
        },
        resetForm() {
            this.form = {
                name: '',
                version: '',
                address: ''
            };
        }
    },
    mounted: function () {
        this.getData();
        //setInterval(this.getData,5000)
    },
    beforeDestroy() {
        this.canRequest = false;
    }
};
</script>

<style scoped>
/deep/ .el-scrollbar .el-scrollbar__wrap{
    padding-bottom: 18px;
}
</style>