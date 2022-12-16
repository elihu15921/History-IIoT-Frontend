<template>
  <q-toolbar>
    <!--新增-->
    <div class="collapseContent">
      <div class="searchPanel">
        <q-slide-transition>
          
          <div class="showContent">
            <div class="queryConditions">

              <!-- 正式區/測試區 下拉選單 -->
              <div class="dropdownMenu" style="width: 178px">
                <div class="input" @click="dispEnvironmentType = !dispEnvironmentType">
                  <input type="text" v-model="environmentTypeInput.typeName" readonly />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/up.svg"
                    v-show="dispEnvironmentType == true"
                  />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/down.svg"
                    v-show="dispEnvironmentType == false"
                  />
                </div>
                <ul
                  class="selectMenu"
                  v-if="dispEnvironmentType"
                  @mouseleave="dispEnvironmentType = false"
                >
                  <li
                    v-for="(item, key) in environmentTypeList"
                    :key="key"
                    @click="changeEnvironmentType(item)"
                  >
                    <div class="bg">
                      <a>{{ item.typeName }}</a>
                    </div>
                  </li>
                </ul>
              </div>

              <!--查詢-->
              <div class="searchContainer">
                <input
                  class="searchInput"
                  type="text"
                  v-model="keyword"
                  :placeholder="translated.input.pleaseEnter"
                  id="quickFilter"
                  @keydown.enter="onSearch(keyword)"
                />
                <button class="searchBtn" @click="onSearch(keyword)">
                  <img src="~assets/icons/svg/search.svg" />
                </button>
              </div>

              <!-- 時間範圍 開始/結束 -->
              <!-- <span class="title"
                >{{ $t("IIOT009.TimeInterval") }} :</span
              >
              <q-input v-model="startDate" type="date" style="width: 178px" />
              <q-input v-model="startTime" type="time" style="margin: 0 8px" />
              ~
              <q-input
                v-model="endDate"
                type="date"
                style="width: 178px; margin: 0 8px"
              />
              <q-input v-model="endTime" type="time" /> -->
            </div>

            <!-- 查詢條件 -->
            <!-- <div class="queryConditions">
              <span class="title">{{ $t('IIOT009.QueryConditions') }} :</span>
              <div class="dropdownMenu" style="width: 178px">
                <div class="input" @click="dispMenuConditions = !dispMenuConditions">
                  <input type="text" v-model="conditionsInput.typeName" readonly />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/up.svg"
                    v-show="dispMenuConditions == true"
                  />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/down.svg"
                    v-show="dispMenuConditions == false"
                  />
                </div>
                <ul
                  class="selectMenu"
                  v-if="dispMenuConditions"
                  @mouseleave="dispMenuConditions = false"
                >
                  <li
                    v-for="(item, key) in CollectionTypeConditionsList"
                    :key="key"
                    @click="changeConditionsType(item)"
                  >
                    <div class="bg">
                      <a>{{ item.typeName }}</a>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="dropdownMenu" style="width: 178px">
                <div class="input" @click="dispMenuOperator = !dispMenuOperator">
                  <input type="text" v-model="operatorsInput.name" readonly />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/up.svg"
                    v-show="dispMenuOperator == true"
                  />
                  <img
                    class="arrowIcon"
                    src="~assets/icons/svg/down.svg"
                    v-show="dispMenuOperator == false"
                  />
                </div>
                <ul class="selectMenu" v-if="dispMenuOperator" @mouseleave="dispMenuOperator = false">
                  <li v-for="(item, key) in operatorsList" :key="key" @click="changeOperatorsType(item)">
                    <div class="bg">
                      <a>{{ item.name }}</a>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="searchContainer">
                <div class="dropdownMenu" style="width: 178px" v-if="dispConditionTargetDrapMenu">
                  <div class="input" @click="dispMenuConditionTarget = !dispMenuConditionTarget">
                    <input type="text" v-model="conditionTargetInput.typeName" readonly />
                    <img
                      class="arrowIcon"
                      src="~assets/icons/svg/up.svg"
                      v-show="dispMenuConditionTarget == true"
                    />
                    <img
                      class="arrowIcon"
                      src="~assets/icons/svg/down.svg"
                      v-show="dispMenuConditionTarget == false"
                    />
                  </div>
                  <ul
                    class="selectMenu"
                    v-if="dispMenuConditionTarget"
                    @mouseleave="dispMenuConditionTarget = false"
                  >
                    <li
                      v-for="(item, key) in conditionTargetList"
                      :key="key"
                      @click="changeConditionTaget(item)"
                    >
                      <div class="bg">
                        <a>{{ item.typeName }}</a>
                      </div>
                    </li>
                  </ul>
                </div>
                <input
                  class="searchInput"
                  type="text"
                  v-model="target"
                  v-if="!dispConditionTargetDrapMenu"
                  id="quickFilter"
                  @keydown.enter="addConditions(conditionsInput, operatorsInput, target)"
                />
                <button
                  class="addConditionsBtn"
                  @click="addConditions(conditionsInput, operatorsInput, target)"
                >
                  <img src="~assets/icons/png/plus_white.png" />
                </button>
              </div>
            </div> -->
            <!-- 已選條件 -->
            <!-- <div class="selectedConditions">
              <span class="title">{{ $t('IIOT009.SelectedConditions') }} :</span>
              <div v-for="item in selectedConditionsList" :key="item">
                <q-chip
                  removable
                  text-color="white"
                  :label="item.condition + ' | ' + item.operator + ' | ' + item.targetName"
                  @remove="removeConditionChip(item.guid)"
                />
              </div>
              <q-space />
              <dw-button
                class="button-theme text-white button-theme-add"
                :label="translated.btn.search"
                @click="onSearch()"
              />
            </div> -->

            <!--快速挑選-->
            <!-- <div class="quickPick">
              <span class="title"
                >{{ $t("IIOT009.QuickPick") }} :</span
              >
              <div class="searchContainer">
                <input
                  class="searchInput"
                  type="text"
                  v-model="keyword"
                  :placeholder="translated.input.pleaseEnter"
                  id="quickFilter"
                  @keydown.enter="onSearch(keyword)"
                />
                <button class="searchBtn" @click="onSearch(keyword)">
                  <img src="~assets/icons/svg/search.svg" />
                </button>
              </div>

              <q-space />

              <dw-button
                class="button-theme text-white button-theme-add"
                :label="translated.btn.search"
                @click="onSearch()"
              />
            </div> -->
          </div>
        </q-slide-transition>
      </div>
    </div>
  </q-toolbar>

  <div class="tableContainer">
    <div class="q-pa-md ag-grid">
      <ag-grid-vue
        style="width: 100%; height: 720px"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :editType="editType"
        :rowData="rowData"
        rowSelection="multiple"
        @selection-changed="onSelectionChanged"
        :gridOptions="gridOptions"
        @grid-ready="onGridReady"
        @row-clicked="onCellClicked"
        :suppressRowClickSelection="true"
        :pagination="false"
        :paginationPageSize="paginationPageSize"
      ></ag-grid-vue>
      <div class="tablePagination" style="bottom: 0px">
        <span class="container">
          <img
            src="~assets/icons/png/firstPage.png"
            @click="API_GET_EqptMonRealTime(this.firstLink)"
          />
          <img
            src="~assets/icons/png/previousPage.png"
            @click="API_GET_EqptMonRealTime(this.previousLink)"
          />
          <input
            type="text"
            v-model="currentPage"
            oninput="value = value.replace(/[^\d]/g,'')"
            @keypress.enter="clickEnterToChangePage(this.currentPage, this.environmentTypeInput.typeNo, this.conditionsString)"
          />
          <span class="slash">/</span>
          <span class="totalPages">{{ totalPages }}</span>
          <img
            src="~assets/icons/png/nextPage.png"
            @click="API_GET_EqptMonRealTime(this.nextLink)"
          />
          <img
            src="~assets/icons/png/lastPage.png"
            @click="API_GET_EqptMonRealTime(this.lastLink)"
          />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../../components/input/input'
