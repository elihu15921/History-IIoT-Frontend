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
    <div class="iconBtn" @click="openAddEquipmentBasicInfoDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT006.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div
      class="iconBtn"
      @click="openEditEquipmentBasicInfoDialog()"
      :class="{ 'iconBtn-disable': editDisable }"
    >
      <img src="~assets/icons/svg/edit.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT006.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelAreaConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/svg/trash_white.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT006.btn.del') }}
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
      :rowClassRules="rowClassRules"
    ></ag-grid-vue>
    <div class="tablePagination">
      <span class="container">
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_EqptBasicInfo(this.firstLink)" />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_EqptBasicInfo(this.previousLink)"
        />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_EqptBasicInfo(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_EqptBasicInfo(this.lastLink)" />
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
          @click="API_GET_EqptBasicInfo_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_EqptBasicInfo_detail(this.agGridLevel2.pagination.previousLink)"
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
          @click="API_GET_EqptBasicInfo_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_EqptBasicInfo_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增設備基礎資料 Dialog -->
  <q-dialog v-model="addEquipmentBasicInfoDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT006.addEqptBasicInfo') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="addEqptBasicInfoForm">
        <q-card-section class="dialog-content scroll">

          <!--選擇設備類別-->
          <!-- <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('IIOT006.EquipmentCategory') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(1, this.dialogTable.equipmentCategoryTable)">
            <input type="text" v-model="dialogTable.equipmentCategoryInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div> -->

          <!--工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT006.FactoryNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(2, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--群組-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT006.GroupNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(3, this.dialogTable.areaTable)">
            <input type="text" v-model="dialogTable.groupInput.groupNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--聯網類型-->
          <div>
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT006.EqptSession') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(4, dialogTable.EqptSessionTable)">
              <input type="text" v-model="dialogTable.equiptProtocolInput.sessionNo" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
          </div>

          <!--設備編號-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentInput.equipmentNo"
            :label="translated.EquipmentNo"
            type="string"
            required
          />

          <!--設備名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
            @keydown.enter="API_POST_EqptBasicInfo(dialogTable.equipmentInput.equipmentNo, dialogTable.equipmentInput.equipmentName)"
            required
          />

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT005.OperateStatus') }}
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
            @click="
              API_POST_EqptBasicInfo(
                dialogTable.equipmentInput,
                dialogTable.groupInput,
                dialogTable.equiptProtocolInput,
                dialogTable.operateStatusInput
              )
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯設備基礎資料 Dialog -->
  <q-dialog v-model="editEquipmentBasicInfoDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT006.editEqptBasicInfo') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="editEqptBasicInfoForm">
        <q-card-section class="dialog-content scroll">
          

          <!--選擇設備類別-->
          <!-- <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('IIOT006.EquipmentCategory') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(1, this.dialogTable.equipmentCategoryTable)">
            <input type="text" v-model="dialogTable.equipmentCategoryInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div> -->

          <!--工廠編號-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT006.FactoryNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(2, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--群組編號-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT006.GroupNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(3, this.dialogTable.areaTable)">
            <input type="text" v-model="dialogTable.groupInput.groupNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--聯網編號-->
          <div>
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT006.SessionNo') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(4, dialogTable.EqptSessionTable)">
              <input type="text" v-model="dialogTable.sessionInput.sessionNo" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
          </div>

          <!--設備編號-->
          <div style="padding: 16px 0">
            <span>{{ translated.EquipmentNo }} :</span>
            <span>{{ dialogTable.equipmentInput.equipmentNo }}</span>
          </div>

          <!--設備名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
          />

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT005.OperateStatus') }}
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
            @click="
              API_PUT_EqptBasicInfo(
                dialogTable.equipmentInput,
                dialogTable.groupInput,
                dialogTable.equiptProtocolInput,
                dialogTable.operateStatusInput
              )
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除 Dialog -->
  <q-dialog v-model="delAreaDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT006.delEqptBasicInfo') }}
        </div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">
          {{ $t('IIOT006.delSlectItem') }}
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
          @click="API_DEL_EqptBasicInfo(this.selectedRows)"
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
        <div class="dialogTitle text-h6">{{ $t('IIOT006.Select') }}{{ dialogTable.title }}</div>
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
import { api } from 'boot/axios'
import { API_GET_FACTORY } from '../../../api/Factory/API_GET_FACTORY'
import { API_GET_GROUP } from '../../../api/EqptGroup/API_GET_GROUP'
import { API_GET_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo'
import { API_GET_EqptBasicInfo_detail } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo_detail'
import { API_GET_EqptBasicInfo_EDIT } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo_EDIT'
import { API_POST_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_POST_EqptBasicInfo'
import { API_PUT_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_PUT_EqptBasicInfo'
import { API_DEL_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_DEL_EqptBasicInfo'
import { API_GET_EqptCategory } from '../../../api/EqptBasicInfo/API_GET_EqptCategory'
import { API_GET_Networks } from '../../../api/NetWorks/API_GET_Networks'
import { API_GET_OperateStatus } from '../../../api/NetWorks/API_GET_OperateStatus'

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
          add: this.$t('IIOT006.btn.add'),
          edit: this.$t('IIOT006.btn.edit'),
          del: this.$t('IIOT006.btn.del'),
          confirm: this.$t('IIOT006.btn.confirm'),
          cancel: this.$t('IIOT006.btn.cancel'),
          save: this.$t('IIOT006.btn.save'),
        },
        input: {
          search: this.$t('IIOT006.input.search'),
          pleaseEnter: this.$t('IIOT006.input.pleaseEnter'),
        },
        EquipmentNo: this.$t('IIOT006.EquipmentNo'),
        EquipmentName: this.$t('IIOT006.EquipmentName'),
        EquipmentCategory: this.$t('IIOT006.EquipmentCategory'),
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
      rowClassRules: null,
      ragCellClassRules: null,
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
          currentPage: null,
          totalPages: null,
          previousLink: null,
          nextLink: null,
          firstLink: null,
          lastLink: null,
        },
      },
      rootName: this.rootName,
      addEquipmentBasicInfoDialog: false,
      editEquipmentBasicInfoDialog: false,
      delAreaDialog: false,
      ag_gridDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDelEqptBasicInfoNo: '',
      selectedDelEqptBasicInfoName: '',
      selectedRows: [],
      factoryList: [],
      currentType: null,
      dispMenuOperateStatus: false,
      operateStatusList: [],
      dialogTable: {
        gridOptions: null,
        gridApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        sessionInput: {
          typeNo: null,
          typeName: null,
        },
        equipmentInput: {
          equipmentNo: null,
          equipmentName: null
        },
        equipmentCategoryTable: [
          {
            field: 'typeName',
            headerName: this.$t('IIOT006.EquipmentCategoryName'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        equipmentCategoryInput: {
          typeNo: null,
          typeName: null,
        },
        factoryTable: [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT006.FactoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT006.FactoryName'),
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
        areaTable: [
          {
            field: 'groupNo',
            headerName: this.$t('IIOT006.GroupNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'groupName',
            headerName: this.$t('IIOT006.GroupName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        groupInput: {
          id: null,
          groupNo: null,
          groupName: null,
        },
        EqptSessionTable: [
          {
            field: 'sessionNo',
            headerName: this.$t('IIOT006.SessionNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'sessionName',
            headerName: this.$t('IIOT006.SessionName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'networkTransl',
            headerName: this.$t('IIOT006.NetworkType'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
            valueFormatter: this.displayEquiptProtocolFormatter,
          },
        ],
        equiptProtocolInput: {
          id: null,
          sessionNo: null,
          sessionName: null,
          connectionGuid: null,
        },
        categoryInput: {
          categoryType: null,
          categoryTransl: null
        },
        dataInput: {
          dataNo: null,
          dataValue: null
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
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    clickEnterToChangePage(page) {
      this.API_GET_EqptBasicInfo('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_EqptBasicInfo_detail('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePage_dialog(currentType, page) {
      if (currentType == 1) {
        this.API_GET_EqptCategory('', '', page, 10)
      } else if (currentType == 2) {
        this.API_GET_FACTORY('', '', page, 10)
      } else if (currentType == 3) {
        this.API_GET_GROUP('', '', page, 10)
      } else if (currentType == 4) {
        this.API_GET_Networks('', '', page, 10)
      }
    },
    onSearch(keyword) {
      this.API_GET_EqptBasicInfo('', keyword, 1, this.paginationPageSize)
    },
    onSearch_dialog(currentType, keyword) {
      if (currentType == 1) {
        this.API_GET_EqptCategory('', keyword, 1, 10)
      } else if (currentType == 2) {
        this.API_GET_FACTORY('', keyword, 1, 10)
      } else if (currentType == 3) {
        this.API_GET_GROUP('', keyword, 1, 10)
      } else if (currentType == 4) {
        this.API_GET_Networks('', keyword, 1, 10)
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
      this.API_GET_EqptBasicInfo_detail('', '', 1, this.paginationPageSize, params.data.equipmentNo, params.data.id)
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      this.dialogTable.selectedRows = params

      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.equipmentCategoryInput = params.data
        } else if (this.currentType == 2) {
          this.dialogTable.factoryInput = params.data
          this.dialogTable.groupInput = ''
        } else if (this.currentType == 3) {
          this.dialogTable.groupInput = params.data
        } else if (this.currentType == 4) {
          this.dialogTable.equiptProtocolInput = params.data
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()
      console.log(this.selectedRows[0])
      if (this.selectedRows.length != 0) {
        this.API_GET_EqptBasicInfo_detail('', '', 1, this.paginationPageSize, this.selectedRows[0].equipmentNo, this.selectedRows[0].id)
      }

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDelEqptBasicInfoNo = this.selectedRows[0].equipmentNo
        this.selectedDelEqptBasicInfoName = this.selectedRows[0].equipmentName
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
    openAddEquipmentBasicInfoDialog() {
      this.addEquipmentBasicInfoDialog = true

      // 清空欄位
      this.dialogTable.factoryInput.factoryNo = null
      this.dialogTable.factoryInput.factoryName = null
      this.dialogTable.groupInput.groupNo = null
      this.dialogTable.groupInput.groupName = null
      this.dialogTable.equipmentInput.equipmentNo = null
      this.dialogTable.equipmentInput.equipmentName = null
      this.dialogTable.equipmentCategoryInput.typeNo = null
      this.dialogTable.equipmentCategoryInput.typeName = null
      this.dialogTable.equiptProtocolInput.id = null
      this.dialogTable.equiptProtocolInput.sessionNo = null
      this.dialogTable.equiptProtocolInput.sessionName = null

      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
    },
    openEditEquipmentBasicInfoDialog() {
      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      console.log(selectedData[0])
      this.dialogTable.equipmentInput.equipmentNo = selectedData[0].equipmentNo
      this.dialogTable.equipmentInput.equipmentName = selectedData[0].equipmentName
      this.dialogTable.factoryInput.id = selectedData[0].factoryId
      this.dialogTable.groupInput.id = selectedData[0].groupId
      this.dialogTable.equipmentCategoryInput.typeNo = selectedData[0].equipmentCategoryType
      this.dialogTable.equiptProtocolInput.id = selectedData[0].networkId

      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
      this.API_GET_EqptBasicInfo_EDIT('', '', 1, this.paginationPageSize, selectedData[0].id)

      this.editEquipmentBasicInfoDialog = true
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

      this.currentType = type
      if (type == 1) {
        this.API_GET_EqptCategory('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT006.EquipmentCategory')
      } else if (type == 2) {
        this.API_GET_FACTORY('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT006.Factory')
      } else if (type == 3) {
        if (
          this.dialogTable.factoryInput.factoryName == null ||
          this.dialogTable.factoryInput.factoryName == undefined
        ) {
          errorDetailMsg(this.$t('IIOT006.warnMSG.pleaseSelectFactoryFirst'))
          return null
        }
        this.API_GET_GROUP('', '', 1, 10, this.dialogTable.factoryInput.id)
        this.dialogTable.title = this.$t('IIOT006.Group')
      } else if (type == 4) {
        this.API_GET_Networks('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT006.NetworkType')
        this.ag_gridDialog = true
      }

      this.ag_gridDialog = true
    },
    setDialogInput(currentType, item) {
      if (item.length != 0) {
        if (currentType == 1) {
          this.dialogTable.equipmentCategoryInput = item.data
        } else if (currentType == 2) {
          this.dialogTable.factoryInput = item.data
        } else if (currentType == 3) {
          this.dialogTable.groupInput = item.data
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
        this.API_GET_EqptCategory(type)
      } else if (currentType == 2) {
        this.API_GET_FACTORY(type)
      } else if (currentType == 3) {
        this.API_GET_GROUP(type)
      } else if (currentType == 4) {
        this.API_GET_Networks(type)
      }
    },
    changeOperateStatus(item) {
      this.dialogTable.operateStatusInput = item
      this.dispMenuOperateStatus = false
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
    API_GET_EqptCategory(url, search, pageNumber, pageSize) {
      // 取得設備類別配置資料
      let _this = this
      API_GET_EqptCategory(url, search, pageNumber, pageSize)
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
          errorDetailMsg('API_GET_EqptCategory 失敗!')
        })
    },
    API_GET_GROUP(url, search, pageNumber, pageSize, factoryId) {
      // 取得區域配置資料
      let _this = this
      API_GET_GROUP(url, search, pageNumber, pageSize, factoryId)
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
          errorDetailMsg('API_GET_GROUP 失敗!')
        })
    },
    API_GET_Networks(url, search, pageNumber, pageSize) {
      // 取得設備協議資料
      let _this = this
      API_GET_Networks(url, search, pageNumber, pageSize)
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
          errorDetailMsg('API_GET_Networks 失敗!')
        })
    },
    API_GET_EqptBasicInfo(url, search, pageNumber, pageSize) {
      // 取得設備基礎資料配置資料
      let _this = this
      API_GET_EqptBasicInfo(url, search, pageNumber, pageSize)
        .then((res) => {
          // console.log(res.data);
          this.rowData = res.data
          if (res.data.length != 0) {
            this.API_GET_EqptBasicInfo_detail('', '', 1, this.paginationPageSize, res.data[0].equipmentNo, res.data[0].id)
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
          errorDetailMsg('API_GET_EqptBasicInfo 失敗!')
        })
    },
    API_POST_EqptBasicInfo(equipmentInput, groupInput, equiptProtocolInput, operateStatusInput) {
      // 新增設備基礎資料配置資料
      this.$refs.addEqptBasicInfoForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          // if (this.dialogTable.equipmentCategoryInput.typeName == null) {
          //   errorDetailMsg(this.$t('IIOT006.warnMSG.pleaseSelectEqptCategoryFirst')) // 請選擇設備類別
          //   this.submitting = false
          //   return null
          // } else
          if (this.dialogTable.groupInput.id == null) {
            errorDetailMsg(this.$t('IIOT006.warnMSG.pleaseSelectAreaFirst')) // 請選擇區域
            this.submitting = false
            return null
          }

          let _this = this
          API_POST_EqptBasicInfo(
            equipmentInput.equipmentNo,
            equipmentInput.equipmentName,
            groupInput.id,
            equiptProtocolInput.id,
            operateStatusInput.typeNo
          )
            .then((res) => {
              this.API_GET_EqptBasicInfo('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT006.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addEquipmentBasicInfoDialog = false // 關閉Dialog
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
    API_PUT_EqptBasicInfo(equipmentInput, groupInput, equiptProtocolInput, operateStatusInput) {
      // 更新設備主檔
      let _this = this
      this.$refs.editEqptBasicInfoForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          API_PUT_EqptBasicInfo(
            this.selectedRows[0].id,
            equipmentInput.equipmentNo,
            equipmentInput.equipmentName,
            groupInput.id,
            equiptProtocolInput.id,
            operateStatusInput.typeNo
          )
            .then((res) => {
              this.API_GET_EqptBasicInfo('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT006.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.editEquipmentBasicInfoDialog = false // 關閉Dialog
                _this.submitting = false
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
    API_DEL_EqptBasicInfo(selectRowArea) {
      let _this = this
      let delItem = ''
      selectRowArea.forEach((item) => {
        delItem += item.id + ','
      })

      API_DEL_EqptBasicInfo(delItem)
        .then((res) => {
          this.API_GET_EqptBasicInfo('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT006.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.delAreaDialog = false // 關閉Dialog
            this.onSelectionChanged()
          }, 1000)
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg(error.response.data.message)
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
    },
    API_GET_EqptBasicInfo_detail(url, search, pageNumber, pageSize, equipmentNo, id) {
      let _this = this
      API_GET_EqptBasicInfo_detail(url, search, pageNumber, pageSize, equipmentNo, id)
        .then((res) => {
          console.log(res.data);
          this.agGridLevel2.rowData = res.data

          if (res.data.length != 0) {
            this.dialogTable.categoryInput.categoryType = res.data[0].categoryType
            this.dialogTable.categoryInput.categoryTransl = res.data[0].categoryTransl
            this.dialogTable.dataInput.dataNo = res.data[0].dataNo
            this.dialogTable.dataInput.dataValue = res.data[0].dataValue
          }

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
          errorDetailMsg('API_GET_EqptBasicInfo_detail 失敗!')
        })
    },
    API_GET_EqptBasicInfo_EDIT(url, search, pageNumber, pageSize, id) {
      let _this = this
      API_GET_EqptBasicInfo_EDIT(url, search, pageNumber, pageSize, id)
        .then((res) => {
          console.log(res.data);

          if (res.data.length != 0) {
            this.dialogTable.factoryInput.factoryNo = res.data.factoryNo
            this.dialogTable.factoryInput.factoryName = res.data.factoryName
            this.dialogTable.groupInput.groupNo = res.data.groupNo
            this.dialogTable.groupInput.groupName = res.data.groupName
            this.dialogTable.sessionInput.sessionNo = res.data.sessionNo
            this.dialogTable.sessionInput.sessionName = res.data.sessionName
            this.dialogTable.equipmentInput.equipmentNo = res.data.equipmentNo
            this.dialogTable.equipmentInput.equipmentName = res.data.equipmentName
            this.dialogTable.operateStatusInput.typeNo = res.data.operateType
            this.dialogTable.operateStatusInput.typeName = res.data.operateTransl
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EqptBasicInfo_EDIT 失敗!')
        })
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
    displayEquiptProtocolFormatter(item) {
      if (item.data.networkType == 0) {
        return this.$t('IIOT006.DisableCommServ')
      } else if (item.data.networkType == 10301) {
        return this.$t('IIOT006.MQTT')
      } else if (item.data.networkType == 10302) {
        return this.$t('IIOT006.OPCUA')
      } else if (item.data.networkType == 10303) {
        return this.$t('IIOT006.SOAP')
      }
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
    this.paginationPageSize = 50 // 預設顯示資料筆數

    this.columnDefs = [
      {
        field: 'equipmentNo',
        headerName: this.$t('IIOT006.EquipmentNo'),
        width: 90,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
        // cellClass: params => {
        //   console.log(params.data.equipmentNo)
        //   if (params.data.equipmentNo == "2")
        //     return ['rag-red'];
        // }
      },
      {
        field: 'equipmentName',
        headerName: this.$t('IIOT006.EquipmentName'),
        width: 90,
        editable: false,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT006.Creator'),
        width: 90,
        editable: false,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT006.CreateTime'),
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
        field: 'categoryTransl',
        headerName: this.$t('IIOT006.DataCategory'),
        width: 90,
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'dataNo',
        headerName: this.$t('IIOT006.DataNo'),
        width: 90,
        editable: false,
      },
      {
        field: 'dataValue',
        headerName: this.$t('IIOT006.DataValue'),
        width: 90,
        editable: false,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT006.CreateTime'),
        width: 90,
        editable: false,
      },
    ]
    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    // this.rowClassRules = {
    //   "sick-days-warning": (params) => {
    //     var numSickDays = params.data.equipmentNo;
    //     return numSickDays == "1";
    //   },
    //   "sick-days-breach": "data.sickDays >= 8",
    // };
    this.API_GET_EqptBasicInfo('', '', 1, this.paginationPageSize) // 取得工廠配置資料
  },
  beforeCreate() {},
  setup() {},
}
</script>
<style lang="sass">
@import 'src/css/app.sass'

.rag-red
  color: lightcoral

.sick-days-warning
  background-color: sandybrown !important

.sick-days-breach
  background-color: lightcoral !important

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
