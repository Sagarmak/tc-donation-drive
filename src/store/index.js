import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      lightTheme: true,
    }
  },
  mutations: {
    setTheme(state, theme) {
      return (state.lightTheme = theme)
    },
  },
  actions: {
    changeTheme(context, theme) {
      context.commit('setTheme', theme)
    },
  },
  getters: {
    lightTheme(state) {
      return state.lightTheme
    },
  },
})

export default store
