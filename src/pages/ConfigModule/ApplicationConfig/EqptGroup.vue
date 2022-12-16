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

    <q-space />

    <!--新增-->
    <div class="iconBtn" @click="openAddGroupDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT004.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditGroupDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT004.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelGroupConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT004.btn.del') }}
      </q-tooltip>
    </div>
  </q-toolbar>

  <div class="q-pa-md" style="height: 350px">
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
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_GROUP(this.firstLink)" />
        <img src="~assets/icons/png/previousPage.png" @click="API_GET_GROUP(this.previousLink)" />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_GROUP(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_GROUP(this.lastLink)" />
      </span>
    </div>
  </div>

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
          @click="API_GET_GROUP_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_GROUP_detail(this.agGridLevel2.pagination.previousLink)"
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
          @click="API_GET_GROUP_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_GROUP_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增區域 Dialog -->
  <q-dialog v-model="addGroupDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT004.addGroup') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addGroupForm">
        <q-card-section class="dialog-content scroll">
          <!--選擇工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT004.Factory') }}
          </div>
          <div class="inputBtn" @click.stop.prevent="openTableDialog(1, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <dw-input
            style="margin-bottom: 16px"
            v-model="inputArea.no"
            :label="translated.groupNo"
            type="string"
            required
          />

          <dw-input
            style="margin-bottom: 16px"
            v-model="inputArea.name"
            :label="translated.groupName"
            type="string"
            @keydown.enter="API_POST_GROUP(inputArea.no, inputArea.name)"
            required
          />
        </q-card-section>

        <q-separator />

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
            @click="API_POST_GROUP(inputArea.no, inputArea.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯區域 Dialog -->
  <q-dialog v-model="editGroupDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT004.editGroup') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editGroupForm">
        <q-card-section class="dialog-content scroll">
          <!--選擇工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT004.Factory') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(1, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <div style="padding: 16px 0">
            <span>{{ translated.groupNo }} :</span>
            <span>{{ inputArea.no }}</span>
          </div>

          <dw-input
            style="margin-bottom: 16px"
            v-model="inputArea.name"
            :label="translated.groupName"
            type="string"
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
            @click="API_PUT_GROUP(this.selectedRows[0].id, inputArea.no, inputArea.name, this.dialogTable.factoryInput.id)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除工廠配置資料 Dialog -->
  <q-dialog v-model="delGroupDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT004.delGroup') }}</div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">{{ $t('IIOT004.delSlectItem') }}</span>
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
          @click="API_DEL_GROUP(this.selectedRows)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ag-grid Dialog -->
  <q-dialog class="customDialog" v-model="ag_gridDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section class="dialog-title">
        <button class="prevBtn" v-close-popup>
          <img src="~assets/icons/svg/chevron_left.svg" />
        </button>
        <div class="dialogTitle text-h6">{{ dialogTable.title }}</div>
      </q-card-section>

      <q-card-section class="dialog-content">
        <div class="searchBar">
          <!--查詢-->
          <div class="searchContainer">
            <input
              class="searchInput"
              type="text"
              v-model="keyword"
              :placeholder="translated.input.pleaseEnter"
              id="quickFilter"
            />
            <button class="searchBtn" @click="onSearch_dialog(this.currentType, keyword)">
              <img src="~assets/icons/svg/search.svg" />
            </button>
          </div>
        </div>
        <ag-grid-vue
          style="width: 100%; height: calc(100vh - 206px)"
          class="ag-theme-alpine"
          :columnDefs="dialogTable.columnDefs"
          :defaultColDef="dialogTable.defaultColDef"
          :rowData="dialogTable.rowData"
          rowSelection="multiple"
          :gridOptions="dialogTable.gridOptions"
          @grid-ready="onGridReady_dialog"
          @row-double-clicked="onCellDoubleClicked"
        ></ag-grid-vue>
        <div class="tablePagination_dialog">
          <span class="container">
            <img
              src="~assets/icons/png/firstPage.png"
              @click="changePage_dialog(this.currentType, this.dialogTable.firstLink)"
            />
            <img
              src="~assets/icons/png/previousPage.png"
              @click="changePage_dialog(this.currentType, this.dialogTable.previousLink)"
            />
            <input
              type="text"
              v-model="this.dialogTable.currentPage"
              oninput="value = value.replace(/[^\d]/g,'')"
              @keypress.enter="
                clickEnterToChangePage_dialog(this.currentType, this.dialogTable.currentPage)
              "
            />
            <span class="slash">/</span>
            <span class="totalPages">{{ dialogTable.totalPages }}</span>
            <img
              src="~assets/icons/png/nextPage.png"
              @click="changePage_dialog(this.currentType, this.dialogTable.nextLink)"
            />
            <img
              src="~assets/icons/png/lastPage.png"
              @click="changePage_dialog(this.currentType, this.dialogTable.lastLink)"
            />
          </span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../../../components/input/input'
import dw_button from '../../../components/button/button'
import ag_grid_table from '../../../components/table/table'
import { errorDetailMsg } from '../../../components/toolBox.js'
import { API_GET_FACTORY } from '../../../api/Factory/API_GET_FACTORY'
import { API_GET_GROUP } from '../../../api/EqptGroup/API_GET_GROUP'
import { API_GET_GROUP_detail } from '../../../api/EqptGroup/API_GET_GROUP_detail'
import { API_GET_GROUP_EDIT } from '../../../api/EqptGroup/API_GET_GROUP_EDIT'
import { API_POST_GROUP } from '../../../api/EqptGroup/API_POST_GROUP'
import { API_PUT_GROUP } from '../../../api/EqptGroup/API_PUT_GROUP'
import { API_DEL_GROUP } from '../../../api/EqptGroup/API_DEL_GROUP'
import { api } from 'boot/axios'

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
          add: this.$t('IIOT004.btn.add'),
          edit: this.$t('IIOT004.btn.edit'),
          del: this.$t('IIOT004.btn.del'),
          confirm: this.$t('IIOT004.btn.confirm'),
          cancel: this.$t('IIOT004.btn.cancel'),
          save: this.$t('IIOT004.btn.save'),
        },
        input: {
          search: this.$t('IIOT004.input.search'),
          pleaseEnter: this.$t('IIOT004.input.pleaseEnter'),
        },
        groupNo: this.$t('IIOT004.GroupNo'),
        groupName: this.$t('IIOT004.GroupName'),
      },
      inputArea: {
        no: '',
        name: '',
      },
      dispMenuFactory: false,
      dropdownMenuFactoryName: '', // 工廠下拉選單預設值
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
      addGroupDialog: false,
      editGroupDialog: false,
      delGroupDialog: false,
      ag_gridDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDelGroupNo: '',
      selectedDelGroupName: '',
      selectedRows: [],
      factoryList: [],
      currentType: null,
      dialogTable: {
        gridOptions: null,
        gridApi: null,
        columnApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        factoryTable: [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT004.FactoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT004.FactoryName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        factoryInput: {
          id: null,
          factoryNo: null,
          factoryName: null,
        },
        selectedRows: [],
        currentPage: null,
        totalPages: null,
        previousLink: null,
        nextLink: null,
        firstLink: null,
        lastLink: null,
      },
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    clickEnterToChangePage(page) {
      this.API_GET_GROUP('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_GROUP_detail('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePage_dialog(currentType, page) {
      if (currentType == 1) {
        this.API_GET_FACTORY('', '', page, 10)
      } else if (currentType == 3) {
        this.API_GET_GROUP('', '', page, 10)
      }
    },
    onSearch(keyword) {
      this.API_GET_GROUP('', keyword, 1, this.paginationPageSize)
    },
    onSearch_dialog(currentType, keyword) {
      if (currentType == 1) {
        this.API_GET_FACTORY('', keyword, 1, 10)
      } else if (currentType == 3) {
        this.API_GET_GROUP('', keyword, 1, 10)
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
    onGridReady_dialog(params) {
      this.dialogTable.gridApi = params.api
      this.dialogTable.columnApi = params.columnApi
    },
    onCellClicked(params) {
      console.log('Cell was clicked')
      console.log(params)
      this.dialogTable.selectedRows = params

      this.API_GET_GROUP_detail('', '', 1, this.paginationPageSize, params.data.id)
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      this.dialogTable.selectedRows = params

      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.factoryInput = params.data
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()
      console.log(this.selectedRows[0])
      if (this.selectedRows.length != 0) {
        this.API_GET_GROUP_detail('', '', 1, this.paginationPageSize, this.selectedRows[0].id)
      }

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDelGroupNo = this.selectedRows[0].groupNo
        this.selectedDelGroupName = this.selectedRows[0].groupName
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
        .map((node) => `${node.groupNo} ${node.groupName}`)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
    },
    onBtStopEditing() {
      this.gridApi.stopEditing()
    },
    onBtStartEditing(index) {
      this.gridApi.setFocusedCell(index, 'groupNo')
      this.gridApi.startEditingCell({
        rowIndex: index,
        colKey: 'groupNo',
      })
    },
    onFilterTextBoxChanged() {
      this.gridOptions.api.setQuickFilter(document.getElementById('filter-text-box').value)
    },
    addColumn() {
      this.rowData.push({
        groupNo: '',
        groupName: '',
        ownedFactory: '',
        recentlyUpdatedStaff: 'test',
        date: this.getTodayDate(),
      })
      this.gridOptions.api.setRowData(this.rowData)
      console.log(this.rowData)
    },
    getTodayDate() {
      let fullDate = new Date()
      let yyyy = fullDate.getFullYear()
      let MM = fullDate.getMonth() + 1 >= 10 ? fullDate.getMonth() + 1 : '0' + (fullDate.getMonth() + 1)
      let dd = fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()
      let today = dd + '/' + MM + '/' + yyyy
      return today
    },
    onSelectionFactory(event) {},
    openAddGroupDialog() {
      this.submitting = false
      this.addGroupDialog = true
      this.inputArea.no = null
      this.inputArea.name = null
      this.dialogTable.factoryInput.id = null
      this.dialogTable.factoryInput.factoryNo = null
      this.dialogTable.factoryInput.factoryName = null

      this.API_GET_FACTORY('', '', 1, this.paginationPageSize)
    },
    openEditGroupDialog() {
      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }

      this.dialogTable.factoryInput.factoryNo = null
      this.dialogTable.factoryInput.factoryName = null

      this.dialogTable.factoryInput.id = selectedData[0].factoryId
      this.inputArea.no = selectedData[0].groupNo
      this.inputArea.name = selectedData[0].groupName

      this.API_GET_GROUP_EDIT('', selectedData[0].id)

      this.editGroupDialog = true
    },
    openDelGroupConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }
      this.delGroupDialog = true
    },
    openTableDialog(type, tableColumn) {
      this.dialogTable.gridOptions = {}
      this.dialogTable.editType = 'fullRow' // 整排編輯
      this.dialogTable.paginationPageSize = 10 // 預設顯示資料筆數

      this.dialogTable.columnDefs = tableColumn

      this.defaultColDef = {
        flex: 1,
        editable: false,
        sortable: true,
      }

      if (type == 1) {
        this.currentType = 1
        this.API_GET_FACTORY('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT004.Factory')
      }

      this.ag_gridDialog = true
    },
    changeOwnFactory(item) {
      this.dropdownMenuFactoryName = item.factoryName
      this.dispMenuFactory = false
    },
    changePage_dialog(currentType, type) {
      if (currentType == 1) {
        this.API_GET_FACTORY(type)
      } else if (currentType == 3) {
        this.API_GET_GROUP(type)
      }
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
          this.dialogTable.rowData = res.data
          let pagination = JSON.parse(res.headers['x-pagination'])
          this.dialogTable.totalPages = pagination['totalPages']
          this.dialogTable.currentPage = pagination['currentPage']
          this.dialogTable.previousLink = pagination['previousLink']
          this.dialogTable.nextLink = pagination['nextLink']
          this.dialogTable.firstLink = pagination['firstLink']
          this.dialogTable.lastLink = pagination['lastLink']
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_FACTORY 失敗!')
        })
    },
    API_GET_GROUP(url, search, pageNumber, pageSize) {
      // 取得區域配置資料
      let _this = this
      API_GET_GROUP(url, search, pageNumber, pageSize)
        .then((res) => {
          // console.log(res.data);
          this.rowData = res.data
          if (res.data.length != 0) {
            this.API_GET_GROUP_detail('', '', 1, this.paginationPageSize, res.data[0].id)
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
          errorDetailMsg('API_GET_GROUP 失敗!')
        })
    },
    API_POST_GROUP(groupNo, groupName) {
      // 新增區域配置資料
      this.$refs.addGroupForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          if (
            this.dialogTable.factoryInput.id == null ||
            this.dialogTable.factoryInput.id == undefined
          ) {
            this.$q.notify({
              color: 'negative',
              position: 'bottom',
              message: this.$t('IIOT004.warnMSG.pleaseSelectFactoryFirst'),
              icon: 'report_problem',
            })
            this.submitting = false
            return null
          }

          let _this = this
          API_POST_GROUP(groupNo, groupName, this.dialogTable.factoryInput.id)
            .then((res) => {
              this.API_GET_GROUP('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT004.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addGroupDialog = false // 關閉Dialog
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
    API_PUT_GROUP(id, groupNo, groupName, factoryId) {
      // 更新區域資料
      let _this = this
      this.$refs.editGroupForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          API_PUT_GROUP(
            id,
            groupNo,
            groupName,
            factoryId
          )
            .then((res) => {
              this.API_GET_GROUP('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT004.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.editGroupDialog = false // 關閉Dialog
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
    API_DEL_GROUP(selectRowArea) {
      let _this = this
      let delItem = ''
      selectRowArea.forEach((item) => {
        delItem += item.id + ','
      })

      API_DEL_GROUP(delItem)
        .then((res) => {
          this.API_GET_GROUP('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT004.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.delGroupDialog = false // 關閉Dialog
          }, 1000)
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg(error.response.data.message)
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
      setTimeout(() => {
        this.onSelectionChanged()
      }, 500)
    },
    API_GET_GROUP_detail(url, search, pageNumber, pageSize, id) {
      let _this = this
      API_GET_GROUP_detail(url, search, pageNumber, pageSize, id)
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
          errorDetailMsg('API_GET_GROUP_detail 失敗!')
        })
    },
    API_GET_GROUP_EDIT(url, id) {
      let _this = this
      API_GET_GROUP_EDIT(url, id)
        .then((res) => {
          console.log(res.data);
          this.dialogTable.factoryInput.id = res.data.factoryId
          this.dialogTable.factoryInput.factoryNo = res.data.factoryNo
          this.dialogTable.factoryInput.factoryName = res.data.factoryName
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_GROUP_EDIT 失敗!')
        })
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
  },
  computed: {},
  created() {},
  mounted() {
    this.gridApi = this.gridOptions.api
  },
  beforeMount() {
    this.gridOptions = {}
    this.editType = 'fullRow' // 整排編輯
    this.paginationPageSize = 10 // 預設顯示資料筆數
    this.columnDefs = [
      {
        field: 'groupNo',
        headerName: this.$t('IIOT004.GroupNo'),
        width: 90,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'groupName',
        headerName: this.$t('IIOT004.GroupName'),
        width: 90,
        editable: false,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT004.Creator'),
        width: 90,
        editable: false,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT004.CreateTime'),
        comparator: this.dateComparator,
        editable: false,
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
        field: 'equipmentNo',
        headerName: this.$t('IIOT004.EquipmentNo'),
        width: 90,
        editable: false,
      },
      {
        field: 'equipmentName',
        headerName: this.$t('IIOT004.EquipmentName'),
        width: 90,
        editable: false,
      },
      {
        field: 'sessionNo',
        headerName: this.$t('IIOT004.SessionNo'),
        width: 90,
        editable: false,
      },
      {
        field: 'sessionName',
        headerName: this.$t('IIOT004.SessionName'),
        width: 90,
        editable: false,
      },
      {
        field: 'networkTransl',
        headerName: this.$t('IIOT004.NetworkType'),
        width: 90,
        editable: false,
      },
    ]

    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.API_GET_GROUP('', '', 1, this.paginationPageSize)
  },
  beforeCreate() {},
  setup() {},
}
</script>
<style lang="sass">
@import 'src/css/app.sass'
.q-table__container
  // margin: 16px
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

.dialogSelect
  display: flex
  flex-direction: column
  height: 68px
  .selectTitle
    height: 34px
    line-height: 34px
  select
    width: 100%
    height: 34px
    border-radius: 4px
    border: 1px solid $color-stroke
    option
      height: 34px

.dropdownMenu
  width: 556px
  height: 34px
  .input
    position: relative
    width: 100%
    input
      cursor: pointer
      width: 100%
      height: 34px
      padding: 0 0 0 8px
      z-index: -10
      border: 1px solid $color-stroke
      border-radius: 4px
      // background-color: red
    .arrowIcon
      position: absolute
      width: 24px
      height: 24px
      transform: translate(-32px, 5px)
      cursor: pointer
      // border: 1px solid red
  .selectMenu
    position: fixed
    display: flex
    flex-direction: column
    width: inherit
    // height: 250px
    max-height: 250px
    padding: 0
    margin: 0
    overflow-y: auto
    z-index: 9999
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px
    background-color: white
    li
      list-style-type: none
      cursor: pointer
      width: 100%
      height: 34px
      line-height: 34px
      // border: 1px solid red
      // background-color: black
      .bg
        width: 100%
        height: 100%
        transition: 0.2s
        a
          margin: 0 0 0 10px
          color: $color-black
          text-decoration: none
        &:hover
          background-color: $color-row-hover
          a
            font-size: 14px
            color: white
</style>
