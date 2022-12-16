<template>
  <q-btn
    v-on="$attrs"
    v-bind="$props"
    no-caps
    no-wrap
    unelevated
    size="13.225px"
    :label="label"
    class="dw-button"
  >
    <!-- <dw-tooltip :value="label" v-if="label" /> -->
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  name: 'dw-button',

  props: {
    /**
     * 圖標名稱。
     */
    icon: {
      type: String,
    },
    /**
     * 使外觀呈現圓形按鈕。
     */
    round: {
      type: Boolean,
    },
    label: {
      type: String,
    },
  },
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-button
  .q-ripple
    display: none

//////////////////$MISC$//////////////////
.dw-button
  @include text-caption-regular
  .q-btn__content
    font-size: 14px

////////////////$OVERRIDE$////////////////

.dw-button .q-btn__wrapper
  min-height: 34px
  &,
  .q-dialog__inner > .dw-window-outer > .dw-window-footer &
    // min-width: 88px;
    min-width: 10px

/////////////////$THEMES$/////////////////
.dw-button
  color: $color-white
</style>
