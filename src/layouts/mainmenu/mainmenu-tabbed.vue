<template>
  <div>
    <dw-mainmenu-layout sclass="tabbed">
      <!-- <template v-slot:content> -->
        <!-- <dw-application-tabbar :tabs="picktab"> </dw-application-tabbar> -->
      <!-- </template> -->
      
      <!-- <dw-application-set :context="context">
    </dw-application-set> -->
    </dw-mainmenu-layout>
  </div>
</template>

<script>
import DwMainmenuLayout from "./mainmenu-layout";
import DwApplicationTabbar from "../../components/application/application-tabbar";
// import { workbench } from "../../foundation/workbench";
// import SYSContext from "../js/context";

export default {
  components: {
    "dw-mainmenu-layout": DwMainmenuLayout,
    "dw-application-tabbar": DwApplicationTabbar
  },
  static: function () {
    return {
      // datacontext: null,
    };
  },
  beforeCreate: function () {
    // const p = this;
    // this.datacontext = new SYSContext({ p });
  },
  provide: function () {
    return {
      // context: this.datacontext,
    };
  },
  mounted() {},
  data() {
    return {
      picktab: [],
    };
  },
  created() {
    debugger;
    // workbench.on("onTabs", (msg) => {
    //   this.picktab = msg;
    //   // this.picktab.push({
    //   //     name:msg.text,
    //   //     componentName:"Icons"
    //   // })
    // });
  },
  computed: {
    context: function () {
      return {};
    },
  },
};
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-workbench-tabbed
  .dw-workbench-body-inner
    padding-top: 0

//////////////////$MISC$//////////////////
.dw-workbench-tabbed
  .dw-workbench-head
    border-top-left-radius: 16px

  .dw-workbench-body-inner
    border-bottom-left-radius: 16px

/////////////////$THEMES$/////////////////
.dw-workbench-tabbed
  .dw-workbench-head,
  .dw-workbench-body-inner
    background-color: $color-white
</style>
