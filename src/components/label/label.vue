<template>
  <span v-on="$attrs" class="dw-label" :class="classes">
    {{ value }}
  </span>
</template>

<script>
export default {
  name: 'dw-label',

  props: {
    /**
     * 標籤內容。
     */
    value: {
      type: String,
    },
    /**
     * 如果標籤位於某元素的左側，則在標籤的右側套用標準邊界。
     */
    left: {
      type: Boolean,
      default: false,
    },
    /**
     * 如果標籤位於某元素的右側，則在標籤的左側套用標準邊界。
     */
    right: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否允許標籤內容超出父元素寬度時，自動將超出部分呈現省略符號。
     */
    allowEllipsis: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    classes: function () {
      return [{ 'on-left': this.left }, { 'on-right': this.right }, { ellipsis: this.allowEllipsis }]
    },
  },
}
</script>

<style lang="scss">
/////////////////$LAYOUT$/////////////////
.dw-label {
  line-height: normal;

  &.on-left {
    margin-right: 8px;
  }
  &.on-right {
    margin-left: 8px;
  }

  &.ellipsis {
    display: inline-block;
    width: 100%;
  }
}
</style>
