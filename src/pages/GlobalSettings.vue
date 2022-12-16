<template>
  <div class="container">
    <q-form class="dw-form" ref="editGlobalSettings">
      <q-card-section class="dialog-content">
        <div class="box">
          <span class="title">{{ $t('GlobalSettings.SiteAddress') }}</span>
          <dw-input
            v-model="receiveData.smes.formalAreaURL"
            :label="translated.smesFormalArea"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.smes.testAreaURL"
            :label="translated.smesTestArea"
            type="string"
            required
          />
        </div>

          <!--啟用中-->
          <!-- <div v-if="receiveData.poller.equipmentStatus.enable">
            <dw-input
              v-model="receiveData.poller.equipmentStatus.frequency"
              :label="translated.equipmentStatus"
              type="string"
              required
            />
          </div> -->

          <!--停用中-->
          <!-- <div class="disableStatus" v-if="!receiveData.poller.equipmentStatus.enable">
            <dw-input
              v-model="receiveData.poller.equipmentStatus.frequency"
              :label="translated.equipmentStatus"
              type="string"
              readonly
              required
            />
          </div> -->
        <!-- </div> -->

        <div class="box">
          <span class="title">{{ $t('GlobalSettings.EquiptOutputUploadRegularly') }}</span>
          <dw-input
            v-model="receiveData.poller.pushTask.frequency"
            :label="translated.pushTask"
            type="string"
            required
          />

          <!-- <div
            v-bind:class="{
              switchOn: receiveData.poller.productionQuantity.enable,
            }"
            style="padding: 16px 0; display: flex; flex-direction: row"
          >
            <span style="margin: 0 16px 0 0">{{ $t('GlobalSettings.EnableTimedPolling') }} :</span>
            <div
              class="slideToggle"
              @click="
                receiveData.poller.productionQuantity.enable =
                  !receiveData.poller.productionQuantity.enable
              "
            >
              <div class="switchBtn"></div>
            </div>
          </div>          -->

          <!--啟用中-->
          <!-- <div v-if="receiveData.poller.productionQuantity.enable">
            <dw-input
              v-model="receiveData.poller.productionQuantity.frequency"
              :label="translated.productionQuantity"
              type="string"
              required
            />
          </div> -->

          <!--停用中-->
          <!-- <div class="disableStatus" v-if="!receiveData.poller.productionQuantity.enable">
            <dw-input
              v-model="receiveData.poller.productionQuantity.frequency"
              :label="translated.productionQuantity"
              type="string"
              readonly
              required
            />
          </div> -->
        </div>

        <div class="box">
          <span class="title">{{ $t('GlobalSettings.database.setting') }}</span>
          <dw-input
            v-model="receiveData.database.ip"
            :label="translated.database.ip"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.database.postgresPort"
            :label="translated.database.postgresPort"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.database.influxdbPort"
            :label="translated.database.influxdbPort"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.database.database"
            :label="translated.database.database"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.database.username"
            :label="translated.database.username"
            type="string"
            required
          />
          <dw-input
            v-model="receiveData.database.password"
            :label="translated.database.password"
            type="string"
            required
          />
          <!-- <dw-input
            v-model="receiveData.database.password"
            :label="translated.database.password"
            type="password"
            required
          /> -->
        </div>

        <!-- <div class="box">
          <span class="title">{{
            $t("GlobalSettings.MachineConnectedApplicationValueAddedSolution")
          }}</span>

          <div style="display: flex; flex-direction: row">
            <span
              >{{ $t("TransactionInquiryPage.TaskType") }} :</span
            >
            <div class="dropdownMenu" style="width: 178px">
              <div
                class="input"
                @click="
                  valueAddedSolution.dispEquiptIntegrationServiceType =
                    !valueAddedSolution.dispEquiptIntegrationServiceType
                "
              >
                <input
                  type="text"
                  v-model="valueAddedSolution.equiptInteSerTypeInput"
                  readonly
                />
                <img
                  class="arrowIcon"
                  src="~assets/icons/svg/up.svg"
                  v-show="
                    valueAddedSolution.dispEquiptIntegrationServiceType == true
                  "
                />
                <img
                  class="arrowIcon"
                  src="~assets/icons/svg/down.svg"
                  v-show="
                    valueAddedSolution.dispEquiptIntegrationServiceType == false
                  "
                />
              </div>
              <ul
                class="selectMenu"
                v-if="valueAddedSolution.dispEquiptIntegrationServiceType"
                @mouseleave="
                  valueAddedSolution.dispEquiptIntegrationServiceType = false
                "
              >
                <li
                  v-for="(
                    item, key
                  ) in valueAddedSolution.equiptIntegrationServiceTypeList"
                  :key="key"
                  @click="changeEquiptIntegrationServiceType(item)"
                >
                  <div class="bg">
                    <a>{{ item.typeName }}</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <dw-input
            v-model="valueAddedSolution.serviceStationAddress"
            :label="translated.EquiptIntegrationServiceStationAddress"
            type="string"
            required
          />
        </div> -->

        <div class="box">
          <span class="title">{{ $t('GlobalSettings.PCBA.pcbaSetting') }}</span>
          <dw-input
            v-model="receiveData.pcba.url"
            :label="translated.pcbaURL"
            type="string"
            required
          />
        </div>
      </q-card-section>
    </q-form>
  </div>
  <div class="bottom">
    <q-card-actions align="right">
      <!-- <dw-button
        class="button-theme text-white button-theme-application"
        :label="translated.btn.application"
        @click="API_PUT_Reboot()"
      /> -->
      <dw-button
        class="button-theme text-white button-theme-del"
        :label="translated.btn.cancel"
        @click="API_GET_GlobalParam()"
      />
      <dw-button
        class="button-theme text-white button-theme-add"
        :label="translated.btn.save"
        @click="API_PUT_GlobalParam(receiveData)"
      />
    </q-card-actions>
  </div>
