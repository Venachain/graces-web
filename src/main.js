import Vue from 'vue';
import VueCookies from 'vue-cookies'
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.config.productionTip = false;

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

Vue.use(ElementUI, {
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
});

axios.defaults.withCredentials=true

Vue.use(VueAxios,axios)

Vue.use(VueCookies)

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = i18n.t(to.meta.title) || i18n.t('i18n.system_name');

    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
        Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
            confirmButtonText: '确定'
        });
    } else {
        next();
    }
});



let startWeb = function() {
    
    axios.get('/static/config.json').then(res => {
        Vue.prototype.BASE_URL = res.data.BASE_URL;
        Vue.prototype.BASE_WS = res.data.BASE_WS;
        Vue.prototype.BASE_ENV = res.data.BASE_ENV;

        if (res.data.BASE_ENV == 'development'){
            require( './mock');
        }
        new Vue({
            router,
            i18n,
            render: h => h(App)
        }).$mount('#app');
    })
}

startWeb();




