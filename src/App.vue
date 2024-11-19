<template>
  <div
    class="layout mx-auto min-h-screen bg-background transition duration-300 ease-in-out w-100 lg:px-20 lg:py-8 px-6 py-10"
    :class="{ 'theme-light': lightTheme, 'theme-dark': !lightTheme }"
  >
    <NavBar />
    <RouterView />
  </div>
</template>
<script lang="js">
import NavBar from './components/NavBar.vue'

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
    getUsers() {
      this.$store.dispatch('fetchUsers')
    },
    getLocations() {
      this.$store.dispatch('fetchLocations')
    },
    getItems() {
      this.$store.dispatch('fetchItems')
    },
    getPredictions() {
      this.$store.dispatch('fetchPredictions')
    },
  },
}
</script>
