import { createStore } from 'vuex'
import { db } from '@/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import dbConfig from '../config.js'

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
    async fetchUsers(context) {
      const userRef = query(collection(db, dbConfig.users))
      const userSnapshot = await getDocs(userRef)
      const users = userSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      context.commit('setUsers', users)
    },
    async fetchLocations(context) {
      const locationRef = query(collection(db, dbConfig.location), orderBy('id'))
      const locationSnapshot = await getDocs(locationRef)
      const locations = locationSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      context.commit('setLocations', locations)
    },
    async fetchItems(context) {
      const itemRef = query(collection(db, dbConfig.items), orderBy('id'))
      const itemSnapshot = await getDocs(itemRef)
      const items = itemSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
          count: 0,
        }
      })
      context.commit('setItems', items)
    },
    async fetchPredictions(context) {
      const predRef = query(collection(db, dbConfig.prediction))
      const predSnapshot = await getDocs(predRef)
      const predictions = predSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
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
