<template>
  <q-tooltip :anchor="getanchor" :offset="[10, 10]">
    {{ value }}
  </q-tooltip>
</template>

<script>
export default {
  name: 'dw-tooltip',
  props: {
    /**
     * 標籤內容。
     */
    value: {
      type: String,
    },
    anchor: {
      type: String,
      default: 'bottom',
    },
  },

  computed: {
    getanchor: function () {
      if (this.anchor === 'top') {
        return 'top middle'
      } else {
        return 'bottom middle'
      }
    },
  },
}
</script>

<style lang="scss">
/////////////////$LAYOUT$/////////////////
</style>
