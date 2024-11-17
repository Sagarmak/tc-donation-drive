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
export default {
  components: { NavBar },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },
  },
}
</script>
