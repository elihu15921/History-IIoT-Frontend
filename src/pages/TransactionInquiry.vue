<template>
  <q-toolbar>
    <!--新增-->
    <div class="collapseContent">
      <div class="collapseBtn">
        <div class="iconBtn" @click="visible = !visible" style="margin: 12px 0 0 0">
          <img src="~assets/icons/png/plus.png" v-if="!visible" />
          <img src="~assets/icons/png/minus.png" v-if="visible" />
        </div>
      </div>
      <div class="searchPanel">
        <div class="taskType">
          <span class="title">{{ $t('TransactionInquiryPage.TaskType') }} :</span>
          <div class="dropdownMenu" style="width: 178px">
            <div class="input" @click="dispMenuTaskType = !dispMenuTaskType">
              <input type="text" v-model="taskTypeInput.typeName" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuTaskType == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuTaskType == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuTaskType" @mouseleave="dispMenuTaskType = false">
              <li v-for="(item, key) in taskTypeList" :key="key" @click="changeTaskType(item)">
                <div class="bg">
                  <a>{{ item.typeName }}</a>
                </div>
              </li>
            </ul>
          </div>
          <q-space />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.search"
            v-show="!visible"
            @click="onSearch()"
          />
        </div>
        <q-slide-transition>
          <div class="showContent" v-show="visible">
            <div class="queryConditions">
              <span class="title">{{ $t('TransactionInquiryPage.TimeInterval') }} :</span>
              <q-input v-model="startDate" type="date" style="width: 178px" />
              <q-input v-model="startTime" type="time" style="margin: 0 8px" />
              ~
              <q-input v-model="endDate" type="date" style="width: 178px; margin: 0 8px" />
              <q-input v-model="endTime" type="time" />
            </div>
            <!-- 查詢條件 -->
            <!-- <div class="queryConditions">
              <span class="title">{{ $t('TransactionInquiryPage.QueryConditions') }} :</span>
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
            <div class="selectedConditions">
              <!-- <span class="title">{{ $t('TransactionInquiryPage.SelectedConditions') }} :</span>
              <div v-for="item in selectedConditionsList" :key="item">
                <q-chip
                  removable
                  text-color="white"
                  :label="item.condition + ' | ' + item.operator + ' | ' + item.targetName"
                  @remove="removeConditionChip(item.guid)"
                />
              </div> -->
              <q-space />
              <dw-button
                class="button-theme text-white button-theme-add"
                :label="translated.btn.search"
                v-show="visible"
                @click="onSearch()"
              />
            </div>

            <!--快速挑選-->
            <!-- <div class="quickPick">
              <span class="title"
                >{{ $t("TransactionInquiryPage.QuickPick") }} :</span
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

  <div class="tableContainer" :class="{ 'tableContainer-changeHeight': !visible }">
    <div class="q-pa-md ag-grid" :class="{ 'ag-grid-changeHeight': visible }">
      <ag-grid-vue
        style="width: 100%; height: 85%"
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
            @click="API_GET_Task_Collection_log(this.firstLink)"
          />
          <img
            src="~assets/icons/png/previousPage.png"
            @click="API_GET_Task_Collection_log(this.previousLink)"
          />
          <input
            type="text"
            v-model="currentPage"
            oninput="value = value.replace(/[^\d]/g,'')"
            @keypress.enter="
              clickEnterToChangePage(
                this.currentPage,
                this.dateTimeFilter,
                this.conditionsString,
                this.taskTypeInput.typeNo
              )
            "
          />
          <span class="slash">/</span>
          <span class="totalPages">{{ totalPages }}</span>
          <img
            src="~assets/icons/png/nextPage.png"
            @click="API_GET_Task_Collection_log(this.nextLink)"
          />
          <img
            src="~assets/icons/png/lastPage.png"
            @click="API_GET_Task_Collection_log(this.lastLink)"
          />
        </span>
      </div>
    </div>

    <div class="q-pa-md ag-grid" :class="{ 'ag-grid-changeHeight': visible }">
      <ag-grid-vue
        style="width: 100%; height: 85%"
        class="ag-theme-alpine"
        :columnDefs="agGridLevel2.columnDefs"
        :defaultColDef="agGridLevel2.defaultColDef"
        :editType="agGridLevel2.editType"
        :rowData="agGridLevel2.rowData"
        rowSelection="multiple"
        @selection-changed="onSelectionChanged"
        :gridOptions="agGridLevel2.gridOptions"
        @grid-ready="onGridReady_level2"
      ></ag-grid-vue>
      <div class="tablePagination">
        <span class="container">
          <img
            src="~assets/icons/png/firstPage.png"
            @click="API_GET_Task_Collection_log_detail(this.agGridLevel2.pagination.firstLink)"
          />
          <img
            src="~assets/icons/png/previousPage.png"
            @click="API_GET_Task_Collection_log_detail(this.agGridLevel2.pagination.previousLink)"
          />
          <input
            type="text"
            v-model="this.agGridLevel2.pagination.currentPage"
            oninput="value = value.replace(/[^\d]/g,'')"
            @keypress.enter="
              clickEnterToChangePageLevel2(
                this.agGridLevel2.pagination.currentPage,
                this.taskTypeInput.id,
                this.taskTypeInput.typeNo
              )
            "
          />
          <span class="slash">/</span>
          <span class="totalPages">{{ agGridLevel2.pagination.totalPages }}</span>
          <img
            src="~assets/icons/png/nextPage.png"
            @click="API_GET_Task_Collection_log_detail(this.agGridLevel2.pagination.nextLink)"
          />
          <img
            src="~assets/icons/png/lastPage.png"
            @click="API_GET_Task_Collection_log_detail(this.agGridLevel2.pagination.lastLink)"
          />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../components/input/input'
