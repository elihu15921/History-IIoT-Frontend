<template>
  <div class="dw-workbench-brand">
    <div class="dw-workbench-brand-content" @click="goHomepage()">
      <span class="dw-workbench-brand-icon">
        <!-- <dw-icon name="brand"></dw-icon> -->
        <q-img src="~assets/icons/png/brand.png" />
        <!--第兩種寫法: 此路徑預設為 /public-->
        <!-- <q-img src="icons/svg/brand.svg" /> -->
      </span>
      <!-- <span class="dw-workbench-brand-text"> sMMP </span> -->
    </div>
  </div>
</template>

<script>
// import inject from '../../../../foundation/mixins/inject';
import dw_icon from '../../../../components/icon/icon'

export default {
  mixins: [
    // inject('$dw', 'dw-sidebar-brand')
  ],
  components: { 'dw-icon': dw_icon },
  methods: {
    goHomepage() {
      let pageInfo = {
        topTitle: this.$t('TransactionRecord.Home'),
        tabMenu: null,
        currentTab: null,
      }
      sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))
      sessionStorage.setItem('displayTabMenu', true)
      //this.$router.go('mainmenu/transactionRecord')
      location.href = '#/mainmenu/transactionRecord'
      location.reload()
    },
  },
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-workbench-brand
  &-content
    display: flex
    align-items: center
  &
    flex: 0 0 48px
    margin-top: 16px
  &-content
    height: 100%
  &-icon
    width: 24px
    // padding-left: 8px
    margin-left: 16px
    line-height: 0
  &-text
    flex: 1
    padding: 0 8px

/////////////////$MISC$/////////////////
.dw-workbench-brand-text
  &
    cursor: default
    user-select: none
    // text-transform: uppercase
  &
    @include text-headline-black
  &::first-letter
    // text-transform: uppercase

/////////////////$THEMES$/////////////////
.dw-workbench-brand-text
  &
    color: $color-white
  &::first-letter
    color: $color-casablanca !important
</style>