import dw_button from '../../components/button/button'
import ag_grid_table from '../../components/table/table'
import { api } from 'boot/axios'
import { errorDetailMsg } from '../../components/toolBox.js'
import { API_GET_EqptMonRealTime } from '../../api/EquipmentMonitoringRealTime/API_GET_EqptMonRealTime'
import { GET_API_MonQueryFilter } from '../../api/EquipmentMonitoringRealTime/GET_API_MonQueryFilter'
import { API_GET_EqptStatus } from '../../api/EquipmentMonitoringRealTime/API_GET_EqptStatus'
import { API_GET_EqptCategory } from '../../api/EqptBasicInfo/API_GET_EqptCategory'
import { API_GET_ProductionEnv } from '../../api/TransactionInquiry/API_GET_ProductionEnv'

export default {
  components: {
    AgGridVue,
    'dw-input': dw_input,
    'dw-button': dw_button,
    'ag-grid-table': ag_grid_table,
  },
  data: function () {
    return {
      keyword: null,
      currentPage: null,
      totalPages: null,
      previousLink: null,
      nextLink: null,
      firstLink: null,
      lastLink: null,
      submitting: false,
      translated: {
        btn: {
          add: this.$t('IIOT009.btn.add'),
          edit: this.$t('IIOT009.btn.edit'),
          del: this.$t('IIOT009.btn.del'),
          confirm: this.$t('IIOT009.btn.confirm'),
          cancel: this.$t('IIOT009.btn.cancel'),
          save: this.$t('IIOT009.btn.save'),
          search: this.$t('IIOT009.btn.search'),
        },
        input: {
          search: this.$t('IIOT009.input.search'),
          pleaseEnter: this.$t('IIOT009.input.pleaseEnter'),
        },
      },
      dispMenuConditions: false,
      dispMenuOperator: false,
      dispMenuTaskType: false,
      dispConditionTargetDrapMenu: false,
      dispMenuConditionTarget: false,
      dispEnvironmentType: false,
      CollectionTypeConditionsList: [],
      conditionTargetList: [],
      environmentTypeList: [],
      eqptStatusList: [],
      operatorsList: [
        {
          name: this.$t('IIOT009.operators.equal'),
          name_en: 'Equal',
        },
        {
          name: this.$t('IIOT009.operators.exceed'),
          name_en: 'Exceed',
        },
        {
          name: this.$t('IIOT009.operators.greaterOrEqualTo'),
          name_en: 'GreaterOrEqualTo',
        },
        {
          name: this.$t('IIOT009.operators.LessThan'),
          name_en: 'LessThan',
        },
        {
          name: this.$t('IIOT009.operators.LessThanOrEqualTo'),
          name_en: 'LessThanOrEqualTo',
        },
        {
          name: this.$t('IIOT009.operators.notEqual'),
          name_en: 'NotEqual',
        },
        {
          name: this.$t('IIOT009.operators.Include'),
          name_en: 'Include',
        },
      ],
      target: null,
      eqptStatusInput: {
        id: null,
        typeNo: null,
        typeName: null,
      },
      conditionsInput: {
        typeNo: null,
        typeName: null,
        typeName_en: null,
      },
      operatorsInput: {
        name: null,
        name_en: null,
      },
      conditionTargetInput: {
        typeNo: null,
        typeName: null,
      },
      inputFactory: {
        no: '',
        name: '',
      },
      environmentTypeInput: {
        typeNo: null,
        typeName: null,
      },
      selectedConditionsList: [],
      startDate: null,
      endDate: null,
      startTime: '00:00',
      endTime: '23:59',
      dateTimeFilter: null,
      conditionsString: null,
      rootName: 'Mike',
      rootColumn: null,
      gridOptions: null, // ag-grid setting
      gridApi: null,
      columnDefs: null,
      defaultColDef: null,
      editType: null,
      rowData: null,
      columnApi: null,
      paginationPageSize: null,
      rootName: this.rootName,
      addFactoryDialog: false,
      editFactoryDialog: false,
      delFactoryDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDelFactoryNo: '',
      selectedDelFactoryName: '',
      selectedRows: [],
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    async init() {
      // await this.GET_API_MonQueryFilter()
      this.dateTimeFilter =
        this.startDate + ' ' + this.startTime + ':00@' + this.endDate + ' ' + this.endTime + ':59'
      this.API_GET_EqptMonRealTime('', '', 1, this.paginationPageSize, this.environmentTypeInput.typeNo, '')
    },
    addConditions(conditionsInput, operatorsInput, target) {
      console.log(conditionsInput.typeNo)
      if (conditionsInput.typeNo == 104 || conditionsInput.typeNo == 105) {
        if (this.conditionTargetInput.typeNo == null || this.conditionTargetInput.typeNo == undefined) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: this.$t('IIOT009.warnMSG.pleaseEnterQueryConditions'),
            icon: 'report_problem',
          })
          return null
        }
        this.selectedConditionsList.push({
          guid: this.guid(),
          condition: conditionsInput.typeName,
          condition_en: conditionsInput.typeNo,
          operator: operatorsInput.name,
          operator_en: operatorsInput.name_en,
          targetNo: this.conditionTargetInput.typeNo,
          targetName: this.conditionTargetInput.typeName,
        })
      } else {
        if (target == '' || target == null || target == undefined) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: this.$t('IIOT009.warnMSG.pleaseEnterQueryConditions'),
            icon: 'report_problem',
          })
          return null
        }
        this.selectedConditionsList.push({
          guid: this.guid(),
          condition: conditionsInput.typeName,
          condition_en: conditionsInput.typeNo,
          operator: operatorsInput.name,
          operator_en: operatorsInput.name_en,
          targetNo: target,
          targetName: target,
        })
      }
    },
    removeConditionChip(guid) {
      console.log(guid)
      this.selectedConditionsList.forEach((ele, index) => {
        if (ele.guid == guid) {
          this.selectedConditionsList.splice(index, 1)
        }
      })
    },
    clickEnterToChangePage(page, environmentType, conditionsString) {
      this.API_GET_EqptMonRealTime('', '', page, this.paginationPageSize, environmentType, conditionsString)
    },
    onSearch(keyword) {
      this.$q.loading.show({
        delay: 400, // ms
      })
      if (
        this.isEmpty(this.startDate) == true ||
        this.isEmpty(this.startTime) == true ||
        this.isEmpty(this.endDate) == true ||
        this.isEmpty(this.endTime) == true
      ) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('IIOT009.warnMSG.pleaseEnterTimeInterval'),
          icon: 'report_problem',
        })
        return null
      }

      if (this.selectedConditionsList.length == 0) {
        this.conditionsString = ''
      } else {
        this.conditionsString = ''
        this.selectedConditionsList.forEach((item) => {
          this.conditionsString += item.condition_en + '@' + item.operator_en + '@' + item.targetNo + ','
        })
      }
      this.dateTimeFilter =
        this.startDate + ' ' + this.startTime + ':00@' + this.endDate + ' ' + this.endTime + ':59'
      // console.log(this.dateTimeFilter);
      // console.log(this.selectedConditionsList);
      console.log(this.conditionsString)

      this.API_GET_EqptMonRealTime('', keyword, 1, this.paginationPageSize, this.environmentTypeInput.typeNo, this.conditionsString)
    },
    isEmpty(item) {
      if (item == null || item == '' || item == undefined) {
        return true
      } else {
        return false
      }
    },
    onPageSizeChanged(newPageSize) {
      var value = document.getElementById('page-size').value
      this.gridApi.paginationSetPageSize(Number(value))
    },
    onQuickFilterChanged() {
      this.gridApi.setQuickFilter(document.getElementById('quickFilter').value)
    },
    onGridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    onCellClicked(params) {
      console.log('Cell was clicked')
      console.log(params)
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDelFactoryNo = this.selectedRows[0].factoryNo
        this.selectedDelFactoryName = this.selectedRows[0].factoryName
        this.editDisable = false
        this.delDisable = false
      } else if (this.selectedRows.length > 1) {
        this.editDisable = true
        this.delDisable = false
      } else {
        this.editDisable = true
        this.delDisable = true
      }
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => `${node.factoryNo} ${node.factoryName}`)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
    },
    onBtStopEditing() {
      this.gridApi.stopEditing()
    },
    onBtStartEditing(index) {
      this.gridApi.setFocusedCell(index, 'factoryNo')
      this.gridApi.startEditingCell({
        rowIndex: index,
        colKey: 'factoryNo',
      })
    },
    onFilterTextBoxChanged() {
      this.gridOptions.api.setQuickFilter(document.getElementById('filter-text-box').value)
    },
    addColumn() {
      this.rowData.push({
        factoryNo: '',
        factoryName: '',
        creator: 'test',
        date: this.getTodayDate(),
      })
      this.gridOptions.api.setRowData(this.rowData)
    },
    updateRowData() {
      const result = [
        // 模擬 API GET
        {
          factoryNo: '0001',
          factoryName: '鼎新電腦',
          creator: '小明',
          date: '24/08/2008',
        },
        {
          factoryNo: '0002',
          factoryName: '鼎新電腦',
          creator: '小梅',
          date: '29/08/2004',
        },
      ]
      this.rowData = result
    },
    getTodayDate() {
      let fullDate = new Date()
      let yyyy = fullDate.getFullYear()
      let MM = fullDate.getMonth() + 1 >= 10 ? fullDate.getMonth() + 1 : '0' + (fullDate.getMonth() + 1)
      let dd = fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()
      let today = yyyy + '-' + MM + '-' + dd
      return today
    },
    dateComparator(date1, date2) {
      var date1Number = date1 && new Date(date1).getTime()
      var date2Number = date2 && new Date(date2).getTime()

      if (date1Number == null && date2Number == null) {
        return 0
      }

      if (date1Number == null) {
        return -1
      } else if (date2Number == null) {
        return 1
      }

      return date1Number - date2Number
    },
    openAddFactoryDialog() {
      this.addFactoryDialog = true
      this.inputFactory.no = null
      this.inputFactory.name = null
    },
    openEditFactoryDialog() {
      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }

      this.inputFactory.no = selectedData[0].factoryNo
      this.inputFactory.name = selectedData[0].factoryName
      this.editFactoryDialog = true
    },
    openDelFactoryConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }
      this.delFactoryDialog = true
    },
    changeOperatorsType(item) {
      this.operatorsInput = item
      this.dispMenuOperator = false
    },
    changeConditionTaget(item) {
      this.conditionTargetInput = item
      this.dispMenuConditionTarget = false
    },
    changeEnvironmentType(item) {
      this.environmentTypeInput = item
      this.dispEnvironmentType = false
      this.API_GET_EqptMonRealTime('', '', 1, this.paginationPageSize, this.environmentTypeInput.typeNo, '')
    },
    changeConditionsType(item) {
      console.log(item)
      this.conditionsInput = item
      this.dispMenuConditions = false

      if (item.typeNo == '104' || item.typeNo == '105') {
        // 判斷是否要顯示下拉框
        this.dispConditionTargetDrapMenu = true
        if (item.typeNo == '104') {
          // 設備狀態
          this.API_GET_EqptStatus()
        } else if (item.typeNo == '105') {
          // 設備類別
          this.API_GET_EqptCategory('', '', 1, 10)
        }
      } else {
        this.dispConditionTargetDrapMenu = false
      }
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    API_GET_ProductionEnv() {
      // 取得 是否為生產數據 下拉選單
      let _this = this
      API_GET_ProductionEnv()
        .then((res) => {
          console.log(res.data)
          this.environmentTypeList = res.data
          this.environmentTypeInput = res.data[0]
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_ProductionEnv 失敗!')
        })
    },
    API_GET_EqptMonRealTime(url, search, pageNumber, pageSize, environmentType, conditionsString) {
      let _this = this
      API_GET_EqptMonRealTime(url, search, pageNumber, pageSize, environmentType, conditionsString)
        .then((res) => {
          console.log(res.data);

          if (res.data.length != 0) {
            this.rowData = res.data
          } else {
            this.rowData = []
          }

          let pagination = JSON.parse(res.headers['x-pagination'])
          this.totalPages = pagination['totalPages']
          this.currentPage = pagination['currentPage']
          this.previousLink = pagination['previousLink']
          this.nextLink = pagination['nextLink']
          this.firstLink = pagination['firstLink']
          this.lastLink = pagination['lastLink']

          this.$q.loading.hide()
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EqptMonRealTime 失敗!')
          this.$q.loading.hide()
        })
    },
    GET_API_MonQueryFilter() {
      let _this = this
      return new Promise((resolve, reject) => {
        GET_API_MonQueryFilter()
          .then((res) => {
            // console.log(res.data);
            this.CollectionTypeConditionsList = res.data
            this.conditionsInput = res.data[0]
            resolve(true)
          })
          .catch((error) => {
            console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
            errorDetailMsg('GET_API_MonQueryFilter 失敗!')
            reject(false)
          })
      })
    },
    API_GET_EqptStatus() {
      // 取得設備狀態清單
      let _this = this
      API_GET_EqptStatus()
        .then((res) => {
          // console.log(res.data);
          this.conditionTargetList = res.data
          this.conditionTargetInput = res.data[0]
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EqptStatus 失敗!')
        })
    },
    API_GET_EqptCategory(url, search, pageNumber, pageSize) {
      // 取得設備類別配置資料
      let _this = this
      API_GET_EqptCategory(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data)
          this.conditionTargetList = res.data
          this.conditionTargetInput = res.data[0]
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EqptCategory 失敗!')
        })
    },
    displayIsProductionFormatter(item) {
      if (item.data.isProduction == true) {
        return this.$t('IIOT008.Yes')
      } else if (item.data.isProduction == false) {
        return this.$t('IIOT008.No')
      }
    },
    displayIsUploadFormatter(item) {
      if (item.data.isUpload == true) {
        return this.$t('IIOT008.Yes')
      } else if (item.data.isUpload == false) {
        return this.$t('IIOT008.No')
      }
    },
    displayIsProductionFormatter(item) {
      if (item.data.isProduction == true) {
        return this.$t('IIOT009.Yes')
      } else if (item.data.isProduction == false) {
        return this.$t('IIOT009.No')
      }
    },
  },
  computed: {},
  mounted() {
    this.gridApi = this.gridOptions.api
  },
  beforeMount() {
    this.gridOptions = {}
    this.editType = 'fullRow' // 整排編輯
    this.paginationPageSize = 50 // 預設顯示資料筆數
    this.columnDefs = [
      {
        field: 'equipmentNo',
        headerName: this.$t('IIOT009.EquipmentNo'),
        valueFormatter: this.displayIsProductionFormatter,
      },
      {
        field: 'equipmentName',
        headerName: this.$t('IIOT009.EquipmentName'),
      },
      {
        field: 'statusTransl',
        headerName: this.$t('IIOT009.EquipmentStatus'),
        // comparator: this.dateComparator,
        cellClass: (params) => {
          console.log(params.data.statusType);
          if (params.data.statusType == '101') {
            return ['colorRun', 'fontStyle']
          } else if (params.data.statusType == '102') {
            return ['colorIdle', 'fontStyle']
          } else if (params.data.statusType == '103') {
            return ['colorError', 'fontStyle']
          } else if (params.data.statusType == '104') {
            return ['colorSettings', 'fontStyle']
          } else if (params.data.statusType == '105') {
            return ['colorShutdown', 'fontStyle']
          } else if (params.data.statusType == '106') {
            return ['colorRepair', 'fontStyle']
          } else if (params.data.statusType == '107') {
            return ['colorMaintenance', 'fontStyle']
          } else if (params.data.statusType == '108') {
            return ['colorHold', 'fontStyle']
          }
        },
      },
      {
        field: 'description',
        headerName: this.$t('IIOT009.StatusDescription'),
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT009.CreateTime'),
      },
    ]
    this.defaultColDef = {
      editable: false, // 單元格是否可編輯
      sortable: true, // 排序
      resizable: true, // 可拖動改變列大小
      lockPosition: false, // 禁止拖動列的位置
      flex: 1,
      filter: false, // 列篩選器
    }

    this.startDate = this.getTodayDate()
    this.endDate = this.getTodayDate()

    this.init()
  },
  beforeCreate() {},
  created() {
    this.operatorsInput = {
      name: this.$t('IIOT009.operators.equal'),
      name_en: 'Equal',
    }

    this.API_GET_ProductionEnv()
  },
  setup() {
    return {}
  },
}
</script>
<style lang="sass" scoped>
@import 'src/css/app.sass'
.fontStyle
  font-weight: bold
.colorRun
  color: #12D91E
.colorIdle
  color: #F2B71E
.colorError
  color: #E10F0F
.colorSettings
  color: #0189FE
.colorShutdown
  color: #031219
.colorRepair
  color: #EB9A63
.colorMaintenance
  color: #43B032
.colorHold
  color: #7B5E12

.tableContainer
  height: calc( 100vh - 176px )

.q-field__control
  padding: 0 8px
  height: 34px
  border: 1px solid $color-stroke

.ag-grid
  height: 375px
.ag-grid-changeHeight
  height: 310px
.collapseContent
  display: flex
  flex-direction: row
  width: 100%
  // border: 1px solid green

.collapseBtn
  height: 100%
  margin: 0
  // border: 1px solid green

.dropdownMenu
  margin: 0 8px 0 0

.addConditionsBtn
  display: flex
  justify-content: center
  align-items: center
  width: 34px
  height: 34px
  margin: 0 0 0 8px
  border-radius: 4px
  border: none
  background-color: $color-casablanca
  transition: 0.2s
  cursor: pointer
  z-index: 1
    // border: 1px solid red
  &:hover
    background-color: $color-casablanca
  img
    width: 20px

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
