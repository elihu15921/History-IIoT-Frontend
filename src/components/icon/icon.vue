<template>
  <div v-if="valid" v-on="$attrs" class="dw-icon" :class="classes">
    <q-icon :name="icon"></q-icon>

    <q-tooltip
      v-if="hoverText"
      content-class="dw-tooltip"
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 4]"
    >
      {{ hoverText }}
    </q-tooltip>
  </div>
</template>

<script>
export default {
  name: 'dw-icon',

  props: {
    /**
     * 圖標名稱。
     *
     * 當未設置 assert 屬性時，則必須提供一個有效的圖標名稱。
     */
    name: {
      type: String,
      default: null,
    },
    /**
     * 如果圖標位於某元素的左側，則在圖標的右側套用標準邊界。
     */
    left: {
      type: Boolean,
      default: false,
    },
    /**
     * 如果圖標位於某元素的右側，則在圖標的左側套用標準邊界。
     */
    right: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否將滑鼠游標的形狀呈現為可點擊。
     */
    allowClick: {
      type: Boolean,
      default: false,
    },
    /**
     * 測試斷言結果為非，採用 assertFailIcon 輸出圖標；若為是，採用 assertPassIcon 輸出圖標。
     *
     * 當同時設置此屬性與 name 屬性時，將優先採用此屬性。
     */
    assert: {
      type: Boolean,
      default: null,
    },
    /**
     * 測試斷言結果為是時所使用的圖標名稱。
     */
    assertPassIcon: {
      type: String,
      default: null,
    },
    /**
     * 測試斷言結果為非時所使用的圖標名稱。
     */
    assertFailIcon: {
      type: String,
      default: null,
    },
    /**
     * 滑鼠游標懸停在圖標元素上時，將顯示工具提示。
     */
    hoverText: {
      type: String,
      default: null,
    },
  },

  computed: {
    classes: function () {
      return [
        this.icon !== null ? `dw-icon-${this.icon}` : null,
        {
          'on-left': this.left,
          'on-right': this.right,
          'cursor-pointer': this.allowClick,
        },
      ]
    },

    valid: function () {
      if (this.name === null && this.assert === null) {
        return false
      }

      if (this.assert !== null) {
        return !(this.assertPassIcon === null || this.assertFailIcon === null)
      }

      return true
    },

    icon: function () {
      if (this.assert === null) return this.name

      return this.assert ? this.assertPassIcon : this.assertFailIcon
    },
  },
}
</script>

<style lang="sass">
///////////////$DEFINITION$///////////////
$icon-size: 24px

/////////////////$LAYOUT$/////////////////
.dw-icon
  display: inline-flex
  align-items: center
  &.on-left
    margin-right: 8px
  &.on-right
    margin-left: 8px

//////////////////$MISC$//////////////////
.dw-icon
  font-size: $icon-size

////////////////$OVERRIDE$////////////////
.dw-button.q-btn .q-icon
  font-size: $icon-size
</style>
