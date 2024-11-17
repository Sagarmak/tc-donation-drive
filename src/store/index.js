import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      lightTheme: true,
    }
  },
  mutations: {
    setTheme(state, theme) {
      console.log('🚀 mut theme:', theme)
      return (state.lightTheme = theme)
    },
  },
  actions: {
    changeTheme(context, theme) {
      console.log('🚀 act theme:', theme)
      context.commit('setTheme', theme)
    },
  },
  getters: {
    lightTheme(state) {
      console.log('🚀 state:', state)
      return state.lightTheme
    },
  },
})

export default store
