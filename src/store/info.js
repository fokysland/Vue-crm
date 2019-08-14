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
            } catch(e) { console.log(e) }
        }
    },
    getters: {
        info: s => s.info
    }
}