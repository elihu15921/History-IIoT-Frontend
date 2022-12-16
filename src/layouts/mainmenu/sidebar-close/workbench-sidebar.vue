<template>
  <div class="dw-workbench-side">
    <div class="dw-workbench-side-inner">
      <div class="dw-workbench-side-content">
        <slot>
          <dw-sidebar-brand></dw-sidebar-brand>
          <dw-sidebar-nav v-on:menu="getTabMenu"></dw-sidebar-nav>
          <dw-sidebar-user v-on:menu="getTabMenu"></dw-sidebar-user>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import DwSidebarBrand from "./components/brand";
import DwSidebarNav from "./components/nav";
import DwSidebarUser from "./components/user";

export default {
  components: {
    "dw-sidebar-brand": DwSidebarBrand,
    "dw-sidebar-nav": DwSidebarNav,
    "dw-sidebar-user": DwSidebarUser,
  },
  data: function () {
    return {
    };
  },
  methods: {
    getTabMenu(e,index) {
      this.$emit("menu", e, index); //自定義事件 傳遞值「子向父組件傳值」
    }
  },
};
</script>

<style lang="sass">
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.dw-workbench-side
  &
    overflow: hidden

  &-content
    display: flex
    flex-direction: column

  &, &-inner, &-content
    height: 100%

  &-inner
    // padding: 0 8px

/////////////////$THEMES$/////////////////
.dw-workbench-side
  background-color: $color-polo-blue
</style>
