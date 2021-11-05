<template>
    <div>
        <div slot="header" style="margin-bottom: 10px">
            <span>{{ $t('i18n.nodeList') }}</span>
        </div>

        <el-scrollbar style="height: 100%">
            <el-table :data="nodeList" :max-height="height" style="width: 100%" :show-header="false">
                <el-table-column>
                    <template v-slot="scope">
                        <div class="node_icon"><span>Node</span></div>
                        <div class="node_icon_right">
                            <div class="node_key">
                                <router-link v-if="isAlive(scope.row)" :to="'/node/' + scope.row.id + '/' + chainId">
                                    {{ scope.row.name + '(' + scope.row.public_key + ')' }}
                                </router-link>
                                <div v-else>
                                    {{ scope.row.name + '(' + scope.row.public_key + ')' }}
                                </div>
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
                            {{ isAlive(scope.row) ? 'Normal' : 'Error' }}
                        </div></template
                    >
                </el-table-column>
            </el-table>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    props: {
        height: {
            default: 270
        },
        nodeList: {
            type: Array,
            default: () => {return []}
        }
    },
    data() {
        return {
            chainId: this.$route.params.chainId
        }
    },
    methods: {
        isAlive(row) {
            return row.is_alive && row.status==1 && row.blocknumber > 0
        }
    }
};
</script>

<style scoped>
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