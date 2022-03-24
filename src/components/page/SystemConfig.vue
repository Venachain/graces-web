<template>
    <div>
        <el-card shadow="hover" class="card-parmas">
            <Params :chain-id='chainId'></Params>
        </el-card>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover" class="card">
                    <Nodes :height="385" :showEdit="this.showEdit" :chainId='chainId'></Nodes>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" class="card">
                    <CNSs :height="385" :chainId='chainId'></CNSs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Params from './Params'
import Nodes from './Nodes'
import CNSs from './CNSs'
export default {
    props:{
        showEdit :{
            default:false
        }
    },
    data() {
        return {
            chainId: this.$route.params.chainId
        }
    },
    components: {
        Params,
        Nodes,
        CNSs
    },
}
</script>
<style scoped>
.card-parmas {
    height:200px;
    margin-bottom: 15px;
}
.card{
    height:430px;
    margin-bottom: 15px;
}

.card >>> .el-card__header{padding-bottom: 5px!important;}
</style>