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

    <button
      class="btn btn-search"
      v-show="false"
      @click="openAddUserDialog()"
      :disabled="editDisable"
    >
      <span class="btn_title">{{ $t('Authority.btn.add') }}</span>
    </button>
    <q-space />

    <!--新增-->
    <div class="iconBtn" @click="openAddUserDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('Authority.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditUserDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('Authority.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelUserConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('Authority.btn.del') }}
      </q-tooltip>
    </div>
  </q-toolbar>

  <div class="q-pa-md" style="height: calc(100vh - 176px)">
    <ag-grid-vue
      style="width: 100%; height: 520px"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :editType="editType"
      :rowData="rowData"
      rowSelection="multiple"
      @selection-changed="onSelectionChanged"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
      :suppressRowClickSelection="true"
      :pagination="false"
      :paginationPageSize="paginationPageSize"
    ></ag-grid-vue>
    <div class="tablePagination">
      <span class="container">
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_Authority(this.firstLink)" />
        <img src="~assets/icons/png/previousPage.png" @click="API_GET_Authority(this.previousLink)" />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_Authority(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_Authority(this.lastLink)" />
      </span>
    </div>
  </div>

  <!-- 新增帳號 Dialog -->
  <q-dialog v-model="addUserDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('Authority.addAccount') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addAuthorityForm">
        <q-card-section class="dialog-content scroll">
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.inputUser.userAccount"
            :label="translated.userAccount"
            type="string"
            required
          />

          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.inputUser.userName"
            :label="translated.userName"
            type="string"
            required
          />

          <!--密碼-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('Authority.userPWD') }}
          </div>
          <div class="inputSmallBtn">
            <dw-input 
              :type="changePasswordInput(isPWDdisplay)" 
              v-model="dialogTable.inputUser.userPWD" 
              :rules="[this.lengthValidRule(), this.pwdCheckMatchRule()]"
            />
            <button>
              <img src="~assets/icons/png/eye-open.png" @click="isPWDdisplay = false" v-show="isPWDdisplay"/>
              <img src="~assets/icons/png/eye-close.png" @click="isPWDdisplay = true" v-show="!isPWDdisplay"/>
            </button>
          </div>

          <!--確認密碼-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('Authority.userPWDConfirm') }}
          </div>
          <div class="inputSmallBtn">
            <dw-input 
              :type="changePasswordInput(isConfirmPWDdisplay)" 
              v-model="dialogTable.inputUser.userPWDConfirm" 
              :rules="[this.lengthValidRule(), this.pwdCheckMatchRule()]"
            />
            <button>
              <img src="~assets/icons/png/eye-open.png" @click="isConfirmPWDdisplay = false" v-show="isConfirmPWDdisplay"/>
              <img src="~assets/icons/png/eye-close.png" @click="isConfirmPWDdisplay = true" v-show="!isConfirmPWDdisplay"/>
            </button>
          </div>
          
          <!--選擇人員權限-->
          <div style="margin: 26px 0 8px 0" class="label">
            {{ $t('Authority.userAuthority') }}
          </div>
          <div class="inputBtn" @click.stop.prevent="openTableDialog(1, this.dialogTable.authorityTable)">
            <input type="text" v-model="dialogTable.authorityInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--選擇人員群組-->
          <div style="margin: 26px 0 8px 0" class="label">
            {{ $t('Authority.userGroup') }}
          </div>
          <div class="inputBtn" @click.stop.prevent="openTableDialog(2, this.dialogTable.groupTable)">
            <input type="text" v-model="dialogTable.groupInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.OperateStatus') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuOperateStatus = !dispMenuOperateStatus">
              <input type="text" v-model="dialogTable.operateStatusInput.typeName" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuOperateStatus == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuOperateStatus == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuOperateStatus" @mouseleave="dispMenuOperateStatus = false">
              <li v-for="(item, key) in operateStatusList" :key="key" @click="changeOperateStatus(item)">
                <div class="bg">
                  <a>{{ item.typeName }}</a>
                </div>
              </li>
            </ul>
          </div>
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
            @click="API_POST_Authority(
              dialogTable.groupInput.typeNo, 
              dialogTable.authorityInput.typeNo,  
              dialogTable.operateStatusInput.typeNo, 
              dialogTable.inputUser.userName, 
              dialogTable.inputUser.userAccount, 
              dialogTable.inputUser.userPWD)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯用戶 Dialog -->
  <q-dialog v-model="editUserDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('Authority.editAccount') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editFactoyForm">
        <q-card-section class="dialog-content scroll">
          <div style="padding: 16px 0">
            <span>{{ $t('Authority.userAccount') }} :</span>
            <span>{{ dialogTable.inputUser.userAccount }}</span>
          </div>

          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.inputUser.userName"
            :label="translated.userName"
            type="string"
            required
          />

          <!--密碼-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('Authority.userPWD') }}
          </div>
          <div class="inputSmallBtn">
            <dw-input 
              :type="changePasswordInput(isPWDdisplay)" 
              v-model="dialogTable.inputUser.userPWD" 
              :rules="[this.lengthValidRule(), this.pwdCheckMatchRule()]"
            />
            <button>
              <img src="~assets/icons/png/eye-open.png" @click="isPWDdisplay = false" v-show="isPWDdisplay"/>
              <img src="~assets/icons/png/eye-close.png" @click="isPWDdisplay = true" v-show="!isPWDdisplay"/>
            </button>
          </div>

          <!--確認密碼-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('Authority.userPWDConfirm') }}
          </div>
          <div class="inputSmallBtn">
            <dw-input 
              :type="changePasswordInput(isConfirmPWDdisplay)" 
              v-model="dialogTable.inputUser.userPWDConfirm" 
              :rules="[this.lengthValidRule(), this.pwdCheckMatchRule()]"
            />
            <button>
              <img src="~assets/icons/png/eye-open.png" @click="isConfirmPWDdisplay = false" v-show="isConfirmPWDdisplay"/>
              <img src="~assets/icons/png/eye-close.png" @click="isConfirmPWDdisplay = true" v-show="!isConfirmPWDdisplay"/>
            </button>
          </div>
          
          <!--選擇人員權限-->
          <div style="margin: 26px 0 8px 0" class="label">
            {{ $t('Authority.userAuthority') }}
          </div>
          <div class="inputBtn" @click.stop.prevent="openTableDialog(1, this.dialogTable.authorityTable)">
            <input type="text" v-model="dialogTable.authorityInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--選擇人員群組-->
          <div style="margin: 26px 0 8px 0" class="label">
            {{ $t('Authority.userGroup') }}
          </div>
          <div class="inputBtn" @click.stop.prevent="openTableDialog(2, this.dialogTable.groupTable)">
            <input type="text" v-model="dialogTable.groupInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.OperateStatus') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuOperateStatus = !dispMenuOperateStatus">
              <input type="text" v-model="dialogTable.operateStatusInput.typeName" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuOperateStatus == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuOperateStatus == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuOperateStatus" @mouseleave="dispMenuOperateStatus = false">
              <li v-for="(item, key) in operateStatusList" :key="key" @click="changeOperateStatus(item)">
                <div class="bg">
                  <a>{{ item.typeName }}</a>
                </div>
              </li>
            </ul>
          </div>
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
            @click="API_PUT_Authority(
              selectedRows[0].id,
              dialogTable.groupInput.typeNo, 
              dialogTable.authorityInput.typeNo,  
              dialogTable.operateStatusInput.typeNo, 
              dialogTable.inputUser.userName, 
              dialogTable.inputUser.userPWD)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除用戶 Dialog -->
  <q-dialog v-model="delUserDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section>
        <div class="dialogTitle text-h6">{{ $t('Authority.delAccount') }}</div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">{{ $t('Authority.delSlectItem') }}</span>
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
          @click="API_DEL_Authority(this.selectedRows)"
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
        <div class="dialogTitle text-h6">{{ $t('Authority.Select') }}{{ dialogTable.title }}</div>
      </q-card-section>

      <q-card-section class="dialog-content">
        <div class="searchBar">
          <!--查詢-->
          <div class="searchContainer">
            <input
              class="searchInput"
              type="text"
              v-model="dialogTable.keyword"
              :placeholder="translated.input.pleaseEnter"
              id="quickFilter"
            />
            <button class="searchBtn" @click="onSearch_dialog(this.currentType, dialogTable.keyword)">
              <img src="~assets/icons/svg/search.svg" />
            </button>
          </div>
        </div>
        <!-- <div class="q-pa-md" style="height: calc(100vh - 176px)"> -->
        <ag-grid-vue
          style="width: 100%; height: calc(100vh - 206px)"
          class="ag-theme-alpine"
          :columnDefs="dialogTable.columnDefs"
          :defaultColDef="dialogTable.defaultColDef"
          :rowData="dialogTable.rowData"
          rowSelection="multiple"
          :gridOptions="dialogTable.gridOptions"
          @selection-changed="onDialogTableSelectionChanged"
          @grid-ready="onGridReady_dialog"
          @row-double-clicked="onCellDoubleClicked"
        ></ag-grid-vue>
        <div class="tablePagination_dialog">
          <span class="container">
            <img
              src="~assets/icons/svg/chevron_left.svg"
              @click="changePage_dialog(this.currentType, this.dialogTable.firstLink)"
            />
            <img
              src="~assets/icons/svg/chevron_left.svg"
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
              src="~assets/icons/svg/chevron_right.svg"
              @click="changePage_dialog(this.currentType, this.dialogTable.nextLink)"
            />
            <img
              src="~assets/icons/svg/chevron_right.svg"
              @click="changePage_dialog(this.currentType, this.dialogTable.lastLink)"
            />
          </span>
        </div>
        <!-- </div> -->
      </q-card-section>

      <q-card-actions align="between" v-if="currentType == 5">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          @click="setDialogInput(this.currentType, this.dialogTable.selectedRows)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>
