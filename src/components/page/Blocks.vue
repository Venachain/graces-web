<template>
<div class="blocks">
    <el-form :model="param" label-width="0px" class="ms-content" @submit.native.prevent>
        <el-form-item prop="info">
            <el-input v-model="param.info" :placeholder="`${$t('i18n.blockSearch')}`" @keyup.enter.native="submitForm">
                <el-button slot="prepend" icon="el-icon-lx-search" @click='submitForm'></el-button>
            </el-input>
        </el-form-item>
    </el-form>
    <div style="padding:0px 30px 10px 30px">
        <el-card shadow="hover" >
            <el-table :data="bkList" >
            <el-table-column :label="`${$t('i18n.bkh')}`" :width="80">
                <template slot-scope="scope"><router-link :to = "'/block/' + scope.row.height + '/chain/' + chainId">{{scope.row.height}}</router-link></template>
            </el-table-column>
            <el-table-column :label="`${$t('i18n.miner')}`" :max-width="280" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.proposer}}</template>
            </el-table-column>
            <el-table-column :label="`${$t('i18n.txcnt')}`"  :width="80">
                <template slot-scope="scope">
                    <router-link :to = "'/tx/' + scope.row.id + '/block/' + chainId">{{scope.row.tx_amount}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column :label="`${$t('i18n.gasUsed')}`">
                <template slot-scope="scope">
                    <span>{{scope.row.gas_used}}</span>
                    <span>{{'('+ (scope.row.gas_limit == 0?0:(scope.row.gas_used/scope.row.gas_limit*100)).toFixed(4) + '%)'}}</span>
                    <el-progress :show-text="false" :stroke-width="5" :percentage="scope.row.gas_limit == 0?0:(scope.row.gas_used/scope.row.gas_limit*100)" ></el-progress>
                </template>
            </el-table-column>
             <el-table-column :label="`${$t('i18n.size')}`"  :width="150">
                 <template slot-scope="scope">
                    <span>{{scope.row.size + ' Bytes'}}</span>
                </template>
             </el-table-column>
            <el-table-column :label="`${$t('i18n.time')}`"  :width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.timestamp }}</span>
                </template>
            </el-table-column>
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="currentPage"
                :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount" style="padding-top:10px">
              </el-pagination>
        </el-card>
    </div>
</div>

</template>

<script>
import { getBlockList } from '@/api/block'
export default {
    data: function() {
        return {
            param: {
                info: '',
            },
            bkList:[],
            currentPage:1,
            PageSize:10,
            totalCount:100,
            chainId: this.$route.params.chainId
        }
    },
    methods: {
        submitForm() {
            if (this.param.info === ''){
                this.getData()
            }else{
                let data = {
                    chain_id: this.$route.params.chainId
                }
                if (this.param.info.match(/^[0-9]+$/)){
                    data.height = parseInt(this.param.info);
                } else {
                    data.hash = this.param.info;
                }
                getBlockList(data).then((res) => {
                    if (res.data != null) {
                        this.bkList = res.data.items;
                        this.totalCount = res.data.total;
                    } else {
                        this.totalCount = 0
                        this.bkList = []
                    }
                })
            }
        },
        getData(){
            let data = {
                chain_id: this.$route.params.chainId,
                page_index: this.currentPage,
                page_size: this.PageSize
            }
            getBlockList(data).then((res) => {
                if (res.data != null) {
                    this.bkList = res.data.items;
                    this.totalCount = res.data.total;
                }  else {
                    this.totalCount = 0
                    this.bkList = []
                }
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        },
        handleSizeChange(val){
            this.PageSize = val;
             this.getData();
        }
    },
    created:function() {
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
    }
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