</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../components/input/input'
import dw_button from '../components/button/button'
import ag_grid_table from '../components/table/table'
import { api } from 'boot/axios'
import { API_GET_GlobalParam } from '../api/GlobalParam/API_GET_GlobalParam'
import { API_PUT_GlobalParam } from '../api/GlobalParam/API_PUT_GlobalParam'
import { API_PUT_Reboot } from '../api/GlobalParam/API_PUT_Reboot'
import { errorDetailMsg } from '../components/toolBox.js'

export default {
  components: {
    AgGridVue,
    'dw-input': dw_input,
    'dw-button': dw_button,
    'ag-grid-table': ag_grid_table,
  },
  data: function () {
    return {
      receiveData: {
        smes: {
          formalAreaURL: null,
          testAreaURL: null,
          timeout: {
            hours: null,
            minutes: null,
            seconds: null
          }
        },
        poller: {
          pushTask: {
            frequency: null
          }
        },
        pcba: {
          url: ''
        },
        database: {
          ip: null,
          postgresPort: null,
          influxdbPort: null,
          database: null,
          username: null,
          password: null
        },
      },
      valueAddedSolution: {
        dispEquiptIntegrationServiceType: false,
        equiptInteSerTypeInput: null,
        serviceStationAddress: null,
        equiptIntegrationServiceTypeList: {
          typeNo: null,
          typeName: null
        }
      },
      translated: {
        limitedFreq: this.$t('GlobalSettings.limitedFreq'),
        smesFormalArea: this.$t('GlobalSettings.smesFormalArea'),
        smesTestArea: this.$t('GlobalSettings.smesTestArea'),
        pushTask: this.$t('GlobalSettings.pushTask.uploadFreq'),
        EquiptIntegrationServiceType: this.$t('GlobalSettings.EquiptIntegrationServiceType'),
        EquiptIntegrationServiceStationAddress: this.$t(
          'GlobalSettings.EquiptIntegrationServiceStationAddress'
        ),
        pcbaURL: this.$t('GlobalSettings.PCBA.URL'),
        // influxDB: {
        //   endpointURL: this.$t('GlobalSettings.InfluxDB.endpointURL'),
        //   organization: this.$t('GlobalSettings.InfluxDB.organization'),
        //   bucket: this.$t('GlobalSettings.InfluxDB.bucket'),
        //   token: 'token',
        // },
        database: {
          ip: 'IP',
          postgresPort: 'PostgreSQL Port',
          influxdbPort: 'InfluxDB Port',
          database: this.$t('GlobalSettings.database.database'),
          username: this.$t('GlobalSettings.database.username'),
          password: this.$t('GlobalSettings.database.password'),
        },
        btn: {
          add: this.$t('IIOT008.btn.add'),
          edit: this.$t('IIOT008.btn.edit'),
          del: this.$t('IIOT008.btn.del'),
          confirm: this.$t('IIOT008.btn.confirm'),
          cancel: this.$t('IIOT008.btn.cancel'),
          save: this.$t('IIOT008.btn.save'),
          selectEqpt: this.$t('IIOT008.Select') + this.$t('IIOT008.Equipment'),
          next: this.$t('IIOT008.btn.next'),
          previous: this.$t('IIOT008.btn.previous'),
          application: this.$t('IIOT008.btn.application'),
        },
      },
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    changeEquiptIntegrationServiceType(item) {},
    API_GET_GlobalParam() {
      let _this = this
      API_GET_GlobalParam()
        .then((res) => {
          console.log(res.data);
          this.receiveData = res.data
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_GlobalParam 失敗!')
        })
    },
    API_PUT_GlobalParam(data) {
      console.log(data);
      let _this = this
      this.$refs.editGlobalSettings.validate().then((success) => {
        if (success) {
          this.submitting = true
          API_PUT_GlobalParam(data)
            .then((res) => {
              console.log(res);
              if (res.status == 204) { // 204更新成功
                this.API_GET_GlobalParam()
                this.$q.notify({
                  color: 'green',
                  position: 'bottom',
                  message: this.$t('IIOT003.notifyMsg.editSucess'), // 修改成功
                  icon: 'check_circle_outline',
                })
              }
            })
            .catch((error) => {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              errorDetailMsg(error.response.data.message)
              setTimeout(() => {
                this.submitting = false
              }, 1000)
            })
        }
      })
    },
    API_PUT_Reboot() {
      this.$q.loading.show({
        delay: 400, // ms
      })
      API_PUT_Reboot()
        .then((res) => {
          console.log(res)
          this.$q.loading.hide()
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg(error.response.data.message)
          this.$q.loading.hide()
        })
    },
  },
  computed: {},
  mounted() {},
  beforeMount() {},
  beforeCreate() {},
  created() {
    this.API_GET_GlobalParam()
  },
  setup() {},
}
</script>
<style lang="sass">
@import 'src/css/app.sass'
.container
  height: calc(100vh - 130px)
  overflow-y: scroll

.box
  margin: 16px 0 0 0
  padding: 16px
  border: 1px solid $color-stroke
  .title
    height: 34px
    font-size: 16px
    font-weight: bold
  .disableStatus
    .q-field__native
      color: $color-stroke

.bottom
  position: absolute
  bottom: 0px
  right: 0px
  // border: 1px solid red

.q-table__container
  margin: 16px
.button-theme
  // color: black
  width: 100px
  background: white
  // border: 1px solid $color-stroke
  &-add
    background: $color-casablanca
  &-del
    background: $color-cancel
    span
      color: $color-black
  &-application
    background: $color-danube-blue
// 要統一的規範-屆時需寫在全域範圍

// customer button
.btn
  width: 124px
  height: 34px
  color: white
  border: none
  border-radius: 4px
  cursor: pointer
  transition: .2s
  &-search
    background: $color-casablanca
    &:hover
      background-color: red
</style>
