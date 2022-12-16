<template>
  <q-toolbar class="toolPanel">
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

    <!-- v-on:input="onQuickFilterChanged()" ag-grid自帶過濾功能 -->

    <button
      class="btn btn-search"
      v-show="false"
      @click="openAddFactoryDialog()"
      :disabled="editDisable"
    >
      <span class="btn_title">{{ $t('IIOT003.btn.add') }}</span>
    </button>

    <!-- <button class="btn btn-search" v-show="true" @click="test()">
      <span class="btn_title">{{ $t("IIOT003.btn.add") }}</span>
    </button> -->

    <!--查詢全部資料-->
    <!-- <dw-button
      class="button-theme bg-primary button-margin"
      label="查詢全部"
      style="margin-right: 10px"
      @click="API_GET_FACTORY()"
    >
    </dw-button> -->

    <q-space />

    <!--新增-->
    <div class="iconBtn" @click="openAddFactoryDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT003.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditFactoryDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT003.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelFactoryConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT003.btn.del') }}
      </q-tooltip>
    </div>
  </q-toolbar>

  <div class="q-pa-md" style="height: 350px">
    <!-- <div style="margin-bottom: 5px">
      <button @click="addColumn()">add Rows</button>
      <button @click="getSelectedRows()">Get Selected Rows</button>
      <button style="font-size: 12px" v-on:click="onBtStartEditing(1)">
        Start Editing Line 2
      </button>
      <button style="font-size: 12px" v-on:click="onBtStopEditing()">
        Stop Editing
      </button>
      <select v-on:change="onPageSizeChanged()" id="page-size">
        <option value="10" selected="">10</option>
        <option value="100">100</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
      </select>
    </div> -->

    <!-- <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <div class="dialogTitle text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="dialogTitle text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="dialogTitle text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card> -->

    <!-- <div style="height: 100%">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        id="myGrid"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
      ></ag-grid-vue>
    </div> -->

    <ag-grid-vue
      style="width: 100%; height: 300px"
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
    <div class="tablePagination">
      <span class="container">
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_FACTORY(this.firstLink)" />
        <img src="~assets/icons/png/previousPage.png" @click="API_GET_FACTORY(this.previousLink)" />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_FACTORY(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_FACTORY(this.lastLink)" />
      </span>
    </div>
  </div>

  <!--下表-->
  <div class="q-pa-md" style="height: calc(100vh - 530px)">
    <ag-grid-vue
      style="width: 100%; height: 350px"
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
          @click="API_GET_FACTORY_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_FACTORY_detail(this.agGridLevel2.pagination.previousLink)"
        />
        <input
          type="text"
          v-model="this.agGridLevel2.pagination.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePageLevel2(this.agGridLevel2.pagination.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ agGridLevel2.pagination.totalPages }}</span>
        <img
          src="~assets/icons/png/nextPage.png"
          @click="API_GET_FACTORY_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_FACTORY_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增工廠 Dialog -->
  <q-dialog v-model="addFactoryDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT003.addFactory') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addFactoryForm">
        <q-card-section class="dialog-content scroll">
          <dw-input
            class="testinput"
            style="margin-bottom: 16px"
            v-model="inputFactory.no"
            :label="translated.factoryNo"
            type="string"
            required
          />

          <dw-input
            v-model="inputFactory.name"
            :label="translated.factoryName"
            type="string"
            @keydown.enter="API_POST_FACTORY(inputFactory.no, inputFactory.name)"
            required
          />
        </q-card-section>

        <q-card-actions align="between">
          <dw-button
            class="button-theme text-white button-theme-del"
            :label="translated.btn.cancel"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.save"
            :loading="submitting"
            @click="API_POST_FACTORY(inputFactory.no, inputFactory.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯工廠 Dialog -->
  <q-dialog v-model="editFactoryDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT003.editFactory') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editFactoyForm">
        <q-card-section class="dialog-content scroll">
          <div style="padding: 16px 0">
            <span>{{ $t('IIOT003.FactoryNo') }} :</span>
            <span>{{ inputFactory.no }}</span>
          </div>

          <dw-input
            v-model="inputFactory.name"
            :label="translated.factoryName"
            type="string"
            @keydown.enter="API_PUT_FACTORY(inputFactory.no, inputFactory.name)"
          />
        </q-card-section>

        <q-card-actions align="between">
          <dw-button
            class="button-theme text-white button-theme-del"
            :label="translated.btn.cancel"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.save"
            @click="API_PUT_FACTORY(inputFactory.no, inputFactory.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除工廠配置資料 Dialog -->
  <q-dialog v-model="delFactoryDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section>
        <div class="dialogTitle text-h6">{{ $t('IIOT003.delFactory') }}</div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">
          {{ $t('IIOT003.delSlectItem') }}
        </span>
      </q-card-section>

      <q-card-actions align="between">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          @click="API_DEL_FACTORY(this.selectedRows)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../../../components/input/input'
import dw_button from '../../../components/button/button'
import ag_grid_table from '../../../components/table/table'
import { add, errorDetailMsg } from '../../../components/toolBox.js'
import { api } from 'boot/axios'
import { API_GET_FACTORY } from '../../../api/Factory/API_GET_FACTORY'
import { API_POST_FACTORY } from '../../../api/Factory/API_POST_FACTORY'
import { API_PUT_FACTORY } from '../../../api/Factory/API_PUT_FACTORY'
import { API_DEL_FACTORY } from '../../../api/Factory/API_DEL_FACTORY'
import { API_GET_FACTORY_detail } from '../../../api/Factory/API_GET_FACTORY_detail'
import GenderRenderer from './genderRendererVue.js'
import MoodRenderer from './moodRendererVue.js'
import BtnCellRenderer from './btn-cell-renderer.js';

export default {
  components: {
    AgGridVue,
    'dw-input': dw_input,
    'dw-button': dw_button,
    'ag-grid-table': ag_grid_table,
    genderCellRenderer: GenderRenderer,
    moodCellRenderer: MoodRenderer,
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
          add: this.$t('IIOT003.btn.add'),
          edit: this.$t('IIOT003.btn.edit'),
          del: this.$t('IIOT003.btn.del'),
          confirm: this.$t('IIOT003.btn.confirm'),
          cancel: this.$t('IIOT003.btn.cancel'),
          save: this.$t('IIOT003.btn.save'),
        },
        input: {
          search: this.$t('IIOT003.input.search'),
          pleaseEnter: this.$t('IIOT003.input.pleaseEnter'),
        },
        factoryNo: this.$t('IIOT003.FactoryNo'),
        factoryName: this.$t('IIOT003.FactoryName'),
      },
      inputFactory: {
        no: '',
        name: '',
      },
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
      agGridLevel2: { // 下表
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
    test() {
      let columnDefs = this.gridOptions.api.getColumnDefs()
      // columnDefs.forEach((item, index) => { // 修改欄位名稱
      //   item.headerName = "C" + index;
      // });

      // 重新組成欄位
      columnDefs = [
        {
          field: 'factoryNo',
          headerName: this.$t('IIOT003.FactoryNo'),
          width: 90,
        },
      ]

      this.gridOptions.api.setColumnDefs(columnDefs)
    },
    clickEnterToChangePage(page) {
      this.API_GET_FACTORY('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_GROUP_detail('', '', page, this.paginationPageSize)
    },
    onSearch(keyword) {
      this.API_GET_FACTORY('', keyword, 1, this.paginationPageSize)
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
      this.selectedRows = params
      this.API_GET_FACTORY_detail('', '', 1, this.paginationPageSize, params.data.id)
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
      // document.querySelector('#selectedRows').innerHTML =
      //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
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
      // let today = dd + "/" + MM + "/" + yyyy;
      let today = yyyy + '/' + MM + '/' + dd
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
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    API_GET_FACTORY(url, search, pageNumber, pageSize) {
      // 取得工廠配置資料
      let _this = this
      API_GET_FACTORY(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data);
          this.rowData = res.data
          if (res.data.length != 0) {
            this.API_GET_FACTORY_detail('', '', 1, this.paginationPageSize, res.data[0].id)
          } else {
            this.agGridLevel2.rowData = []
          }

          let pagination = JSON.parse(res.headers['x-pagination'])
          this.totalPages = pagination['totalPages']
          this.currentPage = pagination['currentPage']
          this.previousLink = pagination['previousLink']
          this.nextLink = pagination['nextLink']
          this.firstLink = pagination['firstLink']
          this.lastLink = pagination['lastLink']
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_FACTORY 失敗!')
        })
    },
    API_POST_FACTORY(factoryNo, factoryName) {
      // 新增工廠配置資料
      this.$refs.addFactoryForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          // 新增一筆工廠配置資料
          let _this = this
          API_POST_FACTORY(factoryNo, factoryName)
            .then((res) => {
              this.API_GET_FACTORY('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT003.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addFactoryDialog = false // 關閉Dialog
              }, 1000)
            })
            .catch((error) => {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              errorDetailMsg(error.response.data.message)
              setTimeout(() => {
                _this.submitting = false
              }, 1000)
            })
        }
      })
    },
    API_PUT_FACTORY(factoryNo, factoryName) {
      // 更新工廠資料
      let _this = this
      this.$refs.editFactoyForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          API_PUT_FACTORY(this.selectedRows[0].id, factoryNo, factoryName)
            .then((res) => {
              this.API_GET_FACTORY('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT003.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editFactoryDialog = false // 關閉Dialog
              }, 1000)
            })
            .catch((error) => {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              errorDetailMsg(error.response.data.message)
              setTimeout(() => {
                _this.submitting = false
              }, 1000)
            })
        }
      })
      setTimeout(() => {
        this.onSelectionChanged()
      }, 500)
    },
    API_DEL_FACTORY(selectRowFactory) {
      let _this = this
      let delItem = ''
      selectRowFactory.forEach((item) => {
        delItem += item.id + ','
      })

      API_DEL_FACTORY(delItem)
        .then((res) => {
          this.API_GET_FACTORY('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT003.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.delFactoryDialog = false // 關閉Dialog
          }, 1000)
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg(error.response.data.message)
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })

      // const url = `/factory/informations/${delItem}`;
      // api
      //   .delete(url, {
      //     headers: {
      //       Authorization: "Bearer " + localStorage.getItem("token"),
      //       "Accept-Language": localStorage.getItem("lang"),
      //       accept: "application/json",
      //     },
      //   })
      //   .then((res) => {
      //     this.API_GET_FACTORY("", "", 1, this.paginationPageSize);
      //     this.$q.notify({
      //       color: "green",
      //       position: "bottom",
      //       message: this.$t("IIOT003.notifyMsg.delSucess"), // 刪除成功
      //       icon: "check_circle_outline",
      //     });

      //     selectRowFactory.forEach((ele) => {
      //       this.rowData.forEach((item, index) => {
      //         if (ele.id == item.id) {
      //           this.rowData.splice(index, 1);
      //         }
      //       });
      //     });
      //     this.gridOptions.api.setRowData(this.rowData);
      //     this.delFactoryDialog = false;
      //   })
      //   .catch(function (error) {
      //     console.error("[錯誤訊息] " + error); //失敗的話回傳錯誤訊息
      //     _this.$q.notify({
      //       color: "negative",
      //       position: "bottom",
      //       message: _this.$t("IIOT003.notifyMsg.delFail"), // 刪除失敗
      //       icon: "report_problem",
      //     });
      //   });
      setTimeout(() => {
        this.onSelectionChanged()
      }, 500)
    },
    API_GET_FACTORY_detail(url, search, pageNumber, pageSize, id) {
      let _this = this
      API_GET_FACTORY_detail(url, search, pageNumber, pageSize, id)
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
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_FACTORY_detail 失敗!')
        })
    },
  },
  computed: {},
  mounted() {
    this.gridApi = this.gridOptions.api
  },
  beforeMount() {
    this.gridOptions = {}
    this.editType = 'fullRow' // 整排編輯
    this.paginationPageSize = 10 // 預設顯示資料筆數

    this.columnDefs = [
      {
        field: 'factoryNo',
        headerName: this.$t('IIOT003.FactoryNo'),
        width: 90,
        // cellEditor: "agSelectCellEditor", // 下拉選單
        // cellEditorParams: { // 下拉選單選項
        //   values: ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"],
        // },
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
        // cellClassRules: {
        //   'rag-green': 'x < 20',
        //   'rag-amber': 'x >= 20 && x < 25',
        //   'rag-red': 'x >= 25',
        // },

        // cellRenderer: BtnCellRenderer, 
        // cellRendererParams: {
        //   clicked: function(field) {
        //     alert(`${field} was clicked`);
        //   }
        // }
      },
      {
        field: 'factoryName',
        headerName: this.$t('IIOT003.FactoryName'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT003.Creator'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT003.CreateTime'),
        comparator: this.dateComparator,
        editable: false,
        unSortIcon: true,
      },
    ]

    this.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }
    this.agGridLevel2.gridOptions = {}
    this.agGridLevel2.editType = 'fullRow' // 整排編輯
    this.agGridLevel2.columnDefs = [
      {
        field: 'groupNo',
        headerName: this.$t('IIOT004.GroupNo'),
        width: 90,
        editable: false,
      },
      {
        field: 'groupName',
        headerName: this.$t('IIOT004.GroupName'),
        width: 90,
        editable: false,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT003.Creator'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT003.CreateTime'),
        comparator: this.dateComparator,
        editable: false,
        unSortIcon: true,
      },
    ]
    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.API_GET_FACTORY('', '', 1, this.paginationPageSize) // 取得工廠配置資料

    ////////////////////////
    // this.columnDefs = [
    //   { field: "value" },
    //   {
    //     headerName: "Rendered Value",
    //     field: "value",
    //     cellRenderer: 'moodCellRenderer'
    //     // cellRendererSelector:
    //     //  (params) => {
    //     //   const moodDetails = { frameworkComponent: "moodCellRenderer" };
    //     //   const genderDetails = {
    //     //     frameworkComponent: "genderCellRenderer",
    //     //     params: {
    //     //       values: ["Male", "Female"],
    //     //     },
    //     //   };
    //     //   if (params.data.type === "gender") {
    //     //     console.log(1111111);
    //     //     return genderDetails;
    //     //   } else if (params.data.type === "mood") return moodDetails;
    //     //   else return undefined;
    //     // },
    //   },
    //   { field: "type" },
    // ];
    // this.defaultColDef = { flex: 1 };
    // this.rowData = [
    //   {
    //     value: 14,
    //     type: "age",
    //   },
    //   {
    //     value: "female",
    //     type: "gender",
    //   },
    //   {
    //     value: "Happy",
    //     type: "mood",
    //   },
    //   {
    //     value: 21,
    //     type: "age",
    //   },
    //   {
    //     value: "male",
    //     type: "gender",
    //   },
    //   {
    //     value: "Sad",
    //     type: "mood",
    //   },
    // ];
  },
  beforeCreate() {
    console.log(this.$store.state.auth.me)
  },
  setup() {
    // provide("name", "James"); // vue3 寫法

    function loadData() {
      api
        .get('http://10.40.72.101:17770/api/WorkshopGatewaies', {
          headers: {
            authorization: 'Bearer ' + 'CGgGz2y5DZ3xFQ5ubOt5S268uvKONejWTDZn5v2ISewAWaGdGWsA2vq07pPQ',
            accept: 'application/json',
          },
        })
        .then((res) => console.log(res.data))
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          $q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API GET 失敗',
            icon: 'report_problem',
          })
        })
    }

    return {
      // addFactoryDialog: ref(false),
      // delFactoryDialog: ref(false),
      tab: ref('mails'),
      loadData,
    }
  },
}
window.cellClass = function cellClass(params) {
  return params.value === 'Swimming' ? 'rag-green' : 'rag-amber'
}
</script>
<style lang="sass">
@import 'src/css/app.sass'
.rag-red
  background-color: lightcoral
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
