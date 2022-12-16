<template>
  <q-scroll-area ref="scrollbar" class="dw-scrollarea">
    <slot> </slot>
  </q-scroll-area>
</template>

<script>
export default {
  name: "dw-scroll-area",

  methods: {
    scrollTop: function () {
      this.scroll(0);
    },

    scroll: function (offset) {
      this.$refs.scrollbar.setScrollPosition(offset);
    },
  },
};
</script>

<style lang="scss">
</style>
