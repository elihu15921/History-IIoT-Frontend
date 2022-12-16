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
    <div class="iconBtn" @click="getSelectedNode()">
      <img src="~assets/icons/svg/add.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('BCMI008.btn.add') }}
      </q-tooltip>
    </div>

    <!--新增-->
    <div class="iconBtn" @click="test()">
      <img src="~assets/icons/svg/add.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">測試</q-tooltip>
    </div>

    <!--新增-->
    <div class="iconBtn" @click="openAddContentRouterDialog()">
      <img src="~assets/icons/svg/add.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('BCMI008.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditEqptBoxDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/svg/edit.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('BCMI008.btn.edit') }}
      </q-tooltip>
    </div>

    <!--配置-->
    <div class="iconBtn" @click="openDeployEqptBoxDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/svg/icon_document_setting_1.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('BCMI008.btn.deploy') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelAreaConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/svg/trash_white.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('BCMI008.btn.del') }}
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
      @row-clicked="onCellClicked"
      :suppressRowClickSelection="true"
      :pagination="false"
      :paginationPageSize="paginationPageSize"
    ></ag-grid-vue>
    <div class="tablePagination">
      <span class="container">
        <img
          src="~assets/icons/svg/chevron_left.svg"
          @click="API_GET_ContentRouter(this.firstLink)"
        />
        <img
          src="~assets/icons/svg/chevron_left.svg"
          @click="API_GET_ContentRouter(this.previousLink)"
        />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img
          src="~assets/icons/svg/chevron_right.svg"
          @click="API_GET_ContentRouter(this.nextLink)"
        />
        <img
          src="~assets/icons/svg/chevron_right.svg"
          @click="API_GET_ContentRouter(this.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增內容路由 Dialog (第一步) -->
  <q-dialog v-model="addContentRouterDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.addContRouter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addEqptBasicInfoForm">
        <q-card-section class="dialog-content scroll">
          <!--第一步: 基礎資料-->
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('BCMI008.firstStep') }}: {{ $t('BCMI008.routerBasicInfo') }}
          </div>

          <!--內容路由類型-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('BCMI008.RoutingTyep') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuContRouterType = !dispMenuContRouterType">
              <input type="text" v-model="dialogTable.contentRouterInput.contentRouterType" readonly />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/up.svg"
                v-show="dispMenuContRouterType == true"
              />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuContRouterType == false"
              />
            </div>
            <ul
              class="selectMenu"
              v-if="dispMenuContRouterType"
              @mouseleave="dispMenuContRouterType = false"
            >
              <li v-for="(item, key) in paramTypeList" :key="key" @click="changeParamType(item)">
                <div class="bg">
                  <a>{{ item }}</a>
                </div>
              </li>
            </ul>
          </div>

          <!--內容路由編號-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.contentRouterInput.contentRouterNo"
            :label="translated.RoutingNo"
            type="string"
            required
          />

          <!--內容路由名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.contentRouterInput.contentRouterName"
            :label="translated.RoutingName"
            type="string"
            required
          />

          <!--報文類型-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('BCMI008.ImportFile') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuImportFile = !dispMenuImportFile">
              <input type="text" v-model="dialogTable.contentRouterInput.importFile" readonly />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/up.svg"
                v-show="dispMenuImportFile == true"
              />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuImportFile == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuImportFile" @mouseleave="dispMenuImportFile = false">
              <li v-for="(item, key) in importFileList" :key="key" @click="changeImportFile(item)">
                <div class="bg">
                  <a>{{ item }}</a>
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
            :label="translated.btn.next"
            :loading="submitting"
            @click="changeStep(2)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 新增內容路由 Dialog (第二步) -->
  <q-dialog v-model="addContentRouterDialog2" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.addContRouter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addEqptBasicInfoForm">
        <q-card-section class="dialog-content scroll">
          <!--第二步: 導入模板-->
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('BCMI008.secondStep') }}: {{ $t('BCMI008.importTemplate') }}
          </div>

          <div class="uploadFile">
            <!--報文模板-->
            <div class="subtitle">{{ $t('BCMI008.template') }} :</div>

            <input
              class="displayFileNameInput"
              type="text"
              v-model="selectedFileName"
              :placeholder="translated.input.clickBtnToUploadFile"
              id="quickFilter"
            />
            <a href="javascript:;">
              <input type="file" id="upload" @change="changeSelectFile($event)" hidden />
              <label for="upload" class="selectFileBtn">
                <img src="~assets/icons/svg/add.svg" class="selectFileImg" />
              </label>
            </a>
          </div>
        </q-card-section>

        <q-card-actions align="between">
          <dw-button
            class="button-theme text-white button-theme-del"
            :label="translated.btn.previous"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.next"
            :loading="submitting"
            @click="API_POST_UploadFile(selectedFile)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 新增內容路由 Dialog (第三步) -->
  <q-dialog v-model="addContentRouterDialog3" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.addContRouter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addEqptBasicInfoForm">
        <q-card-section class="scroll">
          <!--第三步: 節點配置參數-->
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('BCMI008.thirdStep') }}: {{ $t('BCMI008.selectNodeConfigParam') }}
          </div>

          <dw-button
            class="button-theme text-white button-theme-del"
            label="Alert"
            @click="alertTest()"
          />

          <dw-button
            class="button-theme text-white button-theme-del"
            label="Alert"
            @click="addNode(this.selected)"
          />

          <div class="q-pa-md" style="height: 300px; overflow-y: scroll; border: 1px solid red">
            <q-tree
              ref="tree"
              :nodes="simple"
              node-key="label"
              selected-color="primary"
              v-model:selected="selected"
              default-expand-all
            />
          </div>
        </q-card-section>

        <q-card-section style="height: 400px">
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
            <!--編輯-->
            <div
              class="iconBtn"
              @click="openEditNodeDialog()"
              :class="{ 'iconBtn-disable': dialogTable.editDisable }"
              style="margin: 0 0 0 8px"
            >
              <img src="~assets/icons/svg/edit.svg" />
              <q-tooltip anchor="bottom middle" :offset="[5, 5]">
                {{ $t('BCMI008.btn.edit') }}
              </q-tooltip>
            </div>
          </div>

          <ag-grid-vue
            style="width: 100%; height: 200px"
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
                v-model="this.currentPage"
                oninput="value = value.replace(/[^\d]/g,'')"
                @keypress.enter="clickEnterToChangePage_dialog(this.currentType, this.currentPage)"
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

        <q-card-actions align="between">
          <dw-button
            class="button-theme text-white button-theme-del"
            :label="translated.btn.previous"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.next"
            :loading="submitting"
            @click="API_POST_EqptBox(inputEqptBox.no, inputEqptBox.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 節點配置 Dialog -->
  <q-dialog v-model="editNodeDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.editNode') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editEqptBoxForm">
        <q-card-section class="dialog-content scroll">
          <!--節點編號-->
          <div style="padding: 16px 0">
            <span>{{ translated.NodeNo }} :</span>
            <span>{{ dialogTable.nodeInput.nodeNo }}</span>
          </div>

          <!--參數類型-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('BCMI008.ParamType') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuParamType = !dispMenuParamType">
              <input type="text" v-model="dialogTable.nodeInput.paramType" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuParamType == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuParamType == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuParamType" @mouseleave="dispMenuParamType = false">
              <li v-for="(item, key) in paramTypeList" :key="key" @click="changeContRouterType(item)">
                <div class="bg">
                  <a>{{ item }}</a>
                </div>
              </li>
            </ul>
          </div>

          <!--選擇參數-->
          <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('BCMI008.selectParam') }}
          </div>
          <div
            class="inputBtn"
            @click="openTableDialog(2, this.dialogTable.paramTale, this.dialogTable.selectedParamType)"
          >
            <input type="text" v-model="dialogTable.protocolInput.protocolName" readonly />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
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
            @click="API_PUT_EqptBox(inputEqptBox.no, inputEqptBox.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯內容路由 Dialog -->
  <q-dialog v-model="editEqptBoxDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.editEqptBasicInfo') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editEqptBoxForm">
        <q-card-section class="dialog-content scroll">
          <div style="padding: 16px 0">
            <span>{{ translated.EqptBoxNo }} :</span>
            <span>{{ inputEqptBox.no }}</span>
          </div>

          <!--內容路由描述-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="inputEqptBox.name"
            :label="translated.EqptBoxName"
            type="string"
            required
          />

          <div style="padding: 16px 0">
            <span>{{ $t('BCMI008.Protocol') }} :</span>
            <span>{{ dialogTable.protocolInput.protocolName }}</span>
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
            @click="API_PUT_EqptBox(inputEqptBox.no, inputEqptBox.name)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 配置協議 Dialog -->
  <q-dialog v-model="deployEqptBoxDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('BCMI008.editEqptBasicInfo') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editDeployParamForm">
        <q-card-section class="dialog-content scroll">
          <!--OPCUA endpoint URL-->
          <dw-input
            v-if="protocolDeploy.currentProtocol == 'OPCUA'"
            style="margin-bottom: 16px"
            v-model="protocolDeploy.inputEndpointURL"
            label="Endpoint URL"
            type="string"
            required
          />

          <span v-if="protocolDeploy.currentProtocol == 'MQTT'">
            {{ protocolDeploy.currentProtocol }}
            {{ $t('BCMI008.NoConfigRequired') }}
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
                selectedRows[0].protocolName,
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
        <div class="dialogTitle text-h6">{{ $t('BCMI008.delEqptBasicInfo') }}</div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">
          {{ $t('BCMI008.EqptBoxNo') }} : {{ selectedDelEqptBoxNo }}
        </span>
        <span>{{ $t('BCMI008.EqptBoxName') }} : {{ selectedDelEqptBoxName }}</span>
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
          @click="API_DEL_EqptBox(this.selectedRows)"
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
        <div class="dialogTitle text-h6">{{ $t('BCMI008.Select') }}{{ dialogTable.title }}</div>
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
          @grid-ready="onGridReady_dialog"
          @row-clicked="onCellClicked"
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
              v-model="this.currentPage"
              oninput="value = value.replace(/[^\d]/g,'')"
              @keypress.enter="clickEnterToChangePage_dialog(this.currentType, this.currentPage)"
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

      <q-card-actions align="between">
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
import dw_input from '../../../components/input/input'
import dw_button from '../../../components/button/button'
import ag_grid_table from '../../../components/table/table'
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
      splitterModel: 50,
      selected: 'Food',
      simple: [
        {
          label: 'Root',
          children: [
            {
              label: 'Food',
              children: [
                {
                  label: 'Quality ingredients',
                  paramType: '',
                  paramValue: '',
                },
                {
                  label: 'Good recipe',
                  paramType: '',
                  paramValue: '',
                },
              ],
            },
            {
              label: 'Room service',
              paramType: '',
              paramValue: '',
            },
            {
              label: 'Room view',
              paramType: '',
              paramValue: '',
            },
          ],
        },
      ],
      testArray: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
      keyword: null,
      currentPage: null,
      totalPages: null,
      previousLink: null,
      nextLink: null,
      firstLink: null,
      lastLink: null,
      submitting: false,
      selectedFile: null,
      selectedFileName: null,
      translated: {
        page: {
          title:
            this.$t('BCMI008.ConfigModule') +
            ' | ' +
            this.$t('BCMI008.FactorySetting') +
            ' | ' +
            this.$t('BCMI008.EqptGroup'),
        },
        btn: {
          add: this.$t('BCMI008.btn.add'),
          edit: this.$t('BCMI008.btn.edit'),
          del: this.$t('BCMI008.btn.del'),
          confirm: this.$t('BCMI008.btn.confirm'),
          cancel: this.$t('BCMI008.btn.cancel'),
          save: this.$t('BCMI008.btn.save'),
          next: this.$t('BCMI008.btn.next'),
          previous: this.$t('BCMI008.btn.previous'),
        },
        input: {
          search: this.$t('BCMI008.input.search'),
          pleaseEnter: this.$t('BCMI008.input.pleaseEnter'),
          clickBtnToUploadFile: this.$t('BCMI008.clickBtnToUploadFile'),
        },
        EquipmentNo: this.$t('BCMI008.EquipmentNo'),
        EquipmentName: this.$t('BCMI008.EquipmentName'),
        EquipmentCategory: this.$t('BCMI008.EquipmentCategory'),
        EqptBoxNo: this.$t('BCMI008.EqptBoxNo'),
        EqptBoxName: this.$t('BCMI008.EqptBoxName'),
        RoutingNo: this.$t('BCMI008.RoutingNo'),
        RoutingName: this.$t('BCMI008.RoutingName'),
        RoutingTyep: this.$t('BCMI008.RoutingTyep'),
        MessageType: this.$t('BCMI008.MessageType'),
        NodeNo: this.$t('BCMI008.NodeNo'),
        Port: this.$t('BCMI008.Port'),
        Path: this.$t('BCMI008.Path'),
        URL: this.$t('BCMI008.URL'),
      },
      inputEqptBox: {
        no: '',
        name: '',
      },
      dispMenuContRouterType: false,
      dispMenuMsgType: false,
      dispMenuImportFile: false,
      dispMenuParamType: false,
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
      addContentRouterDialog: false,
      addContentRouterDialog2: false,
      addContentRouterDialog3: false,
      editEqptBoxDialog: false,
      deployEqptBoxDialog: false,
      editNodeDialog: false,
      delAreaDialog: false,
      ag_gridDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDelEqptBoxNo: '',
      selectedDelEqptBoxName: '',
      selectedRows: [],
      contRouterTypeList: [],
      paramTypeList: [],
      msgTypeList: [],
      importFileList: [],
      currentType: null,
      isFirstSetting: null,
      selectProtocolDeployGuid: null,
      disableSaveBtn: false,
      dialogTable: {
        keyword: null,
        gridOptions: null,
        gridApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        editDisable: false,
        selectedParamType: null,
        nodeTable: [
          {
            field: 'nodeNo',
            headerName: this.$t('BCMI008.NodeNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
          },
          {
            field: 'paramType',
            headerName: this.$t('BCMI008.ParamType'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'paramName',
            headerName: this.$t('BCMI008.ParamName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        nodeInput: {
          nodeNo: null,
          paramType: null,
          paramName: null,
        },
        equipmentCategoryTable: [
          {
            field: 'typeNo',
            headerName: this.$t('BCMI008.EquipmentCategoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'typeName',
            headerName: this.$t('BCMI008.EquipmentCategoryName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        equipmentCategoryInput: {
          guid: null,
          typeName: null,
        },
        factoryTable: [
          {
            field: 'factoryNo',
            headerName: this.$t('BCMI008.FactoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'factoryName',
            headerName: this.$t('BCMI008.FactoryName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        factoryInput: {
          guid: null,
          factoryName: null,
        },
        areaTable: [
          {
            field: 'groupNo',
            headerName: this.$t('BCMI008.GroupNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'groupName',
            headerName: this.$t('BCMI008.GroupName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        groupInput: {
          guid: null,
          groupName: null,
        },
        protocolTable: [
          {
            field: 'protocolNo',
            headerName: this.$t('BCMI008.ProtocolNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'protocolName',
            headerName: this.$t('BCMI008.ProtocolName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        protocolInput: {
          guid: null,
          protocolName: null,
        },
        contentRouterInput: {
          guid: null,
          contentRouterNo: null,
          contentRouterName: null,
          contentRouterType: null,
          messageType: null,
          importFile: null,
        },
        paramTale: [
          {
            field: 'paramNo',
            headerName: this.$t('BCMI008.ParamNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'paramName',
            headerName: this.$t('BCMI008.ParamName'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
        ],
        selectedRows: [],
        currentPage: null,
        totalPages: null,
        previousLink: null,
        nextLink: null,
        firstLink: null,
        lastLink: null,
      },
      protocolDeploy: {
        currentProtocol: null,
        inputEndpointURL: null,
      },
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    test() {
      let simple = [
        {
          label: 'Root',
          children: [
            {
              label: 'Food',
              children: [
                {
                  label: 'Quality ingredients',
                  paramType: '',
                  paramValue: '',
                },
                {
                  label: 'Good recipe',
                  paramType: '',
                  paramValue: '',
                },
              ],
            },
            {
              label: 'Room service',
              paramType: '',
              paramValue: '',
            },
            {
              label: 'Room view',
              paramType: '',
              paramValue: '',
            },
          ],
        },
      ]

      simple.map((item) => {
        console.log(item)
        if (item.label == 'Good recipe') {
          console.log(item)
        }
      })
      console.log(Object.entries(simple))
    },
    getSelectedNode() {
      // console.log(this.$refs.tree.getNodeByKey(this.selected));
    },
    changeSelectFile(e) {
      console.log(e.target.files[0])
      this.selectedFile = e.target.files[0]
      this.selectedFileName = e.target.files[0].name
    },
    loadingMsg(msg) {
      this.$q.loading.show({
        message: msg,
      })
    },
    alertTest() {
      alert(this.selected)
    },
    addNode(selectNode) {},
    changeStep(step) {
      if (step == 1) {
        this.addContentRouterDialog = true
        // this.addContentRouterDialog2 = false;
        // this.addContentRouterDialog3 = false;
      } else if (step == 2) {
        // this.addContentRouterDialog = false;
        this.addContentRouterDialog2 = true
        // this.addContentRouterDialog3 = false;
      } else if (step == 3) {
        // this.addContentRouterDialog = false;
        // this.addContentRouterDialog2 = false;
        this.addContentRouterDialog3 = true

        this.dialogTable.keyword = ''
        this.dialogTable.gridOptions = {}
        this.dialogTable.editType = 'fullRow' // 整排編輯
        this.dialogTable.paginationPageSize = 10 // 預設顯示資料筆數
        this.dialogTable.columnDefs = this.dialogTable.nodeTable

        this.dialogTable.defaultColDef = {
          flex: 1,
          editable: false,
          sortable: true,
        }

        this.dialogTable.rowData = [
          // 測試用假資料
          {
            nodeNo: '01',
            paramType: '固定參數',
            paramName: 'OPCUA_name',
          },
          {
            nodeNo: '02',
            paramType: '業務參數',
            paramName: 'OPCUA_name',
          },
        ]
      }
    },
    clickEnterToChangePage(page) {
      this.API_GET_ContentRouter('', '', page, this.paginationPageSize)
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
      this.API_GET_ContentRouter('', keyword, 1, this.paginationPageSize)
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
    onGridReady_dialog(params) {
      this.dialogTable.gridApi = params.api
      this.dialogTable.columnApi = params.columnApi
    },
    onCellClicked(params) {
      console.log('Cell was clicked')
      console.log(params)
      this.dialogTable.selectedRows = params
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      this.dialogTable.selectedRows = params

      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.eqptBoxInput = params.data
        } else if (this.currentType == 2) {
          this.dialogTable.equipmentBasicInfoInput = params.data
        } else if (this.currentType == 3) {
          this.dialogTable.paramInput = params.data
        } else if (this.currentType == 4) {
          // 複製功能: 選擇設備對象
          this.dialogTable.copiedEqptObjectInput = params.data
          this.API_GET_BusParam(
            '',
            '',
            1,
            this.paginationPageSize,
            3,
            this.dialogTable.copiedEqptObjectInput.equipmentNo,
            null
          )
        } else if (this.currentType == 5) {
          // 複製功能: 選擇目標設備
          params.forEach((ele) => [this.dialogTable.copyEqptTarget.push(ele)])
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDelEqptBoxNo = this.selectedRows[0].boxNo
        this.selectedDelEqptBoxName = this.selectedRows[0].boxName
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
    onDialogTableSelectionChanged() {
      this.dialogTable.selectedRows = []
      this.dialogTable.selectedRows = this.dialogTable.gridApi.getSelectedRows()
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
        CreateTime: 'test',
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
    openAddContentRouterDialog() {
      this.addContentRouterDialog = true
      this.contRouterTypeList = [
        this.$t('BCMI008.UpstreamRouting'),
        this.$t('BCMI008.DownstreamRouting'),
      ]
      this.msgTypeList = ['http', 'soap']
      this.importFileList = ['json', 'xml']

      // 清空欄位
      this.inputEqptBox.no = null
      this.inputEqptBox.name = null
      this.dialogTable.equipmentCategoryInput.typeName = null
      this.dialogTable.factoryInput.factoryName = null
      this.dialogTable.groupInput.groupName = null
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
      this.inputEqptBox.no = selectedData[0].boxNo
      this.inputEqptBox.name = selectedData[0].boxName
      this.dialogTable.protocolInput.protocolName = selectedData[0].protocolName
      this.dialogTable.protocolInput.guid = selectedData[0].protocolGuid
      this.editEqptBoxDialog = true
    },
    openEditNodeDialog() {
      if (this.dialogTable.editDisable == true) {
        return null
      }
      const selectedNodes = this.dialogTable.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      console.log(selectedData[0])

      this.paramTypeList = [this.$t('BCMI008.FixedParm2'), this.$t('BCMI008.BusParm2')]

      this.dialogTable.nodeInput.nodeNo = selectedData[0].nodeNo
      this.dialogTable.nodeInput.paramType = selectedData[0].paramType
      this.dialogTable.nodeInput.paramName = selectedData[0].paramName
      this.editNodeDialog = true
    },
    openDeployEqptBoxDialog() {
      this.protocolDeploy.inputEndpointURL = '' // 配置欄位預設

      if (this.editDisable == true) {
        return null
      }
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      // console.log(selectedData[0]);
      // console.log(selectedData[0].protocolName);
      // console.log(selectedData[0].guid);

      console.log(this.selectedRows)
      // console.log(this.selectedRows[0].protocolGuid);
      // console.log(this.selectedRows[0].guid);
      this.protocolDeploy.currentProtocol = selectedData[0].protocolName

      if (this.protocolDeploy.currentProtocol != 'MQTT') {
        this.API_GET_PROTOCOL_DEPLOY(
          '',
          '',
          1,
          this.paginationPageSize,
          selectedData[0].protocolName,
          selectedData[0].guid
        )
        this.disableSaveBtn = false
      } else {
        this.disableSaveBtn = true
      }

      this.deployEqptBoxDialog = true
    },
    openDelAreaConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }
      this.delAreaDialog = true
    },
    openTableDialog(type, tableColumn, selectedParamType) {
      this.dialogTable.keyword = ''
      this.dialogTable.gridOptions = {}
      this.dialogTable.editType = 'fullRow' // 整排編輯
      this.dialogTable.paginationPageSize = 10 // 預設顯示資料筆數

      this.dialogTable.columnDefs = tableColumn

      this.defaultColDef = {
        flex: 1,
        editable: false,
        sortable: true,
      }

      this.dialogTable.rowData = [
        // 測試用假資料
        {
          protocolNo: '01',
          protocolName: 'OPCUA',
        },
        {
          protocolNo: '02',
          protocolName: 'MQTT',
        },
      ]

      if (type == 1) {
        this.currentType = 1
        this.API_GET_PROTOCOL('', '', 1, 10)
        this.dialogTable.title = this.$t('BCMI008.Protocol')
      } else if (type == 2) {
        this.currentType = 2
        if (selectedParamType == 1) {
          // 判斷選擇【固定參數】還是【業務參數】
        } else if (selectedParamType == 2) {
          this.API_GET_BusParam('', '', 1, this.paginationPageSize)
        }

        this.dialogTable.title = this.$t('BCMI008.Factory')
      }
      // else if (type == 3) {
      //   this.currentType = 3;
      //   this.API_GET_GROUP("", "", 1, 10);
      //   this.dialogTable.title = this.$t("BCMI008.Area");
      // }

      this.ag_gridDialog = true
    },
    setDialogInput(currentType, item) {
      if (item.length != 0) {
        if (currentType == 1) {
          this.dialogTable.protocolInput = item.data
        }
      }
      this.ag_gridDialog = false
    },
    changeContRouterType(item) {
      this.dialogTable.contentRouterInput.contentRouterType = item
      this.dispMenuContRouterType = false
    },
    changeParamType(item) {
      // this.selectedParamType =
    },
    changeMsgType(item) {
      this.dialogTable.contentRouterInput.messageType = item
      this.dispMenuMsgType = false
    },
    changeImportFile(item) {
      this.dialogTable.contentRouterInput.importFile = item
      this.dispMenuImportFile = false
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
    checkEqptSessionRecord(protocolName, protocolGuid, boxGuid, protocolDeployGuid) {
      console.log('protocolName = ' + protocolName)
      console.log('protocolGuid = ' + protocolGuid)
      console.log('boxGuid = ' + boxGuid)
      console.log('protocolDeployGuid = ' + protocolDeployGuid)

      if (this.isFirstSetting) {
        this.API_POST_PROTOCOL_DEPLOY(protocolName, protocolGuid, boxGuid)
      } else {
        this.API_PUT_PROTOCOL_DEPLOY(protocolName, protocolGuid, boxGuid, protocolDeployGuid)
      }
    },
    API_POST_UploadFile(file) {
      if (file == null) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('BCMI008.notifyMsg.pleaseSelectFile'), // 上傳成功
          icon: 'report_problem',
        })
        return null
      }

      // 上傳檔案
      this.submitting = true
      this.loadingMsg(this.$t('BCMI008.templateParsing'))

      let _this = this
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
      const formData = new FormData()
      formData.append('file', file) // FR檔案、檔名

      api
        .post('/edifices/foundations/groups/equipment-content-routers/upload', formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res)

          this.timer = setTimeout(() => {
            this.$q.loading.hide()
            this.timer = void 0
            this.$q.notify({
              color: 'green',
              position: 'bottom',
              message: this.$t('BCMI008.notifyMsg.uploadSuccess'), // 上傳成功
              icon: 'check_circle_outline',
            })
          }, 3000)

          setTimeout(() => {
            this.submitting = false
            this.changeStep(3) // 進入下一步
          }, 4000)
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: _this.$t('BCMI008.notifyMsg.uploadFail'), // 上傳失敗
            icon: 'report_problem',
          })
          setTimeout(() => {
            _this.$q.loading.hide()
            _this.submitting = false
          }, 1000)
        })
    },
    API_GET_BusParam(url, search, pageNumber, pageSize, tableType, equipmentNo, businessType) {
      // 取得業務參數配置資料
      if (equipmentNo == null) {
        equipmentNo = ''
      }

      if (businessType == null) {
        businessType = 'Undefined'
      }

      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url =
          '/edifices/foundations/groups/equipment-business-params?search=' +
          search +
          '&equipmentNo=' +
          equipmentNo +
          '&businessType=' +
          businessType +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize
      } else if (url == null) {
        // 情境: 沒有下一頁、或沒有上一頁時
        return null
      }
      console.log(url)
      api
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          if (tableType == 1) {
            this.dialogTable.rowData = res.data
          } else if (tableType == 2) {
            this.rowData = res.data
          } else if (tableType == 3) {
            console.log(res.data)
            this.copiedEqptObject = res.data
          } else {
            this.rowData = res.data
          }

          console.log(res.data)
          let pagination = JSON.parse(res.headers['x-pagination'])
          this.totalPages = pagination['totalPages']
          this.currentPage = pagination['currentPage']
          this.previousLink = pagination['previousLink']
          this.nextLink = pagination['nextLink']
          this.firstLink = pagination['firstLink']
          this.lastLink = pagination['lastLink']
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API_GET_BusParam 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_PROTOCOL(url, search, pageNumber, pageSize) {
      // 取得區域配置資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url =
          '/edifices/foundations/groups/industrial-protocols?search=' +
          search +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize
      } else if (url == null) {
        // 情境: 沒有下一頁、或沒有上一頁時
        return null
      }
      api
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
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
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API_GET_GROUP 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_PROTOCOL_DEPLOY(url, search, pageNumber, pageSize, protocolName, boxGuid) {
      // 取得盒子對應協議配置資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url =
          '/edifices/foundations/groups/industrial-protocol-' +
          protocolName.toLowerCase() +
          '/?search=' +
          search +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize +
          '&BoxId=' +
          boxGuid
      } else if (url == null) {
        // 情境: 沒有下一頁、或沒有上一頁時
        return null
      }
      console.log(url)
      api
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.length != 0) {
            console.log('[前端]此盒子已有協議配置紀錄!')
            this.isFirstSetting = false
            this.selectProtocolDeployGuid = res.data[0].guid
            if (this.protocolDeploy.currentProtocol == 'OPCUA') {
              this.protocolDeploy.inputEndpointURL = res.data[0].endpointUrl
            }
          } else {
            console.log('[前端]此盒子沒有協議配置紀錄!')
            this.isFirstSetting = true
          }
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API_GET_PROTOCOL_DEPLOY 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_PUT_PROTOCOL_DEPLOY(protocolName, protocolGuid, boxGuid, protocolDeployGuid) {
      // 更新協議配置資料
      let _this = this
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account

      let deployParam = {}
      if (protocolName == 'OPCUA') {
        deployParam['endpointUrl'] = this.protocolDeploy.inputEndpointURL
      }

      let obj = {
        guid: protocolDeployGuid,
        protocolGuid: protocolGuid,
        boxGuid: boxGuid,
        creator: creator,
      }
      let objJoin = Object.assign({}, obj, deployParam)
      const body = []
      body.push(objJoin)
      console.log(body)
      this.$refs.editDeployParamForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          api
            .put('/edifices/foundations/groups/industrial-protocol-' + protocolName, body, {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Accept-Language': localStorage.getItem('lang'),
                accept: 'application/json',
              },
            })
            .then((res) => {
              this.API_GET_ContentRouter('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('BCMI008.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.deployEqptBoxDialog = false // 關閉Dialog
              }, 1000)
            })
            .catch(function (error) {
              // if (error.response.status == 404) {
              //   console.log('[前端]此盒子還未設定過協議配置，使用新增POST')
              //   _this.API_POST_PROTOCOL_DEPLOY();
              // } else {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              _this.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: _this.$t('BCMI008.editFail'), // 修改失敗
                icon: 'report_problem',
              })
              // }
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
    API_POST_PROTOCOL_DEPLOY(protocolName, protocolGuid, boxGuid) {
      // 新增一筆協議配置
      this.submitting = true

      let _this = this
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account

      let deployParam = {}
      if (protocolName == 'OPCUA') {
        deployParam['endpointUrl'] = this.protocolDeploy.inputEndpointURL
      }

      let obj = {
        guid: this.guid(),
        protocolGuid: protocolGuid,
        boxGuid: boxGuid,
        creator: creator,
      }
      let objJoin = Object.assign({}, obj, deployParam)
      const body = []
      body.push(objJoin)
      console.log(body)
      api
        .post('/edifices/foundations/groups/industrial-protocol-' + protocolName, body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('BCMI008.addSucess'), // 新增成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.deployEqptBoxDialog = false // 關閉Dialog
          }, 1000)
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: _this.$t('BCMI008.addFail'), // 新增失敗
            icon: 'report_problem',
          })
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
      // }
      // });
    },
    API_GET_ContentRouter(url, search, pageNumber, pageSize) {
      // 取得內容路由配置資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url =
          '/edifices/foundations/groups/equipment-content-routers?search=' +
          search +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize
      } else if (url == null) {
        // 情境: 沒有下一頁、或沒有上一頁時
        return null
      }
      api
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          this.rowData = res.data
          let pagination = JSON.parse(res.headers['x-pagination'])
          this.totalPages = pagination['totalPages']
          this.currentPage = pagination['currentPage']
          this.previousLink = pagination['previousLink']
          this.nextLink = pagination['nextLink']
          this.firstLink = pagination['firstLink']
          this.lastLink = pagination['lastLink']
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API_GET_ContentRouter 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_POST_EqptBox(boxNo, boxName) {
      // 新增內容路由配置資料
      this.$refs.addEqptBasicInfoForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          if (this.rowData != undefined) {
            let result = this.rowData.filter((item) => {
              // 檢查內容路由編號是否重複
              return item.boxNo == boxNo
            })
            if (result.length > 0) {
              this.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: this.$t('BCMI008.boxNoDuplicate'),
                icon: 'report_problem',
              })
              this.submitting = false
              return null
            }
          }

          // 新增一筆內容路由
          let _this = this
          let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
          const body = [
            {
              guid: this.guid(),
              boxNo: boxNo,
              boxName: boxName,
              protocolGuid: this.dialogTable.protocolInput.guid,
              creator: creator,
            },
          ]
          console.log(body)
          api
            .post('/edifices/foundations/groups/equipment-boxes', body, {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Accept-Language': localStorage.getItem('lang'),
                accept: 'application/json',
              },
            })
            .then((res) => {
              this.API_GET_ContentRouter('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('BCMI008.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addContentRouterDialog = false // 關閉Dialog
              }, 1000)
            })
            .catch(function (error) {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              _this.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: _this.$t('BCMI008.addFail'), // 新增失敗
                icon: 'report_problem',
              })
              setTimeout(() => {
                _this.submitting = false
              }, 1000)
            })
        }
      })
    },
    API_PUT_EqptBox(boxNo, boxName) {
      // 更新內容路由資料
      let _this = this
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
      const body = [
        {
          guid: this.selectedRows[0].guid,
          boxNo: boxNo,
          boxName: boxName,
          protocolGuid: this.dialogTable.protocolInput.guid,
          creator: creator,
        },
      ]
      console.log(body)
      this.$refs.editEqptBoxForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          api
            .put('/edifices/foundations/groups/equipment-boxes', body, {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Accept-Language': localStorage.getItem('lang'),
                accept: 'application/json',
              },
            })
            .then((res) => {
              this.API_GET_ContentRouter('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('BCMI008.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.editEqptBoxDialog = false // 關閉Dialog
              }, 1000)
            })
            .catch(function (error) {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              _this.$q.notify({
                color: 'negative',
                position: 'bottom',
                message: _this.$t('BCMI008.editFail'), // 修改失敗
                icon: 'report_problem',
              })
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
    API_DEL_EqptBox(selectRowBox) {
      let _this = this
      let delItem = ''
      selectRowBox.forEach((item) => {
        delItem += item.guid + ','
      })

      const url = '/edifices/foundations/groups/equipment-boxes/' + delItem
      api
        .delete(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('BCMI008.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })

          selectRowBox.forEach((ele) => {
            this.rowData.forEach((item, index) => {
              if (ele.guid == item.guid) {
                this.rowData.splice(index, 1)
              }
            })
          })
          this.gridOptions.api.setRowData(this.rowData)
          this.delAreaDialog = false
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: _this.$t('BCMI008.delFail'), // 刪除失敗
            icon: 'report_problem',
          })
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
      setTimeout(() => {
        this.onSelectionChanged()
      }, 500)
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
    // this.testArray = ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"];
    this.columnDefs = [
      {
        field: 'routingNo',
        headerName: this.$t('BCMI008.RoutingNo'),
        width: 90,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        editable: true,
        unSortIcon: true,
      },
      {
        field: 'routingName',
        headerName: this.$t('BCMI008.RoutingName'),
        width: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.testArray,
        },
      },
      {
        field: 'routingTyep',
        headerName: this.$t('BCMI008.RoutingTyep'),
        width: 90,
      },
      {
        field: 'messageType',
        headerName: this.$t('BCMI008.MessageType'),
        width: 90,
      },
      {
        field: 'importFile',
        headerName: this.$t('BCMI008.ImportFile'),
        width: 90,
      },
      {
        field: 'creator',
        headerName: this.$t('BCMI008.CreateTime'),
        width: 90,
        editable: false,
      },
      {
        field: 'modifytime',
        headerName: this.$t('BCMI008.LastUpdateDate'),
        comparator: this.dateComparator,
        editable: false,
      },
    ]

    this.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.API_GET_ContentRouter('', '', 1, this.paginationPageSize) // 取得內容路由資料
  },
  beforeCreate() {},
  beforeDestroy() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer)
      this.$q.loading.hide()
    }
  },
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
  width: 566px
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
      border-radius: 4px
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
