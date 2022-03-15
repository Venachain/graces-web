<template>
    <div class="node-detail">
        <p class="title_bn">{{ $t('i18n.nodeDetail') }}</p>
        <el-card shadow="hover" class="card_content">
            <div v-for="item in items" v-bind:key="item.id">
                <el-row :gutter="20">
                    <el-col :span="8">
                    <el-popover placement="top-start" width="200" trigger="hover" :content="item.content">
                        <i class="el-icon-lx-question" slot="reference"></i>
                    </el-popover>
                    <span>{{ item.field }}</span>
                </el-col>
                    <el-col :span="16">
                        <!-- normal -->
                        <span class="spans">{{ item.value }}</span>
                    </el-col>
                </el-row>
                <hr class="hr_space" />
            </div>
        </el-card>
    </div>
</template>

<script>
import { getNode, nodeSync } from '@/api/node'
export default {
    data: function () {
        return {
            node1: {
                name: '',
                pub_key: '',
                internal_ip: '',
                external_ip: '',
                rpc_port: '',
                p2p_port: '',
                type: '',
                status: '',
                owner: ''
            },
            node2: {
                blocknumber: '',
                ismining: '',
                gasprice: '',
                pendingtx: '',
                pendingnumber: ''
            }
        };
    },
    watch: {
        $route(to, from) {
            this.getData();
        }
    },
    methods: {
        getData() {
            let id = this.$route.params.id;
            getNode(id).then((res) => {
                if (res.data != null) {
                    this.node1 = res.data;
                    this.getData2();
                }
            })
        },
        getData2() {
            let data = {
                ip: this.node1.external_ip,
                port: this.node1.rpc_port
            }
            nodeSync(data).then((res) => {
                if(res.data != null) {
                    this.node2 = res.data;
                }
            })
        }
    },
    computed: {
        items: function () {
            return [
                {
                    id: 1,
                    field: 'Name:',
                    content: this.$t('i18n.nodeName'),
                    value: this.node1.name
                },
                {
                    id: 2,
                    field: 'PubilcKey:',
                    content: this.$t('i18n.publicKey'),
                    value: this.node1.public_key
                },
                {
                    id: 3,
                    field: 'Internal Ip:',
                    content: this.$t('i18n.internalIP'),
                    value: this.node1.internal_ip
                },
                {
                    id: 4,
                    field: 'External Ip:',
                    content: this.$t('i18n.externalIP'),
                    value: this.node1.external_ip
                },
                {
                    id: 5,
                    field: 'RPC Port:',
                    content: this.$t('i18n.rpcPort'),
                    value: this.node1.rpc_port
                },
                {
                    id: 6,
                    field: 'P2P Port:',
                    content: this.$t('i18n.p2pPort'),
                    value: this.node1.p2p_port
                },
                {
                    id: 7,
                    field: 'Type:',
                    content: this.$t('i18n.type'),
                    value: this.node1.type
                },
                {
                    id: 8,
                    field: 'Status:',
                    content: this.$t('i18n.status'),
                    value: this.node1.status
                },
                {
                    id: 9,
                    field: 'Owner:',
                    content: this.$t('i18n.owner'),
                    value: this.node1.owner
                },
                {
                    id: 10,
                    field: 'Blocknumber:',
                    content: this.$t('i18n.blockNumber'),
                    value: this.node2.blocknumber
                },
                {
                    id: 11,
                    field: 'Ismining:',
                    content: this.$t('i18n.mining'),
                    value: this.node2.ismining
                },
                {
                    id: 12,
                    field: 'Gasprice:',
                    content: this.$t('i18n.gasprice'),
                    value: this.node2.gasprice
                },
                {
                    id: 13,
                    field: 'Pending Tx:',
                    content: this.$t('i18n.pendingtx'),
                    value: this.node2.pendingtx
                },
                {
                    id: 14,
                    field: 'Pending Number:',
                    content: this.$t('i18n.pendingnumber'),
                    value: this.node2.pendingnumber
                }
            ];
        }
    },
    mounted: function () {
        this.getData();
    }
};
</script>
<style scoped>
.title_bn {
    color: #6c757e;
    line-height: 1.7;
    margin-top: 10px;
    margin-left: 10px;
}
.card_content {
    margin-top: 20px;
    margin-right: 10px;
}
.hr_space {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    opacity: 0.75;
    border-top: 1px solid #e7eaf3;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
}
.icon-li-content {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.tx-status {
    color: #00c9a7;
    background-color: rgba(0, 201, 167, 0.1);
    font-size: small;
    width: 70px;
    height: 22px;
    text-align: center;
    border-radius: 3px;
    padding-top: 5px;
}

.tx-fail {
    color: #de4437;
    background-color: rgba(222, 68, 55, 0.1);
}

a {
    color: #3498db;
}

.node-detail >>> .el-progress-bar__outer {
    display: block;
    width: 400px;
}

.spans {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
}
</style>