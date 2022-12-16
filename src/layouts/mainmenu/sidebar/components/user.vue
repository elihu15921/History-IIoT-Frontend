<template>
  <div class="dw-workbench-user">
    <div class="dw-workbench-user-content">
      <span class="dw-workbench-user-avatar">
        <dw-icon name="user" @click="menuDisplay = !menuDisplay"></dw-icon>
      </span>
      <span class="dw-workbench-user-text" @click="menuDisplay = !menuDisplay">{{ user.account }}</span>
      <span class="dw-workbench-user-icon" @click="menuDisplay = !menuDisplay">
        <img src="~assets/icons/png/up_white.png" v-show="!menuDisplay" />
        <img src="~assets/icons/png/down_white.png" v-show="menuDisplay" />
      </span>
    </div>
  </div>
  <div class="dropupContent" v-show="menuDisplay">
    <div v-for="item in bottomMenu" :key="item.name">
      <a class="changeAccount" @click="navClick(item, null)">{{ item.name }}</a>
    </div>
    <a class="logout" @click="logout()">{{ $t('logout') }}</a>
  </div>
</template>

<script>
// import inject from "../../../../foundation/mixins/inject";
import dw_icon from '../../../../components/icon/icon'

export default {
  // mixins: [inject("$dw", "dw-sidebar-user")],
  components: {
    'dw-icon': dw_icon,
  },
  data() {
    return {
      menuDisplay: false,
      user: {
        account: null,
        img: null,
      },
      bottomMenu: [
        {
          name: this.$t('GlobalSettings.settings'),
          path: 'globalSettings',
          hasChild: false,
        },
      ],
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      //this.$router.go('login')
      location.href = '#/login'
    },
    navClick(item, index) {
      console.log(item)
      console.log(index)
      if (index == null) {
        sessionStorage.setItem('displayTabMenu', true)
      }
      this.$emit('menu', item, index) // 自定義事件 傳遞值「子向父組件傳值」
      this.menuDisplay = false
    },
  },
  created() {
    this.user.account = JSON.parse(sessionStorage.getItem('userInfo')).account
  },
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-workbench-user
  &-content, &-content > *
    display: flex
    align-items: center
  &-avatar
    justify-content: center
  &
    flex: 0 0 70px
  &-content, &-content > *
    height: 100%
  &-avatar
    width: 32px
    height: 32px
    margin: 0 8px 0 16px
  &-text
    flex: 1
    padding: 0 8px
  &-icon
    width: 34px
    // border: 1px solid red
    img
      width: 20px
      cursor: pointer
      // border: 1px solid red

//////////////////$MISC$//////////////////
.dw-workbench-user
  &-avatar
    border-radius: 50%
  &-text
    @include text-caption-regular

/////////////////$THEMES$/////////////////
.dw-workbench-user
  &-avatar
    background-color: $color-white
    cursor: pointer
  &-text
    color: $color-white
    cursor: pointer

.dropupContent
  position: fixed
  bottom: 70px
  display: flex
  flex-direction: column
  width: 100%
  padding: 0px 16px
  // border: 1px solid red
  a
    display: flex
    align-items: center
    height: 34px
    padding: 0px 8px
    cursor: pointer
    // &:first-child
    //   border-top-left-radius: 4px
    //   border-top-right-radius: 4px
    // &:last-child
    //   border-bottom-left-radius: 4px
    //   border-bottom-right-radius: 4px
      // box-shadow: 0px 2px 5px black
  .changeAccount
    background-color: white
  .logout
    color: white
    background-color: $color-row-hover
</style>
