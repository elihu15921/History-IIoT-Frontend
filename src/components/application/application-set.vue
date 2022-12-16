<template>
  <q-page class="dw-application-set" :style-fn="style">
    <dw-application
      v-for="app in context.apps"
      v-show="context.browsing === app"
      :key="app.id"
      :app="app"
    >
      <component :is="app.loader"></component>
    </dw-application>
  </q-page>
</template>

<script>
export default {
  name: 'dw-application-set',

  props: {
    /**
     * 多頁籤執行狀態容器物件。
     */
    context: {
      type: Object,
      required: true,
    },
  },

  methods: {
    style: function (offset) {
      // ref: https://quasar.dev/layout/page
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration
      return {}
    },
  },
}
</script>

<style lang="sass">
/////////////////$LAYOUT$/////////////////
.dw-application-set
  & > *
    height: 100%
</style>
