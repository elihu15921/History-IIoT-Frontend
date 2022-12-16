<template>
  <q-input
    class="dw-textbox dw-textbox-show-error"
    ref="input"
    :value="value"
    @input="$emit('input', $event)"
    :type="type"
    :label="label"
    :rules="validationRules"
    reactive-rules
  ></q-input>
</template>

<script>
export default {
  name: 'dw-input',

  props: {
    /**
     * Input內容。
     */
    value: {
      type: String,
    },
    /**
     * 資料形式。
     */
    type: {
      type: String,
      required: true,
    },
    /**
     * 標籤。
     */
    label: String,
    /**
     * 是否驗證。
     */
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    validationRules() {
      const rules = []
      const msg = this.$t('pleaseEnter') + this.label + '!'

      if (this.required) {
        rules.push((val) => !!val || msg)
      }
      return rules
    },
    classes: function () {
      // return [
      //   { "on-left": this.left },
      //   { "on-right": this.right },
      //   { ellipsis: this.allowEllipsis }
      // ];
    },
  },

  methods: {
    validate(...args) {
      return this.$refs.input.validate(...args)
    },
  },
}
</script>

<style lang="sass">
/////////////////$LAYOUT$/////////////////
.q-field__append.q-field__marginal.row.no-wrap.items-center.q-anchor--skip
  display: none
</style>
