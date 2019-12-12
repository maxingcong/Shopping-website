import lazyLoading from './lazyLoading'

const state = {
    items: [{
        name: '/',
        alias: 'home',
        path: '/',
        meta: {
            icon: 'fa fa-home',
            label: '首页',
            link: 'Home.vue'
        },
        component: lazyLoading('Home')
    }, {
        name: 'api',
        path: '/api',
        meta: {
            icon: 'fa fa-database',
            label: '接口管理（DEV）',
            link: 'api/index.vue',
            auth: [18]
        },
        component: lazyLoading('api/index')
    }, {
        name: 'role',
        path: '/role',
        meta: {
            icon: 'fa fa-user-secret',
            label: '角色管理',
            link: 'role/index.vue',
            auth: [8]
        },
        component: lazyLoading('role/index')
    }, {
        name: 'account',
        path: '/account',
        meta: {
            icon: 'fa fa-users',
            label: '账号管理',
            link: 'account/index.vue',
            auth: [15]
        },
        component: lazyLoading('account/index')
    }, {
        name: 'enterprise',
        path: '/enterprise',
        meta: {
            icon: 'fa fa-vcard',
            label: '企业管理',
            link: 'enterprise/index.vue',
            auth: [15]
        },
        component: lazyLoading('enterprise/index')
    }, {
        name: 'credit',
        path: '/credit',
        meta: {
            icon: 'fa fa-credit-card',
            label: '信用管理',
            link: 'credit/index.vue',
            auth: [15]
        },
        component: lazyLoading('credit/index')
    }, {
        name: 'receivable',
        path: '/receivable',
        meta: {
            icon: 'fa fa-money', //'fa fa-credit-card',
            label: '应收账款',
            link: 'receivable/index.vue',
            auth: [100]
        },
        component: lazyLoading('receivable/index')
    }, {
        name: 'overdue',
        path: '/overdue',
        meta: {
            icon: 'fa fa-hourglass-o', //'fa fa-money',
            label: '延期还款申请',
            link: 'overdue/index.vue',
            auth: [100]
        },
        component: lazyLoading('overdue/index')
    }, {
        name: 'amoeba',
        path: '/amoeba',
        meta: {
            icon: 'fa fa-users',
            label: '阿米巴账户管理',
            link: 'amoeba/index.vue',
            auth: [100]
        },
        component: lazyLoading('amoeba/index')
    }, {
        name: '404',
        path: '*',
        component: lazyLoading('NotFound')
    }]
}

export default {
    state
}
