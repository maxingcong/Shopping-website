import md5 from 'js-md5'
import Base64 from 'js-base64'
import Cookies from "js-cookie"
import * as types from '../mutation-types'

const ROLE_ID = 10
const DOMAIN = 'ininin.com'
const HOST = md5(Base64.Base64.encode(window.location.host))
const SYSTEM_TYPE = md5(Base64.Base64.encode('ininin-financial-system'))

const state = {
    data: {
        host: HOST, //系统域名
        token: '',
        userName: '',
        nickName: '',
        roleIds: [],
        roleNames: [],
        privileges: {}
    }
}

const getPrivileges = function (resourceIds = '') {
    let privileges = {}
    resourceIds.split(';').forEach(function (resourceId) {
        if (resourceId) {
            privileges[resourceId] = true
        }
    })
    return privileges
}
/*const getPrivileges = function (privileges) {
    let result = {}
    privileges = privileges || []
    privileges.forEach(function (privilege) {
        result[privilege] = true
    })
    return result
}*/

const setCookie = function (data = null) {
    if (data && data.token && data.userName) {
        Cookies.set('sid', data.token, {path: '/', domain: DOMAIN})
        Cookies.set('_user_type', 10, {path: '/', domain: DOMAIN})
        Cookies.set('ticket', Base64.Base64.encode(JSON.stringify(data)), {path: '/'})
        Cookies.set('system', SYSTEM_TYPE, {path: '/'})

    } else {
        Cookies.set('sid', '', {expires: -1, path: '/', domain: DOMAIN})
        Cookies.set('_user_type', '', {path: '/', domain: DOMAIN})
        Cookies.set('ticket', '', {expires: -1, path: '/'})
        Cookies.set('system', '', {expires: -1, path: '/'})
    }
}

const mutations = {
    [types.SET_AUTH](state, data) {
        if (data && data.userName && Array.isArray(data.roleIds) && data.roleIds.indexOf(ROLE_ID) >= 0) {
            data.nickName = data.nickName || data.userName
            state.data.token = data.token
            state.data.userName = data.userName
            state.data.nickName = data.nickName
            state.data.roleIds = data.roleIds
            state.data.roleNames = data.roleNames
            state.data.privileges = getPrivileges(data.resourceIds)
            setCookie(state.data)
        } else {
            state.data.token = ''
            state.data.userName = ''
            state.data.nickName = ''
            state.data.roleIds = []
            state.data.roleNames = []
            state.data.privileges = {}
            setCookie()
        }
    },

    [types.GET_AUTH](state) {
        const token = Cookies.get('sid')
        const ticket = Cookies.get('ticket')
        const system = Cookies.get('system')
        let data = null
        try {
            data = JSON.parse(Base64.Base64.decode(ticket))
        } catch (e) {
        }
        if (data && data.host === HOST && token === data.token && system === SYSTEM_TYPE && Array.isArray(data.roleIds) && data.roleIds.indexOf(ROLE_ID) >= 0) {
            state.data.token = data.token
            state.data.userName = data.userName
            state.data.nickName = data.nickName
            state.data.roleIds = data.roleIds
            state.data.roleNames = data.roleNames
            state.data.privileges = data.privileges
        } else {
            state.data.token = ''
            state.data.userName = ''
            state.data.nickName = ''
            state.data.roleIds = []
            state.data.roleNames = []
            state.data.privileges = {}
            setCookie()
        }
    }/*,

    [types.PERMISSION](state) {
        return 'fff'
    }*/
}

export default {
    state,
    mutations
}