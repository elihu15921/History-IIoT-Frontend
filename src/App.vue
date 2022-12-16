<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  created: function () {
    this.setLang()
  },
  methods: {
    setLang() {
      const browserLang = navigator.language || navigator['userLanguage']
      const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : browserLang
      localStorage.setItem('lang', lang)
      this.$i18n.locale = lang
    },
  },
})
</script>

<style lang="scss">
@import '../node_modules/ag-grid-community/dist/styles/ag-grid.css';
@import '../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css';
</style>
