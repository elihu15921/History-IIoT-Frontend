<template>
  <div class="main">
    <div class="image_container">
      <!-- <q-img :src="datacontext.imgSrc" spinner-color="white" class="img" /> -->
      <!-- <q-img
        src="~assets/images/login-background.jpeg"
        spinner-color="white"
        class="img"
      /> -->
    </div>
    <q-tab-panel class="loginForm" name="mails">
      <login-information />
    </q-tab-panel>
    <!-- <q-tab-panels v-model="activePanel" animated>
      <q-tab-panel name="login-information">
        <login-information />
      </q-tab-panel>
    </q-tab-panels> -->
  </div>
</template>

<script>
// import SYSContext from "./js/context";
import LoginInformation from "../components/login/login_information";
//import SettingInformation from "../components/login/setting_information";

export default {
  name: "Login",
  components: {
    "login-information": LoginInformation
    //"setting-information": SettingInformation
  },
  data: function () {
    return {
      // context: this.datacontext
    };
  },
  static: function () {
    return {
      datacontext: null,
    };
  },
  beforeCreate: function () {
    // const p = this;
    // this.datacontext = new SYSContext({ p });
    // this.datacontext = new SYSContext();
  },
  created: function () {
    // alert(SYSContext)//可以彈出來“李四”
  },
  provide: function () {
    return {
      // context: this.datacontext
    };
  },
};
</script>

<style lang="sass" scoped>
/////////////////$LAYOUT$/////////////////
.main
  display: flex
  flex-direction: row
  height: 100vh
  // background: yellow
  background: url("~assets/images/login-background.jpeg")
  background-size: 100% 100%
  .loginForm
    background-color: white

.image_container
  width: 100%
  > .img
    width: 100%
    height: 100%
//////////////////$MISC$//////////////////
/////////////////$THEMES$/////////////////
/////////////////$OVERRIDE$///////////////
.q-tab-panels
  flex-shrink: 0
.q-tab-panel
  padding: 0px
  & > *
    height: 100%
</style>
