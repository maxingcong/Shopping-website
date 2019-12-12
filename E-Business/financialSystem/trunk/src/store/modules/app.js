import * as types from '../mutation-types'

const state = {
    buttons: []
}

const mutations = {
    [types.SET_BUTTONS](state, buttons) {
        buttons = buttons || []
        state.buttons.splice(0, state.buttons.length, ...buttons)
    }
}

export default {
    state,
    mutations
}
