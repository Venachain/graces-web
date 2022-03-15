import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/chains'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: 'home' },
            children: [
                {
                    path: '/chains',
                    component: () => import('@/components/page/ChainList.vue'),
                    meta: { title: 'i18n.chains' }
                },
                {
                    path: '/chain/:chainId',
                    component: () => import('@/components/page/Chain.vue'),
                    meta: { title: 'i18n.chain' }
                },
                {
                    path: '/blocks/:chainId',
                    component: () => import(/* webpackChunkName: "blocks" */ '../components/page/Blocks.vue'),
                    meta: { title: 'i18n.blocks'}
                },
                {
                    path: '/block/:blockNum/chain/:chainId',
                    component: () => import(/* webpackChunkName: "block" */ '../components/page/BlockDetail.vue'),
                    meta: { title: 'i18n.bkDetail' },
                    props: true
                },
                {
                    path: '/txs/:chainId',
                    component: () => import(/* webpackChunkName: "txs" */ '../components/page/Transactions.vue'),
                    meta: { title: 'i18n.txs' }
                },
                {
                    path: '/tx/:participant_hash/participant/:chainId',
                    component: () => import(/* webpackChunkName: "tx" */ '../components/page/Transactions.vue'),
                    meta: { title: 'i18n.txsUser' }
                },
                {
                    path: '/tx/:block_id/block/:chainId',
                    component: () => import(/* webpackChunkName: "tx" */ '../components/page/Transactions.vue'),
                    meta: { title: 'i18n.txsUser' }
                },
                {
                    path: '/tx/:txHash/chain/:chainId',
                    component: () => import(/* webpackChunkName: "tx" */ '../components/page/TransDetail.vue'),
                    meta: { title: 'i18n.txDetail' },
                    props: true
                },
                {
                    path: '/node/:id/:chainId',
                    component: () => import(/* webpackChunkName: "node" */ '../components/page/NodesDetail.vue'),
                    meta: { title: 'i18n.nodeDetail' },
                    props: true
                },
                {
                    path: '/contracts/:chainId',
                    component: () => import(/* webpackChunkName: "contracts" */ '../components/page/Contracts.vue'),
                    meta: { title: 'i18n.contracts' }
                },
                {
                    path: '/contract/:addr/chain/:chainId',
                    component: () => import(/* webpackChunkName: "contract" */ '../components/page/ContractDetail.vue'),
                    meta: { title: 'i18n.scDetail' },
                    props: true
                },
                {
                    path: '/system/:chainId',
                    component: () => import(/* webpackChunkName: "system" */ '../components/page/SystemConfig.vue'),
                    meta: { title: 'i18n.system',permission:true},
                    props: { showEdit:true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
