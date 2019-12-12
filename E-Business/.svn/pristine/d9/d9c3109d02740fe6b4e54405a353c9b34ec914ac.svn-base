import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import pkg from '../../package.json'
import app from './modules/app'
import menu from './modules/menu'
import auth from './modules/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: true,  // process.env.NODE_ENV !== 'production',
    actions,
    getters,
    modules: {
        app,
        menu,
        auth
    },
    state: {
        pkg
    },
    mutations: {}
})

export default store
