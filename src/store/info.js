import firebase from 'firebase/app'

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info
        },
        clearInfo(state) {
            state.info = null
        }
    },
    actions: {
        async fetchInfo({ dispatch, commit }) {
            try {
                const uid = await dispatch('getUId')
                const ref = await firebase.database().ref(`/users/${uid}/info`).once('value')
                const info = ref.val()
                commit('setInfo', info)
            } catch(e) { 
                commit('setError', e)
                throw e 
            }
        },
        async updateInfo({ dispatch, commit, getters }, toUpdate) {
            try {
                const uid = await dispatch('getUId')
                const updateData = {...getters.info, ...toUpdate}
                await firebase.database().ref(`/users/${uid}/info`).update(updateData)
                commit('setInfo', updateData)
            } catch(e) { 
                commit('setError', e)
                throw e
             }
        }
    },
    getters: {
        info: s => s.info
    }
}