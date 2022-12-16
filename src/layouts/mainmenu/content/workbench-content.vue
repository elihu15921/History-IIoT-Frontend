<template>
  <q-page-container class="dw-workbench-body">
    <div class="dw-workbench-body-inner">
      <div class="dw-workbench-body-content">
        <slot>
          <router-view></router-view>
        </slot>
      </div>
    </div>
  </q-page-container>
</template>

<script>
// import inject from '../../../foundation/mixins/inject';
export default {
  mixins: [
    // inject('$dw', 'dw-workbench-content')
  ],
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-workbench-body
  // &-inner,
  // &-content
  //   overflow: hidden
  // &
  //   height: 100vh
  // &-inner,
  // &-content,
  // &-content > *
  //   height: 100%
  // &-inner
  //   padding: 16px

/////////////////$THEMES$/////////////////
.dw-workbench-body
  // background-color: $color-polo-blue
</style>
