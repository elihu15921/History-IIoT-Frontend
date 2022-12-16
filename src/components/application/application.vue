<template>
  <div v-css-drilldown="app.drilldown" class="dw-application" :class="classes">
    <div v-css-accent="app.focused" class="dw-application-master">
      <div class="dw-application-master-content">
        <slot></slot>
      </div>
    </div>

    <div v-if="app.drilldown" class="dw-application-detail">
      <div class="dw-application-detail-head">
        <dw-application-tabbar :context="app.context"></dw-application-tabbar>
      </div>
      <div class="dw-application-detail-content">
        <dw-application-set :context="app.context"></dw-application-set>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dw-application',

  provide: function () {
    return {
      $app: this.app,
    }
  },

  props: {
    /**
     * 應用程式實例。
     */
    app: {
      type: Object,
      required: true,
    },
  },

  computed: {
    classes: function () {
      return [this.appid ? `dw-app-${this.appid}` : '']
    },

    appid: function () {
      return this.app.name
    },
  },
}
</script>

<style lang="sass">
/////////////////$LAYOUT$/////////////////
.dw-application
  &, &-master, &-detail
    display: flex
    flex-direction: column
  &-master, &-detail
    flex: 1
  &-detail
    margin-top: 16px
  &-master-content, &-detail-content
    height: 100%
  &.drilldown &-set
    height: 100%
</style>
