<template>
<div>
    <el-form :model="param" :rules="rules" ref="search" label-width="0px" class="ms-content" @submit.native.prevent>
        <el-form-item prop="info">
            <el-input v-model="param.info" placeholder="Search by Transaction ID" @keyup.enter.native="submitForm()">
                <el-button slot="prepend" icon="el-icon-lx-search"></el-button>
            </el-input>
        </el-form-item>
    </el-form>
    <div style="padding:0px 30px 10px 30px">
        <p v-if='$route.params.participant_hash !== undefined' style="margin-bottom:10px;color: gray;">From: {{ $route.params.participant_hash}} </p>
        <el-card shadow="hover" >
            <el-table :data="txList">
                <el-table-column :label="`${$t('i18n.txh')}`" :width="140" show-overflow-tooltip>
                    <template slot-scope="scope"><router-link :to = "'/tx/' + scope.row.hash + '/chain/' + chainId">{{scope.row.hash}}</router-link></template>
                </el-table-column>
                <el-table-column :label="`${$t('i18n.bkh')}`" :width="80" show-overflow-tooltip>
                    <template slot-scope="scope"><router-link :to = "'/block/' + scope.row.height + '/chain/' + chainId">{{scope.row.height}}</router-link></template>
                </el-table-column>
                <el-table-column :label="'From'" :max-width="260" show-overflow-tooltip >
                    <template slot-scope="scope"><router-link :to = "'/tx/' + scope.row.from + '/participant/' + chainId">{{scope.row.from}}</router-link></template>
                </el-table-column>
                <el-table-column :label="'To'"  :max-width="260" show-overflow-tooltip>
                    <template slot-scope="scope"><router-link :to = "'/tx/' + scope.row.to + '/participant/' + chainId">{{scope.row.to}}</router-link></template>
                </el-table-column>
                <el-table-column :label="`${$t('i18n.gasUsed')}`">
                <template slot-scope="scope">
                    <span>{{scope.row.gasUsed}}</span>
                    <span>{{'('+ (scope.row.gas_limit == 0?0:(scope.row.receipt.gas_used/scope.row.gas_limit*100)).toFixed(4) + '%)'}}</span>
                    <el-progress :show-text="false" :stroke-width="5" :percentage="scope.row.gas_limit == 0 ? 0: (scope.row.receipt.gas_used/scope.row.gas_limit*100)" ></el-progress>
                </template>
            </el-table-column>
            <el-table-column :label="`${$t('i18n.time')}`" :width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.timestamp }}</span>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="currentPage"
                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </el-card>
    </div>
</div>

</template>

<script>
import { getTxList } from '@/api/tx'
export default {
    data: function() {
        return {
            param: {
                info: '',
            },
            txList:[],
            currentPage:1,
            pageSize:10,
            totalCount:100,
            chainId: this.$route.params.chainId
        }
    },
    methods: {
        getPostData(data) {
            if (data === undefined) {
                data = {}
            }
            data.chain_id = this.chainId
            data.page_index = this.currentPage
            data.page_size = this.pageSize
            if (this.$route.params.participant_hash !== undefined) {
                data.participant_hash = this.$route.params.participant_hash
            }
            if (this.$route.params.block_id !== undefined) {
                data.block_id = this.$route.params.block_id
            }
            return data
        },
        submitForm() {
            this.$refs.search.validate(valid => {
                if (valid) {
                    let data = {
                        hash: this.param.info
                    }
                    data = this.getPostData(data)
                    getTxList(data).then((res) => {
                        if (res.data != null) {
                            this.txList = res.data.items
                            this.totalCount = res.data.total
                        } else {
                            this.txList = []
                            this.totalCount = 0
                        }
                    })

                } else {
                    this.$message.error(this.$t("i18n.searchInfo"))
                    this.getData()
                    return false
                }
            });
        },
        getData(){
            let data = this.getPostData()
            getTxList(data).then((res) => {
                if (res.data != null) {
                    this.txList = res.data.items
                    this.totalCount = res.data.total
                }
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getData();
        }
    },
    mounted:function() {
        this.getData()
        // setInterval(this.getData(),2000)
    },
    computed:{
        rules()
        {
            return {
                info: [{ required: true, message: this.$t("i18n.searchInfo"), trigger: 'blur' }]
            }
        },
    },
    watch: {
        '$route' (to, from) {
            this.getData()
        }
    },
};
</script>

<style scoped>
.ms-content {
    padding: 30px 30px 10px 30px;
}

.btn{
    width:100%
}

a{
    color: #3498db;
}
</style>

