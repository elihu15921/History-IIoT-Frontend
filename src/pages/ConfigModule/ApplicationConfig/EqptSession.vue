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
    <div class="iconBtn" @click="openAddEqptBoxDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT005.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditEqptBoxDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT005.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelAreaConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT005.btn.del') }}
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
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_Networks(this.firstLink)" />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_Networks(this.previousLink)"
        />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_Networks(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_Networks(this.lastLink)" />
      </span>
    </div>
  </div>
  <!-- height: calc(100vh - 500px)" -->
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
          @click="API_GET_Networks_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_Networks_detail(this.agGridLevel2.pagination.previousLink)"
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
          @click="API_GET_Networks_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_Networks_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增設備聯網 Dialog -->
  <q-dialog v-model="addEqptSessionDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT005.addEqptSession') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="addEqptSessionForm">
        <q-card-section class="dialog-content scroll">
          <!--聯網類型-->
          <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('IIOT005.NetworkType') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(1, this.dialogTable.sessionTable)">
            <input type="text" v-model="dialogTable.networkTransl" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--聯網編號-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.sessionInput.typeNo"
            :label="translated.SessionNo"
            type="string"
            required
          />

          <!--聯網名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.sessionInput.typeName"
            :label="translated.SessionName"
            type="string"
            @keydown.enter="API_POST_Networks(dialogTable.sessionInput.typeNo, dialogTable.sessionInput.typeName)"
            required
          />

          <template v-if="dialogTable.networkType == 102">
            <!--新增 選擇 MQTT 客戶端-->
            <div style="margin: 8px 0 8px 0" class="label">
              {{ $t('IIOT005.ClientName') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(2, this.dialogTable.clientTable)">
              <input type="text" v-model="protocolDeploy.customerTransl" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>

            <!--IP-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputIP"
              label="IP"
              type="string"
              required
            />

            <!--Port-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPort"
              label="Port"
              type="text"
              onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
              required
            />

            <!--Username-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputUsername"
              label="Username"
              type="string"
            />

            <!--Password-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPassword"
              label="Password"
              type="string"
            />
          </template>

          <!--OPCUA-->
          <template
            v-else-if="
              dialogTable.networkType == 103
            "
          >
            <!--endpoint-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputEndpoint"
              label="Endpoint"
              type="string"
              required
            />

            <!--Username-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputUsername"
              label="Username"
              type="string"
            />

            <!--Password-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPassword"
              label="Password"
              type="string"
            />
          </template>

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
            @click="API_POST_Networks(dialogTable.networkType, dialogTable.sessionInput)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯設備協議 Dialog -->
  <q-dialog v-model="editEqptSessionDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT005.editEqptSession') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="editEqptSessionForm">
        <q-card-section class="dialog-content scroll">
          <!--聯網類型-->
          <div style="padding: 16px 0">
            <span>{{ $t('IIOT005.NetworkType') }} :</span>
            <span>{{ dialogTable.networkTransl }}</span>
          </div>

          <!--聯網編號-->
          <div style="padding: 16px 0">
            <span>{{ translated.SessionNo }} :</span>
            <span>{{ dialogTable.sessionInput.typeNo }}</span>
          </div>

          <!--聯網名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.sessionInput.typeName"
            :label="translated.SessionName"
            type="string"
            required
          />

          <template v-if="dialogTable.networkType == 102">
            <!--編輯 選擇 MQTT 客戶端-->
            <div style="margin: 8px 0 8px 0" class="label">
              {{ $t('IIOT005.ClientName') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(2, this.dialogTable.clientTable)">
              <input type="text" v-model="protocolDeploy.customerTransl" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>

            <!--IP-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputIP"
              label="IP"
              type="string"
              required
            />

            <!--Port-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPort"
              label="Port"
              type="text"
              onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
              required
            />

            <!--Username-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputUsername"
              label="Username"
              type="string"
            />

            <!--Password-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPassword"
              label="Password"
              type="string"
            />
          </template>

          <!--OPCUA-->
          <template
            v-else-if="
              dialogTable.networkType == 103
            "
          >
            <!--endpoint-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputEndpoint"
              label="Endpoint"
              type="string"
              required
            />

            <!--Username-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputUsername"
              label="Username"
              type="string"
            />

            <!--Password-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="protocolDeploy.inputPassword"
              label="Password"
              type="string"
            />
          </template>
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
            @click="API_PUT_Networks(dialogTable.networkType, dialogTable.sessionInput)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 配置協議 Dialog -->
  <q-dialog v-model="deployEqptBoxDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT005.editEqptBasicInfo') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="editDeployParamForm">
        <q-card-section class="dialog-content scroll">
          <!--OPCUA endpoint-->
          <dw-input
            v-if="protocolDeploy.currentSession == 'OPCUA'"
            style="margin-bottom: 16px"
            v-model="protocolDeploy.inputEndpoint"
            label="Endpoint"
            type="string"
            required
          />

          <!--Username-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="protocolDeploy.inputUsername"
            label="Username"
            type="string"
            required
          />

          <!--Password-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="protocolDeploy.inputPassword"
            label="Password"
            type="string"
            required
          />

          <span v-if="protocolDeploy.currentSession == 'MQTT'">
            {{ protocolDeploy.currentSession }}
            {{ $t('IIOT005.NoConfigRequired') }}
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
            :label="translated.btn.save"
            :loading="submitting"
            :disable="disableSaveBtn"
            @click="
              checkEqptSessionRecord(
                selectedRows[0].typeName,
                selectedRows[0].protocolGuid,
                selectedRows[0].guid,
                selectProtocolDeployGuid
              )
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除工廠配置資料 Dialog -->
  <q-dialog v-model="delAreaDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT005.delEqptSession') }}
        </div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">
          {{ $t('IIOT005.delSlectItem') }}
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
          :loading="submitting"
          @click="API_DEL_Networks(this.selectedRows)"
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
        <div class="dialogTitle text-h6">{{ $t('IIOT005.Select') }}{{ dialogTable.title }}</div>
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
        <!-- <div class="q-pa-md" style="height: calc(100vh - 176px)"> -->
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

      <!-- <q-card-actions align="between">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          @click="
            setDialogInput(this.currentType, this.dialogTable.selectedRows)
          "
        />
      </q-card-actions> -->
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
import { api } from 'boot/axios'
import { API_GET_Networks } from '../../../api/NetWorks/API_GET_Networks'
import { API_GET_Networks_detail } from '../../../api/NetWorks/API_GET_Networks_detail'
import { API_GET_Networks_EDIT } from '../../../api/NetWorks/API_GET_Networks_EDIT'
import { API_POST_Networks } from '../../../api/NetWorks/API_POST_Networks'
import { API_PUT_Networks } from '../../../api/NetWorks/API_PUT_Networks'
import { API_DEL_Networks } from '../../../api/NetWorks/API_DEL_Networks'
import { API_GET_IndustrialProtocol } from '../../../api/NetWorks/API_GET_IndustrialProtocol'
import { API_GET_ClientName } from '../../../api/NetWorks/API_GET_ClientName'

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
          add: this.$t('IIOT005.btn.add'),
          edit: this.$t('IIOT005.btn.edit'),
          del: this.$t('IIOT005.btn.del'),
          confirm: this.$t('IIOT005.btn.confirm'),
          cancel: this.$t('IIOT005.btn.cancel'),
          save: this.$t('IIOT005.btn.save'),
        },
        input: {
          search: this.$t('IIOT005.input.search'),
          pleaseEnter: this.$t('IIOT005.input.pleaseEnter'),
        },
        EquipmentNo: this.$t('IIOT005.EquipmentNo'),
        EquipmentName: this.$t('IIOT005.EquipmentName'),
        EquipmentCategory: this.$t('IIOT005.EquipmentCategory'),
        SessionNo: this.$t('IIOT005.SessionNo'),
        SessionName: this.$t('IIOT005.SessionName'),
        without: this.$t('IIOT005.Without'),
      },
      dispMenuFactory: false,
      dropdownMenuFactoryName: '', // 工廠下拉選單預設值
      selectedOwnFactory: null, // 下拉選單所選擇的工廠
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
      addEqptSessionDialog: false,
      editEqptSessionDialog: false,
      deployEqptBoxDialog: false,
      delAreaDialog: false,
      ag_gridDialog: false,
      editDisable: true,
      delDisable: true,
      selecteddelSessionNo: '',
      selecteddelSessionName: '',
      selectedRows: [],
      factoryList: [],
      currentType: null,
      isFirstSetting: null,
      selectProtocolDeployGuid: null,
      disableSaveBtn: false,
      dialogTable: {
        gridOptions: null,
        gridApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        sessionTable: [
          {
            field: 'typeName',
            headerName: this.$t('IIOT005.NetworkType'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        clientTable: [
          {
            field: 'typeName',
            headerName: this.$t('IIOT005.ClientName'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        networkType: null,
        networkTransl: null,
        sessionInput: {
          typeNo: null,
          typeName: null,
        },
        equipmentBasicInfoInput: {
          id: null,
          equipmentNo: null,
          equipmentName: null,
        },
        selectedRows: [],
        currentPage: null,
        totalPages: null,
        previousLink: null,
        nextLink: null,
        firstLink: null,
        lastLink: null,
      },
      protocolDeploy: {
        currentSession: null,
        inputEndpoint: null,
        inputIP: null,
        inputPort: null,
        inputUsername: null,
        inputPassword: null,
        customerType: null,
        customerTransl: null,
      },
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    errorDetailMsg(msg) {
      this.$q.notify({
        color: 'negative',
        position: 'bottom',
        message: msg,
        icon: 'report_problem',
      })
    },
    clickEnterToChangePage(page) {
      this.API_GET_Networks('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_Networks_detail('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePage_dialog(currentType, page) {
      if (currentType == 1) {
        this.API_GET_DeviceCategory('', '', page, 10)
      } else if (currentType == 2) {
        this.API_GET_FACTORY('', '', page, 10)
      } else if (currentType == 3) {
        this.API_GET_GROUP('', '', page, 10)
      }
    },
    onSearch(keyword) {
      this.API_GET_Networks('', keyword, 1, this.paginationPageSize)
    },
    onSearch_dialog(currentType, keyword) {
      if (currentType == 1) {
        this.API_GET_DeviceCategory('', keyword, 1, 10)
      } else if (currentType == 2) {
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
      this.dialogTable.gridApi = params.api
      this.dialogTable.columnApi = params.columnApi
    },
    onGridReady_dialog(params) {
      this.dialogTable.gridApi = params.api
      this.dialogTable.columnApi = params.columnApi
    },
    onCellClicked(params) {
      console.log('Cell was clicked')
      console.log(params)
      this.dialogTable.selectedRows = params

      this.API_GET_Networks_detail(
        '',
        '',
        1,
        this.paginationPageSize,
        params.data.id,
        params.data.networkType
      )
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      this.dialogTable.selectedRows = params
      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.networkTransl = params.data.typeName
          this.dialogTable.networkType = params.data.typeNo
        }
        if (this.currentType == 2) {
          this.protocolDeploy.customerType = params.data.typeNo
          this.protocolDeploy.customerTransl = params.data.typeName
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()
      console.log(this.selectedRows)

      if (this.selectedRows.length != 0) {
        this.API_GET_Networks_detail(
          '',
          '',
          1,
          this.paginationPageSize,
          this.selectedRows[0].id,
          this.selectedRows[0].networkType
        )
      }

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selecteddelSessionNo = this.selectedRows[0].sessionNo
        this.selecteddelSessionName = this.selectedRows[0].sessionName
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
    openAddEqptBoxDialog() {
      this.addEqptSessionDialog = true

      // 清空欄位
      this.dialogTable.sessionInput = {
        typeNo: null,
        typeName: null,
      }
      this.protocolDeploy.inputEndpoint = null
      this.protocolDeploy.inputUsername = null
      this.protocolDeploy.inputPassword = null
      this.protocolDeploy.inputIP = null
      this.protocolDeploy.inputPort = null
      this.protocolDeploy.customerType = null
      this.protocolDeploy.customerTransl =  null

    },
    openEditEqptBoxDialog() {
      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      console.log(selectedData[0])

      this.API_GET_Networks_EDIT(
        '',
        selectedData[0].networkType,
        selectedData[0].id
      ) // 取得設備信息 ex: endpoint

      this.editEqptSessionDialog = true
    },
    openDelAreaConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }
      this.delAreaDialog = true
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
        this.API_GET_IndustrialProtocol('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT005.NetworkType')
      }
      //client
      else if (type == 2) {
        this.currentType = 2
        this.API_GET_ClientName('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT005.Client')
      }
      //else if (type == 3) {
      //   this.currentType = 3;
      //   this.API_GET_GROUP("", "", 1, 10);
      //   this.dialogTable.title = this.$t("IIOT005.Area");
      // }
      this.ag_gridDialog = true
    },
    setDialogInput(currentType, item) {
      if (item.length != 0) {
        if (currentType == 1) {
          this.dialogTable.sessionInput = item.data
        }
      }

      this.ag_gridDialog = false
    },
    changeOwnFactory(item) {
      this.dropdownMenuFactoryName = item.factoryName
      this.selectedOwnFactory = item
      this.dispMenuFactory = false
    },
    changePage_dialog(currentType, type) {
      console.log(currentType)
      console.log(type)
      if (currentType == 1) {
        this.API_GET_DeviceCategory(type)
      } else if (currentType == 2) {
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
    checkEqptSessionRecord(typeName, protocolGuid, boxGuid, protocolDeployGuid) {
      if (this.isFirstSetting) {
        this.API_POST_PROTOCOL_DEPLOY(typeName, protocolGuid, boxGuid)
      } else {
        this.API_PUT_PROTOCOL_DEPLOY(typeName, protocolGuid, boxGuid, protocolDeployGuid)
      }
    },
    API_GET_IndustrialProtocol(url, search, pageNumber, pageSize) {
      // 聯網類型
      let _this = this
      API_GET_IndustrialProtocol(url, search, pageNumber, pageSize)
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
          errorDetailMsg('API_GET_IndustrialProtocol 失敗!')
        })
    },
    API_GET_ClientName(url, search, pageNumber, pageSize) {
      // 取得 客戶名稱
      let _this = this
      API_GET_ClientName(url, search, pageNumber, pageSize)
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
          errorDetailMsg('API_GET_ClientName 失敗!')
        })
    },
    API_GET_Networks(url, search, pageNumber, pageSize) {
      // 取得設備盒子配置資料
      let _this = this
      API_GET_Networks(url, search, pageNumber, pageSize)
        .then((res) => {
          console.table(res.data)
          this.rowData = res.data
          if (res.data.length != 0) {
            this.API_GET_Networks_detail(
              '',
              '',
              1,
              this.paginationPageSize,
              res.data[0].id,
              res.data[0].networkType
            )
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
          errorDetailMsg('API_GET_Networks 失敗!')
        })
    },
    API_POST_Networks(networkType, sessionInput) {
      let _this = this
      // 新增聯網資料
      this.$refs.addEqptSessionForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          if (networkType == null || networkType == undefined) {
            errorDetailMsg(this.$t('IIOT005.warnMSG.pleaseSelectProtocolFirst'))
            this.submitting = false
            return null
          }

          let parameter = {}
          if (networkType == 102) {
            parameter = {
              ip: this.protocolDeploy.inputIP,
              port: this.protocolDeploy.inputPort,
              customerType: this.protocolDeploy.customerType,
              username: this.protocolDeploy.inputUsername,
              password: this.protocolDeploy.inputPassword,
            }
          } else if (networkType == 103) { // OPCUA
            parameter = {
              endpoint: this.protocolDeploy.inputEndpoint,
              username: this.protocolDeploy.inputUsername,
              password: this.protocolDeploy.inputPassword,
            }
          }

          API_POST_Networks(sessionInput.typeNo, sessionInput.typeName, networkType, parameter)
            .then((res) => {
              this.API_GET_Networks('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT005.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addEqptSessionDialog = false // 關閉Dialog
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
    API_PUT_Networks(networkType, sessionInput) {
      // 更新設備協議資料
      let _this = this
      this.$refs.editEqptSessionForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          let detail = {}
          if (networkType == 102) {
            detail = {
              ip: this.protocolDeploy.inputIP,
              port: this.protocolDeploy.inputPort,
              customerType: this.protocolDeploy.customerType,
              username: this.protocolDeploy.inputUsername,
              password: this.protocolDeploy.inputPassword,
            }
          } else if (networkType == 103) { // OPCUA
            detail = {
              endpoint: this.protocolDeploy.inputEndpoint,
              username: this.protocolDeploy.inputUsername,
              password: this.protocolDeploy.inputPassword,
            }
          }

          API_PUT_Networks(
            this.selectedRows[0].id,
            sessionInput.typeNo,
            sessionInput.typeName,
            networkType,
            detail
          )
            .then((res) => {
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT005.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editEqptSessionDialog = false // 關閉Dialog
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
        this.API_GET_Networks('', '', 1, this.paginationPageSize)
        this.onSelectionChanged()
      }, 1500)
    },
    API_DEL_Networks(selectRowBox) {
      let _this = this
      let delItem = ''
      selectRowBox.forEach((item) => {
        delItem += item.id + ','
      })

      API_DEL_Networks(delItem)
        .then((res) => {
          this.API_GET_Networks('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT005.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.delAreaDialog = false // 關閉Dialog
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
    API_GET_Networks_detail(url, search, pageNumber, pageSize, id, networkType) {
      let _this = this
      API_GET_Networks_detail(url, search, pageNumber, pageSize, id)
        .then((res) => {
          console.log(res.data);
          let result = []
          if (res.data.length != 0) {
            this.dialogTable.networkType = res.data[0].networkType
            this.dialogTable.sessionInput.typeNo = res.data[0].sessionNo
            this.dialogTable.sessionInput.typeName = res.data[0].sessionName
          }
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
          errorDetailMsg('API_GET_Networks_detail 失敗!')
        })
    },
    API_GET_Networks_EDIT(url, networkType, id) {
      let _this = this
      API_GET_Networks_EDIT(url, networkType, id)
        .then((res) => {
          console.log(res.data)
          
          this.dialogTable.sessionInput.typeNo = res.data.sessionNo
          this.dialogTable.sessionInput.typeName = res.data.sessionName
          this.dialogTable.networkType = res.data.networkType
          this.dialogTable.networkTransl = res.data.networkTransl

          if ( // MQTT
              networkType == 102
            ) {
              this.protocolDeploy.inputIP = res.data.detail.ip
              this.protocolDeploy.inputPort = res.data.detail.port
              this.protocolDeploy.inputUsername = res.data.detail.username
              this.protocolDeploy.inputPassword = res.data.detail.password
              this.protocolDeploy.customerType = res.data.detail.customerType
              this.protocolDeploy.customerTransl = res.data.detail.customerTransl

          } else if ( // OPCUA
            networkType == 103
          ) {
            this.protocolDeploy.inputEndpoint = res.data.detail.endpoint
            this.protocolDeploy.inputUsername = res.data.detail.username
            this.protocolDeploy.inputPassword = res.data.detail.password
          } else {

          }

        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Networks_EDIT 失敗!')
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
        field: 'sessionNo',
        headerName: this.$t('IIOT005.SessionNo'),
        width: 90,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'sessionName',
        headerName: this.$t('IIOT005.SessionName'),
        width: 90,
        editable: false,
      },
      {
        field: 'networkTransl',
        headerName: this.$t('IIOT005.NetworkType'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT005.Creator'),
        width: 90,
        editable: false,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT005.CreateTime'),
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
        field: 'groupNo',
        headerName: this.$t('IIOT005.GroupNo'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'equipmentNo',
        headerName: this.$t('IIOT005.EquipmentNo'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'equipmentName',
        headerName: this.$t('IIOT005.EquipmentName'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'operateTransl',
        headerName: this.$t('IIOT006.OperateStatus'),
        width: 90,
        editable: false,
      },
      {
        field: 'networkStatus',
        headerName: this.$t('IIOT005.NetworkStatus'),
        width: 90,
        editable: false,
        unSortIcon: true,
      },
    ]
    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.API_GET_Networks('', '', 1, this.paginationPageSize) // 取得工廠配置資料
  },
  beforeCreate() {},
  setup() {
    return {}
  },
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
  width: 434px
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
