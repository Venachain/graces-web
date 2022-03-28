<template>
    <div class='explorer'>
        <el-row :gutter='20'>
            <el-col :span='12'>
                <el-card shadow='hover'>
                    <div slot='header' style='margin-bottom: 10px'>
                        <span>{{ $t('i18n.bkList') }}</span>
                    </div>
                    <el-table :data='bkList' style='width: 100%;' max-height='550' :show-header='false' fit
                              class='tableBox'>
                        <el-table-column :width='220'>
                            <template slot-scope='scope'>
                                <div class='bk_icon'><span>BK</span></div>
                                <div class='bk_icon_right'>
                                    <router-link :to="'/block/' + scope.row.height + '/chain/' + chainId">
                                        {{ scope.row.height }}
                                    </router-link>
                                    <div>{{ scope.row.timestamp }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip>
                            <template slot-scope='scope'>
                                <div
                                    style='display: inline-block;width: 250px;overflow: hidden;text-overflow: ellipsis;'>
                                    <span style='font-weight: bold'>Miner </span>
                                    {{ scope.row.proposer }}
                                </div>
                                <div style='display: block'>
                                    <router-link :to="'/tx/' + scope.row.id + '/block/' + chainId">
                                        {{ scope.row.tx_amount }}
                                    </router-link>
                                    <span style=''> txns in this block </span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div>
                        <el-button type='primary' class='btn' @click='onClickBk'>{{ $t('i18n.viewAllBks') }}</el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span='12'>
                <el-card shadow='hover'>
                    <div slot='header' style='margin-bottom: 10px'>
                        <span>{{ $t('i18n.txList') }}</span>
                    </div>
                    <el-table :data='txList' max-height='550' :show-header='false' class='tableBox'>
                        <el-table-column :width='330'>
                            <template slot-scope='scope'>
                                <div style='display: flex;flex-direction: row'>
                                    <div class='bk_icon tx_icon'><span>TX</span></div>
                                    <div class='bk_icon_right'>
                                        <el-tooltip popper-class='tooltip' effect='dark' :content='scope.row.hash' placement='top'>
                                            <router-link :to="'/tx/' + scope.row.hash + '/chain/' + chainId" class='txhash'>
                                                {{ brief(scope.row.hash) }}
                                            </router-link>
                                        </el-tooltip>
                                        <div>{{ scope.row.timestamp }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope='scope'>
                                <div class='txhash'>
                                    <span style='font-weight: bold'>From: </span>
                                    <el-tooltip popper-class='tooltip' effect='dark' :content='scope.row.from' placement='top'>
                                        <router-link :to="'/tx/' + scope.row.from + '/participant/' + chainId">
                                            {{ brief(scope.row.from) }}
                                        </router-link>
                                    </el-tooltip>
                                </div>

                                <div class='txhash'>
                                    <span style='font-weight: bold'>To: </span>
                                    <el-tooltip popper-class='tooltip' effect='dark' :content='scope.row.to' placement='top'>
                                        <router-link :to="'/tx/' + scope.row.to + '/participant/' + chainId">
                                            {{ brief(scope.row.to) }}
                                        </router-link>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div>
                        <el-button type='primary' class='btn' @click='onClickTx'>{{ $t('i18n.viewAllTxs') }}</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        chainId: {
            type: String,
            required: true
        },
        bkList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        txList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        onClickBk() {
            this.$router.push('/blocks/' + this.chainId);
        },
        onClickTx() {
            this.$router.push('/txs/' + this.chainId);
        },
        brief(v) {
            let len = v.length;
            if (len > 40) {
                v = v.slice(0, 40) + '...';
            }
            return v;
        }
    }
};
</script>

<style scoped>
.ms-content {
    padding: 30px 30px;
}

.text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn {
    width: 100%;
}

a {
    color: #3498db;
}

.explorer {
}

.explorer >>> .el-card__header {
    padding-bottom: 5px;
    padding-left: 10px;
}

.explorer >>> .el-card__body {
    padding: 0px;
}

.bk_icon {
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    border-radius: 5px;
    float: left;
}

.tx_icon {
    border-radius: 20px;
}

.bk_icon_right {
    display: inline-block;
    height: 40px;
    margin-left: 5px;
}

.txhash {
    display: block;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
}

/deep/ .tableBox .cell {
    padding: 0 !important;
    height: 48px;
}
</style>
<style>
.tooltip{
    max-width: 400px;
    word-wrap: break-word;
}
</style>