import dw_button from '../components/button/button'
import ag_grid_table from '../components/table/table'
import { api } from 'boot/axios'
import { errorDetailMsg } from '../components/toolBox.js'
import { API_GET_TaskType } from '../api/TaskCenter/API_GET_TaskType'
import { API_GET_QueryCategory } from '../api/TransactionInquiry/API_GET_QueryCategory'
import { API_GET_Task_Collection_log } from '../api/TransactionInquiry/API_GET_Task_Collection_log'
import { API_GET_Task_Collection_log_detail } from '../api/TransactionInquiry/API_GET_Task_Collection_log_detail'
import { API_GET_ProductionEnv } from '../api/TransactionInquiry/API_GET_ProductionEnv'

export default {
  components: {
    AgGridVue,
    'dw-input': dw_input,
    'dw-button': dw_button,
    'ag-grid-table': ag_grid_table,
  },
  data: function () {
    return {
      visible: true,
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
          add: this.$t('TransactionInquiryPage.btn.add'),
          edit: this.$t('TransactionInquiryPage.btn.edit'),
          del: this.$t('TransactionInquiryPage.btn.del'),
          confirm: this.$t('TransactionInquiryPage.btn.confirm'),
          cancel: this.$t('TransactionInquiryPage.btn.cancel'),
          save: this.$t('TransactionInquiryPage.btn.save'),
          search: this.$t('TransactionInquiryPage.btn.search'),
        },
      },
      dispMenuConditions: false,
      dispMenuOperator: false,
      dispMenuTaskType: false,
      dispConditionTargetDrapMenu: true,
      dispMenuConditionTarget: false,
      CollectionTypeConditionsList: [],
      conditionTargetList: [],
      taskTypeList: [],
      operatorsList: [
        {
          name: this.$t('TransactionInquiryPage.operators.equal'),
          name_en: 'Equal',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.exceed'),
          name_en: 'Exceed',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.greaterOrEqualTo'),
          name_en: 'GreaterOrEqualTo',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.LessThan'),
          name_en: 'LessThan',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.LessThanOrEqualTo'),
          name_en: 'LessThanOrEqualTo',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.notEqual'),
          name_en: 'NotEqual',
        },
        {
          name: this.$t('TransactionInquiryPage.operators.Include'),
          name_en: 'Include',
        },
      ],
      target: null,
      taskTypeInput: {
        id: null,
        typeNo: null,
        typeName: null,
      },
      conditionsInput: {
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
      agGridLevel2: {
        gridOptions: null, // ag-grid setting
        gridApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        columnApi: null,
        paginationPageSize: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          previousLink: null,
          nextLink: null,
          firstLink: null,
          lastLink: null,
        },
      },
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
      await this.API_GET_TaskType('', '', 1, this.paginationPageSize)
      this.dateTimeFilter =
        this.startDate + ' ' + this.startTime + ':00@' + this.endDate + ' ' + this.endTime + ':59'
      this.API_GET_Task_Collection_log(
        '',
        '',
        1,
        this.paginationPageSize,
        this.dateTimeFilter,
        '',
        this.taskTypeInput.typeNo
      )
      // this.API_GET_ProductionEnv()
    },
    // removes the athlete column
    btnExcludeAthleteColumn() {
      this.columnDefs = colDefsAthleteExcluded
    },
    // adds the athlete column
    btnIncludeAthleteColumn() {
      this.columnDefs = [
        {
          field: 'factoryNo',
          headerName: this.$t('TransactionInquiryPage.FactoryNo'),
          width: 90,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          editable: false,
          unSortIcon: true,
        },
        {
          field: 'factoryName',
          headerName: this.$t('TransactionInquiryPage.FactoryName'),
          width: 90,
          editable: false,
          unSortIcon: true,
        },
        {
          field: 'factoryName',
          headerName: this.$t('TransactionInquiryPage.FactoryName'),
          width: 90,
          editable: false,
          unSortIcon: true,
        },
        {
          field: 'creator',
          headerName: this.$t('TransactionInquiryPage.CreateTime'),
          width: 90,
          editable: false,
          unSortIcon: true,
        },
        {
          field: 'modifytime',
          headerName: this.$t('TransactionInquiryPage.LastUpdateDate'),
          comparator: this.dateComparator,
          editable: false,
          unSortIcon: true,
        },
      ]
      this.gridOptions.api.setColumnDefs(colDefsAthleteIncluded)
    },
    addConditions(conditionsInput, operatorsInput, target) {
      if (conditionsInput.typeNo == 2035101) {
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
            message: this.$t('TransactionInquiryPage.warnMSG.pleaseEnterQueryConditions'),
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
    clickEnterToChangePage(page, dateTimeFilter, conditionsString, typeNo) {
      this.API_GET_Task_Collection_log(
        '',
        '',
        page,
        this.paginationPageSize,
        dateTimeFilter,
        conditionsString,
        typeNo
      )
    },
    clickEnterToChangePageLevel2(page, id, workshopTaskType) {
      this.API_GET_Task_Collection_log_detail(
        '',
        '',
        page,
        this.paginationPageSize,
        id,
        workshopTaskType
      )
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
          message: this.$t('TransactionInquiryPage.warnMSG.pleaseEnterTimeInterval'),
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
      // console.log(this.conditionsString);

      this.API_GET_Task_Collection_log(
        '',
        keyword,
        1,
        this.paginationPageSize,
        this.dateTimeFilter,
        this.conditionsString,
        this.taskTypeInput.typeNo
      )
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
    onGridReady_level2(params) {
      this.agGridLevel2.gridApi = params.api
      this.agGridLevel2.columnApi = params.columnApi
    },
    onCellClicked(params) {
      console.log('Cell was clicked')
      console.log(params)
      this.$q.loading.show({
        delay: 400, // ms
      })
      this.changeTaskTypeTable(params.data.id, this.taskTypeInput.typeNo)
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()

      if (this.selectedRows.length != 0) {
        this.changeTaskTypeTable(this.selectedRows[0].id, this.selectedRows[0].workshopTaskType)
      }

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
    changeConditionsType(item) {
      console.log(item)
      this.conditionsInput = item
      this.dispMenuConditions = false

      if (item.typeNo == '2035101') {
        // 判斷是否要顯示下拉框
        this.dispConditionTargetDrapMenu = true
        if (item.typeNo == '2035101') {
          // 設備狀態
          this.API_GET_ProductionEnv()
        }
      } else {
        this.dispConditionTargetDrapMenu = false
      }
    },
    changeConditionTaget(item) {
      this.conditionTargetInput = item
      this.dispMenuConditionTarget = false
    },
    changeTaskType(item) {
      this.taskTypeInput = item
      this.dispMenuTaskType = false
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    changeTaskTypeTable(id, taskType) {
      let columnDefs = this.gridOptions.api.getColumnDefs()
      let columnDefs_level2 = this.agGridLevel2.gridOptions.api.getColumnDefs()
      if (taskType == 'PushTask' || taskType == 101) {
        columnDefs = [
          {
            field: 'situationTransl',
            headerName: this.$t('TransactionInquiryPage.Situation'),
            // valueFormatter: this.displayIsProductionFormatter,
          },
          {
            field: 'resultMessage',
            headerName: this.$t('TransactionInquiryPage.EquiptResMessage'),
            comparator: this.dateComparator,
          },
          {
            field: 'usageTime',
            headerName: this.$t('TransactionInquiryPage.EquiptMilliseconds'),
            comparator: this.dateComparator,
          },
          {
            field: 'createTime',
            headerName: this.$t('TransactionInquiryPage.CreateTime'),
          },
        ]
      }
      // else if (taskType == 'DownloadTask' || taskType == 2025201) {
      //   columnDefs = [
      //     {
      //       field: 'productionEnvironmentTransl',
      //       headerName: this.$t('TransactionInquiryPage.ProductionData'),
      //       valueFormatter: this.displayIsProductionFormatter,
      //     },
      //     {
      //       field: 'resultMessage',
      //       headerName: this.$t('TransactionInquiryPage.EquiptResMessage'),
      //       comparator: this.dateComparator,
      //     },
      //     {
      //       field: 'usageTime',
      //       headerName: this.$t('TransactionInquiryPage.EquiptMilliseconds'),
      //       comparator: this.dateComparator,
      //     },
      //     {
      //       field: 'modifytime',
      //       headerName: this.$t('TransactionInquiryPage.LastUpdateDate'),
      //     },
      //   ]
      // }
      this.gridOptions.api.setColumnDefs(columnDefs)

      if (taskType == 'PushTask' || taskType == 101) {
        columnDefs_level2 = [
          {
            field: 'equipmentNo',
            headerName: this.$t('TransactionInquiryPage.EquipmentNo'),
            width: 90,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('TransactionInquiryPage.EquipmentName'),
            width: 90,
          },
          {
            field: 'dataNo',
            headerName: this.$t('TransactionInquiryPage.DataNo'),
            width: 90,
          },
          {
            field: 'dataValue',
            headerName: this.$t('TransactionInquiryPage.DataValue'),
            width: 90,
          },
          {
            field: 'categoryTransl',
            headerName: this.$t('TransactionInquiryPage.ParamType'), // 參數類型
            width: 90,
          },
          {
            field: 'createTime',
            headerName: this.$t('TransactionInquiryPage.CreateTime'),
            width: 90,
          },
        ]
      }
      // else if (taskType == 'DownloadTask' || taskType == 2025201) {
      //   columnDefs_level2 = [
      //     {
      //       field: 'equipmentNo',
      //       headerName: this.$t('TransactionInquiryPage.EquipmentNo'),
      //       width: 90,
      //     },
      //     {
      //       field: 'equipmentName',
      //       headerName: this.$t('TransactionInquiryPage.EquipmentName'),
      //       width: 90,
      //     },
      //     {
      //       field: 'commandNo',
      //       headerName: this.$t('TransactionInquiryPage.AttribNo'),
      //       width: 90,
      //     },
      //     {
      //       field: 'commandValue',
      //       headerName: this.$t('TransactionInquiryPage.AttribValue'),
      //       width: 90,
      //     },
      //     {
      //       field: 'commandParamTransl',
      //       headerName: this.$t('TransactionInquiryPage.ParamType'),
      //       width: 90,
      //     },
      //     {
      //       field: 'eventTime',
      //       headerName: this.$t('TransactionInquiryPage.CreateTime'),
      //       width: 90,
      //     },
      //   ]
      // }
      this.agGridLevel2.gridOptions.api.setColumnDefs(columnDefs_level2)
      this.API_GET_Task_Collection_log_detail('', '', 1, this.paginationPageSize, id, taskType)
    },
    API_GET_Task_Collection_log(
      url,
      search,
      pageNumber,
      pageSize,
      dateTimeFilter,
      conditionsString,
      workshopTaskType
    ) {
      console.log(workshopTaskType)
      let _this = this
      API_GET_Task_Collection_log(
        url,
        search,
        pageNumber,
        pageSize,
        dateTimeFilter,
        conditionsString,
        workshopTaskType
      )
        .then((res) => {
          console.log(res.data)

          if (res.data.length != 0) {
            this.rowData = res.data
            this.taskTypeInput.id = res.data[0].id
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

          if (res.data.length != 0) {
            // this.changeTaskTypeTable(res.data[0].id, this.taskTypeInput.typeNo)
            this.API_GET_Task_Collection_log_detail('', '', 1, this.paginationPageSize, res.data[0].id, this.taskTypeInput.typeNo)
          } else {
            this.agGridLevel2.rowData = []
          }

          this.$q.loading.hide()
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Task_Collection_log 失敗!')
          this.$q.loading.hide()
        })
    },
    API_GET_Task_Collection_log_detail(url, search, pageNumber, pageSize, id, workshopTaskType) {
      let _this = this
      API_GET_Task_Collection_log_detail(url, search, pageNumber, pageSize, id, workshopTaskType)
        .then((res) => {
          console.log(res.data);
          this.agGridLevel2.rowData = res.data

          let pagination = JSON.parse(res.headers['x-pagination'])

          this.agGridLevel2.pagination.totalPages = pagination['totalPages']
          this.agGridLevel2.pagination.currentPage = pagination['currentPage']
          this.agGridLevel2.pagination.previousLink = pagination['previousLink']
          this.agGridLevel2.pagination.nextLink = pagination['nextLink']
          this.agGridLevel2.pagination.firstLink = pagination['firstLink']
          this.agGridLevel2.pagination.lastLink = pagination['lastLink']
          this.$q.loading.hide()
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Task_Collection_log_detail 失敗!')
          this.$q.loading.hide()
        })
    },
    API_GET_TaskType(url, search, pageNumber, pageSize) {
      let _this = this
      return new Promise((resolve, reject) => {
        API_GET_TaskType(url, search, pageNumber, pageSize)
          .then((res) => {
            console.log(res.data)
            this.taskTypeList = res.data
            this.taskTypeInput = res.data[0]
            resolve(true)
          })
          .catch((error) => {
            console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
            errorDetailMsg('API_GET_TaskType 失敗!')
            reject(false)
          })
      })
    },
    API_GET_QueryCategory() {
      let _this = this
      API_GET_QueryCategory()
        .then((res) => {
          // console.log(res.data);
          this.CollectionTypeConditionsList = res.data
          this.conditionsInput = res.data[0]
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_QueryCategory 失敗!')
        })
    },
    API_GET_ProductionEnv() {
      // 取得 是否為生產數據 下拉選單
      let _this = this
      API_GET_ProductionEnv()
        .then((res) => {
          console.log(res.data)
          this.conditionTargetList = res.data
          this.conditionTargetInput = res.data[0]
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_ProductionEnv 失敗!')
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
        return this.$t('TransactionInquiryPage.Yes')
      } else if (item.data.isProduction == false) {
        return this.$t('TransactionInquiryPage.No')
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
        field: 'situationTransl',
        headerName: this.$t('TransactionInquiryPage.Situation'),
        // valueFormatter: this.displayIsProductionFormatter,
      },
      {
        field: 'resultMessage',
        headerName: this.$t('TransactionInquiryPage.EquiptResMessage'),
        comparator: this.dateComparator,
      },
      {
        field: 'usageTime',
        headerName: this.$t('TransactionInquiryPage.EquiptMilliseconds'),
        comparator: this.dateComparator,
      },
      {
        field: 'createTime',
        headerName: this.$t('TransactionInquiryPage.CreateTime'),
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

    this.agGridLevel2.gridOptions = {}
    this.agGridLevel2.editType = 'fullRow' // 整排編輯
    this.agGridLevel2.columnDefs = [
      {
        field: 'equipmentNo',
        headerName: this.$t('TransactionInquiryPage.EquipmentNo'),
        width: 90,
      },
      {
        field: 'equipmentName',
        headerName: this.$t('TransactionInquiryPage.EquipmentName'),
        width: 90,
      },
      {
        field: 'dataNo',
        headerName: this.$t('TransactionInquiryPage.DataNo'),
        width: 90,
      },
      {
        field: 'dataValue',
        headerName: this.$t('TransactionInquiryPage.DataValue'),
        width: 90,
      },
      {
        field: 'categoryTransl',
        headerName: this.$t('TransactionInquiryPage.ParamType'), // 參數類型
        width: 90,
      },
      {
        field: 'createTime',
        headerName: this.$t('TransactionInquiryPage.CreateTime'),
        width: 90,
      },
    ]

    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.init()
  },
  beforeCreate() {},
  created() {
    // this.API_GET_QueryCategory()
    this.operatorsInput = {
      name: this.$t('TransactionInquiryPage.operators.equal'),
      name_en: 'Equal',
    }
  },
  setup() {
    return {}
  },
}
</script>
<style lang="sass" scoped>
@import 'src/css/app.sass'

.tableContainer
  height: calc( 100vh - 256px )

.tableContainer-changeHeight
  height: calc( 100vh - 170px )

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
