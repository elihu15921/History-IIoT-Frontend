<template>
  <div class="dw-workbench-navbar">
    <dw-scroll-area class="dw-workbench-navbar-inner">
      <q-list class="dw-workbench-navbar-content">
        <q-expansion-item
          v-for="item in menu"
          class="dw-workbench-navitem"
          active-class="dw-workbench-navitem-selected"
          :key="item.name"
        >
          <template #header>
            <q-item-section avatar class="dw-workbench-navitem-icon">
              <!-- <dw-icon :name="item.name"></dw-icon> -->
              <q-img :src="item.icon" />
              <!-- <img :src="item.icon"> -->
            </q-item-section>

            <q-item-section class="dw-workbench-navitem-text">
              <dw-label :value="item.name"></dw-label>
            </q-item-section>
          </template>

          <template v-if="!item.hasChild">
            <q-item v-for="i in item.child" :key="i.name" clickable @click="onClick(i)">
              <!-- <q-item-section avatar class="dw-workbench-navitem-childicon">
                <dw-icon :name="i.icon"></dw-icon>
              </q-item-section> -->

              <q-item-section class="dw-workbench-navitem-text" style="margin-left: 10px">
                <dw-label :value="i.name"></dw-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-if="item.hasChild">
            <q-expansion-item
              v-for="(i, index) in item.child"
              active-class="dw-workbench-navitem-selected"
              :key="i.name"
              style="margin-left: 16px"
            >
              <!-- father -->
              <template #header>
                <!-- <q-item-section avatar class="dw-workbench-navitem-icon">
                  <q-img src="~assets/icons/svg/brand.svg" />
                </q-item-section> -->

                <template v-if="i.hasChild">
                  <q-item-section
                    class="dw-workbench-navitem-text level2"
                    @click="navClick(item, index)"
                  >
                    <dw-label :value="i.name"></dw-label>
                  </q-item-section>
                </template>

                <template v-if="!i.hasChild">
                  <q-item-section class="dw-workbench-navitem-text level2" @click="onClick(i)">
                    <dw-label :value="i.name"></dw-label>
                  </q-item-section>
                </template>
              </template>

              <!-- son 第三層 -->
              <!-- <q-item
                v-for="j in i.child"
                :key="j.name"
                clickable
                @click="onClick(j)"
              >
                <q-item-section class="dw-workbench-navitem-text" style="margin-left: 40px;">
                  <dw-label :value="j.name"></dw-label>
                </q-item-section>
              </q-item> -->
            </q-expansion-item>
          </template>
        </q-expansion-item>
      </q-list>
      <!-- <q-list style="bottom: 0;">
        <div v-for="item in bottomMenu" :key="item.name">
          <div class="item" @click="navClick(item, null)">
            <div class="icon">
              <q-img src="~assets/icons/png/icon_setting_4@2x.png" />
            </div>
            <div class="content">
              {{ item.name }}
            </div>
          </div>
        </div>
      </q-list> -->
    </dw-scroll-area>
  </div>
</template>

<script>
// import inject from "../../../../foundation/mixins/inject";
// import { workbench } from "../../../../foundation/workbench";
import dw_scroll_area from '../../../../components/scroll-area/scroll-area'
import dw_icon from '../../../../components/icon/icon'
import dw_label from '../../../../components/label/label'

