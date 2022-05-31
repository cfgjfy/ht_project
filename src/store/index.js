import { getToken, removeToken, setToken } from '@/utils/auth'
import Vue from 'vue'
import Vuex from 'vuex'
import { loginAPI } from '@/api/login';
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: getToken() || null
    },
    mutations: {
        getToken(state, payload) {
            state.token = payload
            setToken(payload)
        },
        removeToken(state) {
            state.token = null
            removeToken()
        }
    },
    actions: {
        async login(context, data) {
            const { data: res } = await loginAPI(data)
            context.commit('getToken', res.data.token)
        },
        logout(context) {
            context.commit('removeToken')
        }
    },
    getters: {}
})
