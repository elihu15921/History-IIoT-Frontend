<template>
  <q-select
    ref="input"
    :name="name"
    emit-value
    map-options
    class="dw-selectbox dw-workbench-outline"
    popup-content-class="dw-selectbox-popup dw-workbench-outline-popup"
    options-selected-class="dw-selectitem-selected"
    :value="value"
    @input="$emit('input', $event)"
    :behavior="behavior"
    option-label="text"
    option-value="value"
    dropdown-icon="down"
    :options="options"
    :label="label"
    :rules="validationRules"
    :use-chips="multiple"
    :multiple="multiple"
  >
    <template v-slot:selected-item="scope" v-if="multiple">
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        text-color="black"
        class="q-ma-none"
      >
        {{ scope.opt }}
      </q-chip>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'dw-select',

  props: {
    /**
     * selected value。
     */
    name: {
      type: String,
    },
    /**
     * 是否多選。
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * selected value。
     * 單選傳入:string
     * 多選傳入:array
     */
    value: null,
    /**
     * 下拉形式。
     */
    behavior: {
      type: String,
      default: 'menu',
      enum: ['menu', 'dialog'],
    },
    /**
     * 標籤。
     */
    label: String,
    /**
     * 內容。
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * 是否驗證。
     */
    required: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    validationRules() {
      const rules = []

      if (this.required) {
        rules.push((val) => !!val || 'cant empty')
      }

      return rules
    },
    // classes: function() {
    //   return [
    //     { "on-left": this.left },
    //     { "on-right": this.right },
    //     { ellipsis: this.allowEllipsis }
    //   ];
    // }
  },

  methods: {
    validate(...args) {
      return this.$refs.input.validate(...args)
    },
  },
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-selectbox
  &.q-field__control
    height: $input-content-height
    &.q-field--labeled
      height: $input-content-height * 2
      padding-bottom: 0px
      .q-field__inner
        justify-content: flex-end
      .q-field__label
        height: $input-content-height
        top: -$input-content-height
        line-height: $input-content-height
        padding-right: 8px
        width: 100%

      .q-field__native
        line-height: 24px
        width: 100%

    //////////////////$MISC$//////////////////
    .q-field__native
      @include text-caption-light

    .q-field__native::placeholder
      @include text-caption-light

    &.q-field--labeled
      .q-field__label
        @include text-caption-regular

    .q-field__control
      border-radius: $input-border-radius
      background: $input-background

    .q-field__control::after
      content: none

    .q-field__control::before
      transition: none
      border: $input-border

    &.q-field--labeled
      &.q-field--float .q-field__label
        transform: none
        transition: none

      &.q-field--error .q-field__label
        animation: none

    .q-field__bottom
      display: none
      &--animated
        transform: none

    &.dw-selectbox.q-field--error
      .q-field__append
        padding-right: 0px
        &:last-child
          padding-right: 8px
        .q-icon.notranslate.text-negative
          display: none

    &.q-field--labeled .q-field__control-container
      padding-top: 6px

    /////////////////$THEMES$/////////////////
    .q-field__control:hover::before
      border-color: $input-border-color

    .q-field__control:before
      border-color: $input-border-color

    &.dw-selectbox.q-field--error
      .q-field__control:hover::before
        border-color: currentColor

      .q-field__control:before
        border-color: currentColor

    &.q-field--labeled
      .q-field__label
        color: var(--q-color-dark)

      .q-field__control
        color: $input-border-color

    .q-field__native::placeholder
      color: $color-zambezi

  .q-chip
    font-size: 20px
</style>
