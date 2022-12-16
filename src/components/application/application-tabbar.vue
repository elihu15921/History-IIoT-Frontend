<template>
  <div>
    <q-tabs v-model="onTab" align="left" inline-label>
      <q-tab v-for="tab in allTab" :key="tab.name" :label="tab.text" :name="tab.name">
        <q-btn
          round
          dense
          class="z-max q-ml-sm"
          size="xs"
          icon="close"
          @click.native="removeTab(tab.name)"
        />
      </q-tab>
    </q-tabs>

    <q-tab-panels keep-alive v-model="onTab">
      <q-tab-panel v-for="tab in allTab" :key="tab.name" :name="tab.name">
        <component
          :is="tab.componentName"
          :query_data="querydata"
          :sub_data="sub_data"
          :ref="tab.name"
        ></component>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
// import Query from "../../app/query-layout.vue";
// import inject from "../../foundation/mixins/inject";
export default {
  components: {
    // Query
  },
  // mixins: [inject("context", "application-tabbar")],
  name: 'dw-application-tabbar',
  props: {
    tabs: {
      type: Object,
    },
  },
  data: function () {
    return {
      allTab: [],
      moreshow: false,
      selectedTab: '',
      querydata: [],
      removeflag: '',
      removetab: '',
    }
  },
  created: function () {},
  watch: {
    tabs: function () {
      debugger
      this.context
        .ModelQuery('', this.tabs.name)
        .then((result) => {
          this.querydata = result[0]
          this.allTab.push({
            name: this.tabs.name,
            text: this.tabs.text,
            componentName: 'Query',
          })
          this.selectedTab = this.tabs.name
        })
        .catch((error) => {
          console.log({ error })
        })
    },
  },
  computed: {
    onTab: {
      get() {
        console.log('computed getter' + this.selectedTab)
        return this.selectedTab
      },
      set(v) {
        console.log('computed setter' + v)
        if (v != this.removetab) {
          this.selectedTab = v
        }
      },
    },

    classes: function () {
      return [{ 'dw-application-tabbar-more': 1 }]
    },

    currentTab: function () {
      if (this.context.browsing === null) {
        return null
      }
      return this.context.browsing.id
    },
  },
  updated() {
    if (this.removeflag != '') {
      var index = this.removeflag == 0 ? 0 : this.removeflag - 1
      this.selectedTab = this.allTab[index].name
      this.removeflag = ''
    }
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  Destroy() {
    console.log('beforeDestroy')
  },
  methods: {
    change: function (tab) {
      console.log('nextTick')
    },
    removeTab: function (tab) {
      // debugger
      const index = _.findIndex(this.allTab, { name: tab })

      if (index > -1) {
        _.remove(this.allTab, { name: tab })
        this.selectedTab = this.allTab[index == 0 ? 0 : index - 1].name

        this.removeflag = index
        this.removetab = tab
      }
    },

    classes2: function (app) {
      return {
        accent: app.focused,
      }
    },

    onClick: function (app) {
      this.context.emit('click', app)
      this.onBrowse(app)
    },

    onBrowse: function (app) {
      this.context.switch(app)
    },

    onClose: function (app) {
      app.close()
    },

    onInput: function (value) {
      // Do not remove!!!
    },

    reportIdName: function (app) {
      return `(${app.text}`
    },
  },
}
</script>

<style lang="sass">
@import 'src/css/app.sass'
@mixin tab-reactive($pseudo: false)
  $addon: ""
  @if $pseudo
    $addon: "::after"

  &-tab.q-tab--active#{$addon},
  &-tab:hover#{$addon},
  &-more:hover#{$addon},
  &-more-show#{$addon},
  &-tab:focus#{$addon}
    @content

@mixin tab-border-radius
  border-top-left-radius: 8px
  border-top-right-radius: 8px

///////////////$DEFINITION$///////////////
$content-height: 40px
$content-width: 150px
$max-tabs: 5
$more-size: 40px

/////////////////$LAYOUT$/////////////////
.dw-application
  &-tabbar
    height: $content-height
    min-height: $content-height
    padding: 0 $content-height 0 0px
  &-tabs
    flex: 1
    max-width: calc(100% - #{$more-size})
  &-tab
    flex: 1 / $max-tabs
    max-width: 100% / $max-tabs
    min-height: $content-height
    min-width: $content-width
    padding: 0 8px

  &-tab-icon
    display: none
    height: 100%
    padding-left: 8px
    font-size: 12px
  @include tab-reactive
    .dw-application-tab-icon
      display: inline-flex

  &-more
    visibility: hidden
  &-tabbar-more &-more
    visibility: visible

.dw-application-more
  &
    padding: 8px
  &-popup
    overflow: hidden
  &item
    min-height: 34px
    padding: 0 8px

//////////////////$MISC$//////////////////
.dw-application
  &-tab .q-tab__label
    @include text-caption-light

  @include tab-reactive
    @include tab-border-radius

  &-tab,
  &-more
    @include stroke(null, right, -1px)

    &::after
      right: -1px // I don't know why
      height: 30px

  @include tab-reactive(true)
    display: none

.dw-application-more
  &-popup
    border-radius: 8px
  &item-text
    @include text-caption-light

////////////////$OVERRIDE$////////////////
.dw-application
  &-tab .q-tab__content
    width: 100%

  &-tab .q-tab__label
    display: inline-flex
    align-items: center
    overflow: hidden
    flex: 1
    height: 100%


.dw-application-more
  .q-btn__wrapper
    min-width: auto
    min-height: auto
    padding: 0

/////////////////$THEMES$/////////////////
.dw-application
  @include tab-reactive
    color: $color-white
    background-color: $color-polo-blue

  &-tab.accent
    background-color: $color-danube-blue

.dw-application-mor
  &:hover,
  &-show
    img
      filter: invert(100%)
    border-radius: 8px 8px 0px 0px
    background-color: $color-danube-blue
  &item:hover,
  &item:focus
    color: $color-white
    background-color: $color-polo-blue
</style>
