<template>
  <q-layout class="dw-workbench" view="lHh Lpr lFf" :class="classes">
    <!-- <dw-layout-header> -->
    <!-- <slot name="header"></slot> -->
    <!-- </dw-layout-header> -->

    <q-drawer
      v-model="drawer"
      show-if-above
      side="left"
      :width="240"
      :mini-width="56"
      :breakpoint="500"
      :mini="!drawer || miniState"
      @click.capture="onDrawerClick"
      bordered
    >
      <dw-layout-sidebar v-on:menu="getTabMenu" @titleChanged="testC" v-if="!miniState">
        <slot name="sidebar"></slot>
      </dw-layout-sidebar>

      <dw-layout-sidebar-close v-if="miniState">
        <slot name="sidebar"></slot>
      </dw-layout-sidebar-close>
    </q-drawer>

    <dw-layout-content>
      <q-toolbar class="topToolbar">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="miniState = !miniState" />
        <span class="topTitle">{{ topTitle }}</span>
        <q-space />
      </q-toolbar>

      <div v-if="displayTabMenu">
        <router-view />
      </div>

      <q-card v-if="!displayTabMenu">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="item in tabMenu"
            :key="item"
            :name="item.name"
            :label="item.name"
            @click="changePage(item)"
          >
            <!--可以編輯tab title的內容-->
          </q-tab>
        </q-tabs>
        <q-tab-panels v-for="item in tabMenu" :key="item" v-model="tab" animated>
          <q-tab-panel :name="item.name">
            <router-view />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!-- <slot name="content"></slot> -->
      <!--原本是用這個連接到 workbench-content.vue-->
    </dw-layout-content>
  </q-layout>
</template>

<script>
// import { workbench } from '../../foundation/workbench';

import { ref } from 'vue'
// import DwLayoutHeader from './header';
import DwLayoutSidebar from './sidebar'
import DwLayoutSidebarClose from './sidebar-close'
import DwLayoutContent from './content'

export default {
  components: {
    // 'dw-layout-header': DwLayoutHeader,
    'dw-layout-sidebar': DwLayoutSidebar,
    'dw-layout-sidebar-close': DwLayoutSidebarClose,
    'dw-layout-content': DwLayoutContent,
  },
  //   static: function() {
  //   return {
  //     datacontext: []
  //   };
  // },
  beforeCreate: function () {
    // const p = this;
    // this.datacontext = new SYSContext({ p });
    // debugger
  },

  provide: function () {
    return {
      // $dw: workbench,
    }
  },

  props: {
    /**
     * 次要樣式類。
     */
    // sclass: {
    //   type: String,
    //   default: 'tabbed'
    // }
  },

  data: function () {
    return {
      drawer: false,
      miniState: false,
      list: [
        { title: 'mails', label: 'Mails', path: 'factorySetting' },
        { title: 'alarms', label: 'Alarms', path: 'eqptGroup' },
        { title: 'movies', label: 'Movies', path: 'equipmentCategorySetting' },
      ],
      displayTabMenu: false,
      tab: null,
      tabMenu: {
        name: null,
      },
      topTitle: null,
      currentTab: null,
    }
  },

  computed: {
    classes: function () {
      debugger
      // return [
      //   { 'dw-workbench-mini': this.miniState },
      //   this.sclass ? `dw-workbench-${this.sclass}` : '',
      //   this.addonCss
      // ];
    },

    addonCss: function () {
      // return workbench.layout.addonCss;
    },
  },

  methods: {
    onDrawerClick: function (event) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        event.stopPropagation()
      }
    },
    changePage(item) {
      //this.$router.go('mainmenu/' + item.path)
      location.href = '#/mainmenu/' + item.path
      this.currentTab = item
      let pageInfo = {
        topTitle: this.topTitle,
        tabMenu: this.tabMenu,
        currentTab: this.currentTab,
      }
      sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))
    },
    testC(e) {
      console.log(1111111111);
      console.log(e)
    },
    getTabMenu(e, index) {
      console.log(e)
      console.log(index);
      // console.log(e.child[index].child[0].path);
      // console.log(e.name + e.child[index]);
      let url = ''
      if (index != null && index !=3) { // 不需要tab的頁面，null:首頁、3: 數據採集器
        this.displayTabMenu = false
        this.tab = e.child[index].child[0].name
        this.topTitle = e.name + ' | ' + e.child[index].name
        this.tabMenu = e.child[index].child
        this.currentTab = e.child[index].child[0]
        //url = 'mainmenu/' + this.currentTab.path
        url = '#/mainmenu/' + this.currentTab.path
      } else {
        this.displayTabMenu = true
        this.topTitle = e.name

        if (index == 3) {
          this.topTitle = e.name + ' | ' + e.child[index].name
          this.currentTab = e.child[index].child[0]
          url = '#/mainmenu/' + this.currentTab.path
        } else if (e.path == 'transactionRecord') {
          //url = 'mainmenu/transactionRecord'
          url = '#/mainmenu/transactionRecord'
          this.currentTab = {
            hasChild: false,
            path: 'transactionRecord',
          }
        } else if (e.path == 'globalSettings') {
          //url = 'mainmenu/globalSettings'
          url = '#/mainmenu/globalSettings'
        }
      }

      let pageInfo = {
        topTitle: this.topTitle,
        tabMenu: this.tabMenu,
        currentTab: this.currentTab,
      }
      sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))
      sessionStorage.setItem('displayTabMenu', this.displayTabMenu)
      // this.$router.go(url)
      location.href = url
    },
  },
  beforeCreate() {
    // workbench.welcome(this);
    this.displayTabMenu = sessionStorage.getItem('displayTabMenu')
  },
  created() {
    let displayTabMenu = sessionStorage.getItem('displayTabMenu')
    let pageInfo = JSON.parse(sessionStorage.getItem('pageInfo'))
    if (displayTabMenu != undefined && displayTabMenu != null) {
      if (displayTabMenu == 'true') {
        this.topTitle = pageInfo.topTitle
        this.displayTabMenu = true
      } else if (displayTabMenu == 'false') {
        if (pageInfo != undefined && pageInfo != null) {
          this.tab = pageInfo.currentTab.name
          this.topTitle = pageInfo.topTitle
          this.tabMenu = pageInfo.tabMenu
          this.displayTabMenu = false
        }
      }
    }
  },
  beforeUpdate() {
    console.log(1111111111)
    this.displayTabMenu = sessionStorage.getItem('displayTabMenu')
    console.log(this.displayTabMenu)
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss"></style>
