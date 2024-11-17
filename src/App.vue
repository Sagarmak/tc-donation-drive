<template>
  <div
    class="layout mx-auto min-h-screen bg-background transition duration-300 ease-in-out w-100 px-20 py-8"
    :class="{ 'theme-light': lightTheme, 'theme-dark': !lightTheme }"
  >
    <NavBar />
    <RouterView />
  </div>
</template>
<script lang="js">
import NavBar from './components/NavBar.vue'
import { db } from '@/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

export default {
  components: { NavBar },
  created() {
    this.getUsers()
    this.getLocations()
    this.getItems()
    this.getPredictions()
  },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },
  },
  methods: {
    async getUsers() {
      const userRef = query(collection(db, 'users'))
      const userSnapshot = await getDocs(userRef)
      this.users = userSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchUsers', this.users)
    },
    async getLocations() {
      const locationRef = query(collection(db, 'location'), orderBy('id'))
      const locationSnapshot = await getDocs(locationRef)
      this.locations = locationSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchLocations', this.locations)
    },
    async getItems() {
      const itemRef = query(collection(db, 'items'), orderBy('id'))
      const itemSnapshot = await getDocs(itemRef)
      const items = itemSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
          count: 0,
        }
      })
      this.$store.dispatch('fetchItems', items)
    },
    async getPredictions() {
      const predRef = query(collection(db, 'prediction'))
      const predSnapshot = await getDocs(predRef)
      const predictions = predSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchPredictions', predictions)
    },
  },
}
</script>
