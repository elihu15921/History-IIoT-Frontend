<template>
  <div>
    <div class="main">
      <div class="head">
        <div class="title">
          <div class="logo">
            <!-- <img :src="context.logoSrc" /> -->
            <img src="~assets/icons/digiwin_logo_40x40.jpg" />
          </div>
          <div class="welcome-message">
            <div class="welcome-text font-head-title-ch">
              {{ $t('LoginPage.welcome') }}
            </div>
            <div class="saps-text font-head-title-en">IIoT</div>
          </div>
        </div>
        <login-form />
      </div>
      <div class="footer">
        <div class="info">
          <div class="each-line font-footer-info">V1.0.0</div>
          <div class="each-line font-footer-info">{{ $t('LoginPage.copyright') }}</div>
          <div class="each-line font-footer-info">{{ $t('LoginPage.copyright2') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginForm from './login_form'
// import inject from '../../foundation/mixins/inject';

export default {
  components: { 'login-form': loginForm },
  // mixins: [
  //   inject('context', 'login_information')
  // ],

  computed: {},

  created: function () {},

  methods: {
    SwitchLang(item) {
      // this.context.language = item.lang;
    },
    Selected(item) {
      // return this.context.language == item.lang;
    },
  },
}
</script>

<style lang="sass" scoped>
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.main
  width: 340px
  height: 100%
  flex-shrink: 0
  display: flex
  flex-direction: column
  justify-content: space-between
.head
  width: 100%
  // border: 1px solid red
  & .title
    margin: 24px
    // border: 1px solid red
    & .logo
      height: 130px
      position: relative
      & img
        position: absolute
        right: 0px
        top: 0px
    & .welcome-message
      height: 54px
      display: flex
      align-items: center
      & .welcome-text
        margin-right: 16px
  & .login-form
    transform: translateY(50px)
    height: 154px
    background: gray

.footer
  margin: 24px
  // border: 1px solid red
  & .language-select
    height: 32px
    margin-bottom: 8px
    display: flex
    & .each-language
      margin-right: 16px
      &:last-child
        margin-right: 0px

  & .info .each-line
    height: 16px
    width: 100%
// //////////////////$MISC$//////////////////
// .misc-footer-button {
//   cursor: pointer;
//   padding: 0px;
// }
// /////////////////$THEMES$/////////////////
.font
  &-head
    &-title
      color: $color-black
      &-ch
        @extend .font-head-title
        @include text-headline-bold
      &-en
        @extend .font-head-title
        @include text-headline-black
        &:first-letter
          color: $color-casablanca

  &-footer
    &-button
      @include text-content-regular
      color: $color-zambezi
      &:hover,
      &-selected
        @include text-content-medium
        color: rgb(233, 158, 188)

        background: $color-white
        border: none
      &:focus
        outline: none

    &-info
      @include text-headline-light
      font-size: 10px
      color: rgb(147, 150, 154)
</style>
