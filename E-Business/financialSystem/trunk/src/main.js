import Vue from 'vue'
import Qs from 'qs'
import axios from 'axios'
import VueAxios from 'vue-axios'
//import 'element-ui/lib/theme-chalk/index.css'
//import './themes/default/index.css'
import './themes/blue/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/layout.less'
import ElementUI from 'element-ui'
import Utils from './utils'
import store from './store'
import router from './router'
import * as filters from './filters'
//import {mapGetters, mapActions} from 'vuex'
import {SET_AUTH, GET_AUTH, SET_BUTTONS} from './store/mutation-types'

import PageApp from './App.vue'
import Image from './components/common/Image.vue'
import DateRange from './components/common/DateRange.vue'

//import PopoverEnterprise from './components/popover/Enterprise.vue'
/*import Editor from './components/Editor.vue'
import FileUploader from './components/FileUploader.vue'
import AvatarUploader from './components/AvatarUploader.vue'*/

Vue.component('com-image', Image)
Vue.component('com-date-range', DateRange)

//Vue.component('popover-enterprise', PopoverEnterprise)
/*Vue.component('x-editor', Editor)
Vue.component('x-file-uploader', FileUploader)
Vue.component('x-avatar-uploader', AvatarUploader)*/

Vue.router = router
Vue.use(VueAxios, axios)
Vue.use(ElementUI)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(Utils, {
    /*...mapGetters({
        auth: 'auth'
    }),*/
    auth: store.state.auth.data,
    logout: function () { //退出登录
        store.commit(SET_AUTH)
    }
})

// 获取认证
store.commit(GET_AUTH)

//全局默认配置
//axios.defaults.baseURL = '/api/'
/*axios.defaults.baseURL = '//wq.ininin.com/'
axios.defaults.withCredentials = false
axios.defaults.headers.common['Accept'] = 'application/json'*/
axios.defaults.baseURL = '//action.ininin.com/'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//axios.defaults.headers.common['content-Type'] = 'appliction/x-www-form-urlencoded'
//添加一个请求拦截器
axios.interceptors.request.use(function (request) {
    // 获取认证
    store.commit(GET_AUTH)
    const that = Vue.prototype
    //const token = store.state.auth ? store.state.auth.data.token : ''
    //在请求发出之前进行一些操作
    /*if (token) {
        request.headers.common['Authorization'] = that.sha1(token)
        request.headers.common['X-Auth-Token'] = token
    }*/
    request.headers.common['x-Requested-With'] = 'XMLHttpRequest'
    if (request.data) {
        request.data = Qs.stringify(that.filterParams(request.data, request.method.toUpperCase() === 'GET'))
    }
    if (request.params) {
        request.params = that.filterParams(request.params, request.method.toUpperCase() === 'GET')
    }
    console.log(request.url, JSON.stringify(request.params || request.data))
    return request
}, function (err) {
    //Do something with request error
    const that = Vue.prototype
    that.message.error(that)
    return Promise.reject(err)
})
//添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    const that = Vue.prototype
    //在这里对返回的数据进行处理
    that.globalResponse(response, function (data) {
        response.succeed = parseInt(data.result, 10) === 0
        response.body = data || {}
    }, function (data) {
        response.body = data || {}
    })
    return response
}, function (err) {
    //Do something with response error
    const that = Vue.prototype
    that.message.error(that, (err.response && err.response.status === 500) ? '服务器繁忙，请稍后访问！' : '')
    return Promise.reject(err)
})

router.beforeEach(function (to, from, next) {
    const that = Vue.prototype
    store.commit(SET_BUTTONS, [])
    const meta = to.meta || {}
    if (that.permission(meta.auth) || !meta.auth) { //权限验证
        next()
    } else if (to.name !== '404') {
        next({
            path: '/404'
        })
    }
})

const app = new Vue({
    router,
    store,
    el: '#app',
    render: h => h(PageApp)
}).$mount('#app')

export {app, router, store}