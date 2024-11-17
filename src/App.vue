<template>
  <div
    class="layout mx-auto min-h-screen bg-background transition duration-300 ease-in-out"
    :class="{ 'theme-light': lightTheme, 'theme-dark': !lightTheme }"
  >
    <RouterView />
  </div>
</template>
<script lang="js">
export default {
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },
  },
}
</script>
