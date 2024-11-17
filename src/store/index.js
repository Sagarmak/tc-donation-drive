import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      lightTheme: true,
      users: [],
      locations: [],
      items: [],
      predictions: [],
    }
  },
  actions: {
    changeTheme(context, theme) {
      context.commit('setTheme', theme)
    },
    fetchUsers(context, users) {
      context.commit('setUsers', users)
    },
    fetchLocations(context, locations) {
      context.commit('setLocations', locations)
    },
    fetchItems(context, items) {
      context.commit('setItems', items)
    },
    fetchPredictions(context, predictions) {
      context.commit('setPredictions', predictions)
    },
  },
  mutations: {
    setTheme: (state, theme) => (state.lightTheme = theme),
    setUsers: (state, users) => (state.users = users),
    setLocations: (state, locations) => (state.locations = locations),
    setItems: (state, items) => (state.items = items),
    setPredictions: (state, predictions) => (state.predictions = predictions),
  },
  getters: {
    lightTheme: (state) => state.lightTheme,
    users: (state) => state.users,
    locations: (state) => state.locations,
    items: (state) => state.items,
    predictions: (state) => state.predictions,
  },
})

export default store
