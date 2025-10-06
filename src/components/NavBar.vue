<template>
  <div class="header flex items-center justify-center lg:justify-between">
    <div>
      <AppLogo :light-theme="lightTheme" />
      <div class="text-color-text text-center text-xl italic mt-2 lg:text-left">
        Joy of giving - October 2025
      </div>
    </div>
    <div class="theme cursor-pointer fixed bottom-0 left-0 m-4 lg:relative">
      <LightTheme v-if="!lightTheme" @click="changeTheme(true)" />
      <DarkTheme v-if="lightTheme" @click="changeTheme(false)" />
    </div>
  </div>
</template>
<script lang="js">
import AppLogo from './AppLogo.vue'
import LightTheme from './LightTheme.vue'
import DarkTheme from './DarkTheme.vue'

export default {
  components: { AppLogo, LightTheme, DarkTheme },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },
  },
  methods: {
    changeTheme(theme) {
      this.$store.dispatch('changeTheme', theme).then(() => {
        //
      })
    },
  },
}
</script>