export default {
  // mixins: [inject("$dw", "dw-sidebar-nav")],
  components: {
    'dw-scroll-area': dw_scroll_area,
    'dw-icon': dw_icon,
    'dw-label': dw_label,
  },
  data: function () {
    return {
      menu: [
        {
          name: this.$t('Ops'),
          icon: 'icons/png/ops.png',
          hasChild: true,
          child: [
            {
              name: this.$t('TransactionInquiry'),
              hasChild: true,
              child: [
                {
                  name: this.$t('TransactionInquiry'),
                  path: 'transactionInquiry',
                  hasChild: false,
                },
              ],
            },
          ],
        },
        {
          name: this.$t('EquipmentMonitoring'),
          icon: 'icons/png/equipmentMonitoring.png',
          hasChild: true,
          child: [
            {
              name: this.$t('EquipmentMonitoringRealTime'),
              hasChild: true,
              child: [
                {
                  name: this.$t('EquipmentMonitoringRealTime'),
                  path: 'equipmentMonitoringRealTime',
                  hasChild: false,
                },
              ],
            },
          ],
        },
        {
          name: this.$t('ConfigModule'),
          icon: 'icons/png/configModule.png',
          hasChild: true,
          child: [
            {
              name: this.$t('ApplicationConfig'),
              hasChild: true,
              child: [
                {
                  name: this.$t('FactorySetting2'),
                  path: 'factorySetting',
                  hasChild: false,
                },
                {
                  name: this.$t('EqptGroup'),
                  path: 'eqptGroup',
                  hasChild: false,
                },
                {
                  name: this.$t('EqptSession'),
                  path: 'eqptSession',
                  hasChild: false,
                },
              ],
            },
            {
              name: this.$t('EqptNetConfig'),
              hasChild: true,
              child: [
                {
                  name: this.$t('EqptBasicInfoSetting'),
                  path: 'equipmentBasicInfoSetting',
                  hasChild: false,
                },
                // {
                //   name: this.$t("FixedParm"),
                //   path: "fixedParmSetting",
                //   hasChild: false,
                // },
                {
                  name: this.$t('WorkshopData'),
                  path: 'workshopData',
                  hasChild: false,
                },
                // {
                //   name: this.$t("ContentRouting"),
                //   path: "eqptContentRouterSetting",
                //   hasChild: false,
                // },
              ],
            },
            {
              name: this.$t('TaskManagement'),
              hasChild: true,
              child: [
                {
                  name: this.$t('TaskCenter'),
                  path: 'taskCenterSetting',
                  hasChild: false,
                },
              ],
            },
            {
              name: this.$t('DataCollector'),
              hasChild: true,
              child: [
                {
                  name: this.$t('DataCollector'),
                  path: 'dataCollectorSetting',
                  hasChild: false,
                },
              ],
            },
          ],
        },
        {
          name: this.$t('PersonnelManagement'),
          icon: 'icons/png/people_wihte.png',
          hasChild: true,
          child: [
            {
              name: this.$t('AccountPermissions'),
              hasChild: true,
              child: [
                {
                  name: this.$t('AccountPermissions'),
                  path: 'authority',
                  hasChild: false,
                },
              ],
            },
          ],
        },
      ],
      bottomMenu: [
        {
          name: this.$t('GlobalSettings.settings'),
          path: 'globalSettings',
          hasChild: false,
        },
      ],
    }
  },
  computed: {
    // menu: function () {
    //   debugger;
    //   // return this.$dw.application.menu;
    //   console.log(this.menu);
    //   return this.menu;
    // },
    // browsing: function () {
    //   const { browsing } = this.$dw.application.menuContext;
    //   return browsing !== null ? browsing.name : null;
    // },
  },
  methods: {
    onClick(item) {
      debugger
      // workbench.emit("onTabs", item);
      console.log(item)
      this.$emit('titleChanged', '子向父組件傳值') //自定義事件 傳遞值「子向父組件傳值」
      //this.$router.go('mainmenu/' + item.path)
      location.href = '#/mainmenu/' + item.path
    },
    navClick(item, index) {
      if (index == null) {
        sessionStorage.setItem('displayTabMenu', true)
      }
      this.$emit('menu', item, index) // 自定義事件 傳遞值「子向父組件傳值」
    },
  },
  beforeCreate: function () {},
  created: function () {},
}
</script>

<style lang="sass">
@import 'src/css/app.sass'

.item
  display: flex
  flex-direction: row
  align-items: center
  padding: 21px 0 0 16px
  cursor: pointer
  &:hover
    // background: red
  .icon
    width: 24px
    margin: 0 8px 0 0
  .content
    color: white
/////////////////$LAYOUT$/////////////////
.dw-workbench-navbar
  &
    overflow: hidden
  &-content
    display: flex
    flex-direction: column
  &
    flex: 1
    margin-top: 16px
  &-inner,
  &-content
    height: 100%
    .q-icon
      font-size: 16px
      color: white

.dw-workbench-navitem
  &
    min-height: 34px
    padding: 0
  & + &
    // margin-top: 16px
  &-text
    padding: 0 0px
  &-icon
    min-width: 24px
    padding: 0 0 0 0px
    margin: 0 8px 0 0
  &-childicon
    min-width: 24px
    padding: 0 0 0 8px

.level2
  padding: 0 0 0 16px
  // background-color: red

//////////////////$MISC$//////////////////
.dw-workbench-navitem
  &-text
    @include text-caption-regular
  &:hover,
  &:focus,
  &-selected
    // border-radius: 8px

/////////////////$THEMES$/////////////////
.dw-workbench-navitem
  &-text
    color: $color-white

  &:hover,
  &:focus,
  &-selected
    background-color: rgba(255, 255, 255, 0.2)

.q-expansion-item__content
  .q-expansion-item__toggle-icon
    display: none

.q-scrollarea__content
  display: flex
  flex-direction: column
  justify-content: space-between
</style>