<script>
import { ref, computed, nextTick, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dw_input from '../../components/input/input'
import dw_button from '../../components/button/button'
import ag_grid_table from '../../components/table/table'
import { add, errorDetailMsg } from '../../components/toolBox.js'
import { api } from 'boot/axios'
import { API_GET_Authority } from '../../api/Authority/API_GET_Authority'
import { API_POST_Authority } from '../../api/Authority/API_POST_Authority'
import { API_PUT_Authority } from '../../api/Authority/API_PUT_Authority'
import { API_DEL_Authority } from '../../api/Authority/API_DEL_Authority'
import { API_GET_UserLicense } from '../../api/Authority/API_GET_UserLicense'
import { API_GET_UserGourp } from '../../api/Authority/API_GET_UserGourp'
import { API_GET_OperateStatus } from '../../api/NetWorks/API_GET_OperateStatus'

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
      isPWDdisplay: false,
      isConfirmPWDdisplay: false,
      ag_gridDialog: false,
      dispMenuOperateStatus: false,
      operateStatusList: [],
      translated: {
        btn: {
          add: this.$t('Authority.btn.add'),
          edit: this.$t('Authority.btn.edit'),
          del: this.$t('Authority.btn.del'),
          confirm: this.$t('Authority.btn.confirm'),
          cancel: this.$t('Authority.btn.cancel'),
          save: this.$t('Authority.btn.save'),
        },
        input: {
          search: this.$t('Authority.input.search'),
          pleaseEnter: this.$t('Authority.input.pleaseEnter'),
        },
        userAccount: this.$t('Authority.userAccount'),
        userName: this.$t('Authority.userName'),
        userPWD: this.$t('Authority.userPWD'),
        userPWDConfirm: this.$t('Authority.userPWDConfirm'),
      },
      dialogTable: {
        gridOptions: null,
        gridApi: null,
        columnApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        inputUser: {
          userAccount: '',
          userName: '',
          userPWD: '',
          userPWDConfirm: '',
        },
        groupTable: [
          {
            field: 'typeName',
            headerName: this.$t('Authority.groupName'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        groupInput: {
          typeNo: null,
          typeName: null,
        },
        authorityTable: [
          {
            field: 'typeName',
            headerName: this.$t('Authority.authorityName'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        authorityInput: {
          typeNo: null,
          typeName: null,
        },
        operateStatusInput: {
          typeNo: null,
          typeName: null
        },
        selectedRows: [],
        currentPage: null,
        totalPages: null,
        previousLink: null,
        nextLink: null,
        firstLink: null,
        lastLink: null,
      },
      gridOptions: null, // ag-grid setting
      gridApi: null,
      columnDefs: null,
      defaultColDef: null,
      editType: null,
      rowData: null,
      columnApi: null,
      paginationPageSize: null,
      addUserDialog: false,
      editUserDialog: false,
      delUserDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDeluserAccount: '',
      selectedDelFactoryName: '',
      selectedRows: [],
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    lengthValidRule() {
      return val => val.length >= 4 || this.$t('Authority.PWDLengthShort')
    },
    pwdCheckMatchRule() { 
      return val => val == this.dialogTable.inputUser.userPWD || this.$t('Authority.PWDNotMatch')
    },
    clickEnterToChangePage(page) {
      this.API_GET_Authority('', '', page, this.paginationPageSize)
    },
    onSearch(keyword) {
      this.API_GET_Authority('', keyword, 1, this.paginationPageSize)
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
    onGridReady_dialog(params) {
      this.dialogTable.gridApi = params.api
      this.dialogTable.columnApi = params.columnApi
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      // console.log(this.currentType);
      this.dialogTable.selectedRows = params
      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.authorityInput = params.data
        } else if (this.currentType == 2) {
          this.dialogTable.groupInput = params.data
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDeluserAccount = this.selectedRows[0].factoryNo
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
    onDialogTableSelectionChanged() {
      this.dialogTable.selectedRows = []
      this.dialogTable.selectedRows = this.dialogTable.gridApi.getSelectedRows()
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => `${node.factoryNo} ${node.factoryName}`)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
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
        this.API_GET_UserLicense('', '', 1, 10)
        this.dialogTable.title = this.$t('Authority.userAuthority')
      } else if (type == 2) {
        this.currentType = 2
        this.API_GET_UserGourp('', '', 1, 10)
        this.dialogTable.title = this.$t('Authority.userGroup')
      }

      this.ag_gridDialog = true
    },
    openAddUserDialog() {
      this.addUserDialog = true
      this.dialogTable.inputUser.userAccount = null
      this.dialogTable.inputUser.userName = null
      this.dialogTable.inputUser.userPWD = null
      this.dialogTable.inputUser.userPWDConfirm = null
      this.dialogTable.authorityInput.typeNo = null
      this.dialogTable.authorityInput.typeName = null
      this.dialogTable.groupInput.typeNo = null
      this.dialogTable.groupInput.typeName = null

      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
    },
    openEditUserDialog() {
      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      console.log(selectedData[0])
      this.dialogTable.groupInput.typeNo = selectedData[0].groupType
      this.dialogTable.groupInput.typeName = selectedData[0].groupTransl
      this.dialogTable.authorityInput.typeNo = selectedData[0].licenseType
      this.dialogTable.authorityInput.typeName = selectedData[0].licenseTransl
      this.dialogTable.operateStatusInput.typeNo = selectedData[0].operateType
      this.dialogTable.operateStatusInput.typeName = selectedData[0].operateTransl
      this.dialogTable.inputUser.userName = selectedData[0].username
      this.dialogTable.inputUser.userAccount = selectedData[0].account

      this.editUserDialog = true
    },
    openDelUserConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }
      this.delUserDialog = true
    },
    changeOperateStatus(item) {
      this.dialogTable.operateStatusInput = item
      this.dispMenuOperateStatus = false
    },
    changePasswordInput(bool) {
      if (bool) {
        return 'text'
      } else {
        return 'password'
      }
    },
    changePage_dialog(currentType, type) {
      if (currentType == 1) {
        this.API_GET_UserLicense(type)
      } else if (currentType == 2) {
        this.API_GET_UserGourp(type)
      }
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    API_GET_UserLicense(url, search, pageNumber, pageSize) {
      // 取得用戶資料
      let _this = this
      API_GET_UserLicense(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data);
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
          errorDetailMsg('API_GET_Authority 失敗!')
        })
    },
    API_GET_UserGourp(url, search, pageNumber, pageSize) {
      // 取得用戶資料
      let _this = this
      API_GET_UserGourp(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data);
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
          errorDetailMsg('API_GET_Authority 失敗!')
        })
    },
    API_GET_Authority(url, search, pageNumber, pageSize) {
      // 取得用戶資料
      let _this = this
      API_GET_Authority(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data);
          this.rowData = res.data
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
          errorDetailMsg('API_GET_Authority 失敗!')
        })
    },
    API_POST_Authority(groupType, licenseType, operateType, username, account, password) {
      // 新增用戶
      this.$refs.addAuthorityForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_POST_Authority(groupType, licenseType, operateType, username, account, password)
            .then((res) => {
              this.API_GET_Authority('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('Authority.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addUserDialog = false // 關閉Dialog
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
    API_PUT_Authority(id, groupType, licenseType, operateType, username, password) {
      if (groupType == '' || groupType == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectGroup')) // 請選擇群組
        return null
      } else if (licenseType == '' || licenseType == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectAuthority')) // 請選擇權限
        return null
      } else if (username == '' || username == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseEnterUsername')) // 請輸入用戶名稱
        return null
      } else if (password == '' || password == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseEnterUserPWD')) // 請輸入密碼
        return null
      }
      // 更新用戶
      let _this = this
      this.$refs.editFactoyForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          API_PUT_Authority(id, groupType, licenseType, operateType, username, password)
            .then((res) => {
              this.API_GET_Authority('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('Authority.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editUserDialog = false // 關閉Dialog
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
    API_DEL_Authority(selectRow) {
      // 刪除用戶
      let _this = this
      let delItem = ''
      selectRow.forEach((item) => {
        delItem += item.id + ','
      })
      API_DEL_Authority(delItem)
        .then((res) => {
          this.API_GET_Authority('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('Authority.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.delUserDialog = false // 關閉Dialog
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
    API_GET_OperateStatus(url, search, pageNumber, pageSize) {
      let _this = this
      API_GET_OperateStatus(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data)
          this.operateStatusList = res.data
          if (
            this.dialogTable.operateStatusInput.typeNo == null ||
            this.dialogTable.operateStatusInput.typeNo == undefined
          ) {
            this.dialogTable.operateStatusInput.typeNo = res.data[0].typeNo
            this.dialogTable.operateStatusInput.typeName = res.data[0].typeName
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_OperateStatus 失敗!')
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
        field: 'username',
        headerName: this.$t('Authority.userName'),
        width: 90,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'account',
        headerName: this.$t('Authority.userAccount'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'licenseTransl',
        headerName: this.$t('Authority.userAuthority'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'operateTransl',
        headerName: this.$t('Authority.userStatus'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'groupTransl',
        headerName: this.$t('Authority.userGroup'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'createTime',
        headerName: this.$t('Authority.CreateTime'),
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

    this.API_GET_Authority('', '', 1, this.paginationPageSize) // 取得工廠配置資料
  },
  beforeCreate() {},
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
      // addUserDialog: ref(false),
      // delUserDialog: ref(false),
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
