<template>
  <div class="header flex items-center justify-between">
    <div>
      <AppLogo :light-theme="lightTheme" />
      <div class="text-color-text text-2xl italic mt-2">Donation Drive</div>
    </div>
    <div class="theme cursor-pointer">
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
        console.log('done')
      })
    },
  },
}
</script>
