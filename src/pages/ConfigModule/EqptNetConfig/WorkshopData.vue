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

    <!--匯入CSV-->
    <!-- <div class="iconBtn" @click="openImportCSVDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/uploadFile.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT007.btn.importEqptCSV') }}
      </q-tooltip>
    </div> -->

    <!--匯出CSV-->
    <!-- <div class="iconBtn" @click="JsonToCsv()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/downloadFile.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT007.btn.exportEqptCSV') }}
      </q-tooltip>
    </div> -->

    <!--新增-->
    <div class="iconBtn" @click="openAddBusParamDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT007.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditBusParamDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT007.btn.edit') }}
      </q-tooltip>
    </div>

    <!--複製-->
    <!-- <div class="iconBtn" @click="openCopyBusParamDialog()">
      <img src="~assets/icons/svg/icon_copy_1.svg" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t("IIOT007.btn.copy") }}
      </q-tooltip>
    </div> -->

    <!--刪除-->
    <div class="delBtn" @click="openDelGroupConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT007.btn.del') }}
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
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_WorkshopData(this.firstLink)" />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_WorkshopData(this.previousLink)"
        />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_WorkshopData(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_WorkshopData(this.lastLink)" />
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
      @selection-changed="onSelectionChanged_level2"
      :gridOptions="agGridLevel2.gridOptions"
      @grid-ready="onGridReady_level2"
      @row-clicked="onCellClicked_level2"
    ></ag-grid-vue>
    <div class="tablePagination">
      <span class="container">
        <img
          src="~assets/icons/png/firstPage.png"
          @click="API_GET_WorkshopData_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_WorkshopData_detail(this.agGridLevel2.pagination.previousLink)"
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
          @click="API_GET_WorkshopData_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_WorkshopData_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增車間數據 Dialog (第一步)-->
  <q-dialog v-model="addBusParamDialog_Step1" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT007.addWorkshopData') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addBusParamDialog_Step1">
        <q-card-section class="dialog-content scroll">
          <!--任務類型-->
          <!-- <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT007.TaskType') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuTaskType = !dispMenuTaskType">
              <input type="text" v-model="dialogTable.taskCenterInput.taskType.typeName" readonly />
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
          </div> -->

          <!--工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.FactoryNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(6, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--群組-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.GroupNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(7, this.dialogTable.areaTable)">
            <input type="text" v-model="dialogTable.groupInput.groupNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--選擇設備(設備編號)-->
          <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('IIOT007.EquipmentNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(2, this.dialogTable.equipmentBasicInfoTable)">
            <input type="text" v-model="dialogTable.equipmentBasicInfoInput.equipmentNo" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--設備名稱(純顯示)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
            readonly
          />

          <!--聯網類型(純顯示)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.networkTypeInput.typeName"
            :label="translated.NetworkType"
            type="string"
            readonly
          />
          <!-- <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.NetworkType') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(10, this.dialogTable.networkTypeTable)">
            <input type="text" v-model="dialogTable.networkTypeInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div> -->

          <!--參數類型-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.ParamType') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(3, this.dialogTable.paramTypeTable)">
            <input type="text" v-model="dialogTable.processTypeInput.typeName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--操作狀態(啟用/停用)-->
          <!-- <div style="margin: 0 0 8px 0" class="label">
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
          </div> -->

          <!--任務狀態-->
          <!-- <div
            v-bind:class="{ switchOn: !dialogTable.busParamInput.isDisable }"
            style="padding: 16px 0; display: flex; flex-direction: row"
          >
            <span style="margin: 0 16px 0 0">{{ $t('IIOT007.EnabledState') }} :</span>
            <div
              class="slideToggle"
              @click="dialogTable.busParamInput.isDisable = !dialogTable.busParamInput.isDisable"
            >
              <div class="switchBtn"></div>-->
              <!--啟用/停用 按鈕-->
            <!-- </div>
          </div> -->
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
            @click="changeStep(2, this.dialogTable.processTypeInput)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 新增車間數據 Dialog (第二步) -->
  <q-dialog v-model="addBusParamDialog_Step2" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.addTaskCenter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addBusParamDialog_Step2">
        <q-card-section class="dialog-content scroll">
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.secondStep') }}:
            {{ $t('IIOT008.SelectEquipt') }}
          </div>

          <!--數據編號(適用參數類型 1001、1003)-->
          <!-- <div v-if="!manuallySetDataNoBool">
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT007.DataNo') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(9, this.dialogTable.paramTypeTable)">
              <input type="text" v-model="dialogTable.dataInput.typeNo" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
          </div> -->

          <!--數據編號(適用參數類型 1002)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.dataInput.typeNo"
            :label="translated.DataNo"
            type="string"
            v-if="manuallySetDataNoBool"
          />

          <!--參數路徑(nodePath)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.detail.nodePath"
            v-if="displayNodePath"
            :label="translated.ParamPath"
            type="string"
          />

          <!--設備狀態-->
          <div v-if="dialogTable.processTypeInput.typeNo == '1001'">
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT007.EquipmentStatus') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(8, this.dialogTable.equipmentStatusTable)">
              <input type="text" v-model="dialogTable.setEquiptHint" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
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
            :label="translated.btn.save"
            :loading="submitting"
            @click="API_POST_WorkshopData(
                dialogTable.taskCenterInput, 
                dialogTable.equipmentBasicInfoInput, 
                dialogTable.detail, 
                dialogTable.equipmentStatusList, 
                dialogTable.operateStatusInput,
                dialogTable.processTypeInput,
                dialogTable.dataInput,
              )"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯車間數據 Dialog (第一步) -->
  <q-dialog v-model="editBusParamDialog_step1" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT007.editWorkshopData') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editBusParamDialog_step1">
        <q-card-section class="dialog-content scroll">
          <!--任務類型-->
          <!-- <div style="padding: 16px 0">
            <span>{{ $t('IIOT007.TaskType') }} :</span>
            <span>{{ dialogTable.taskCenterInput.taskType.typeName }}</span>
          </div> -->

          <!--工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            <span>{{ $t('IIOT007.FactoryNo') }} :</span>
            <span>{{ dialogTable.factoryInput.factoryNo }}</span>
          </div>

          <!--群組-->
          <div style="margin: 16px 0 8px 0" class="label">
            <span>{{ $t('IIOT007.GroupNo') }} :</span>
            <span>{{ dialogTable.groupInput.groupNo }}</span>
          </div>

          <!--選擇設備(設備編號)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentNo"
            :label="translated.EquipmentNo"
            type="string"
            readonly
          />

          <!--設備名稱(純顯示)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
            readonly
          />

          <!--聯網類型(純顯示)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.networkTypeInput.typeName"
            :label="translated.NetworkType"
            type="string"
            readonly
          />

          <!--參數類型-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.processTypeInput.typeName"
            :label="translated.ParamType"
            type="string"
            readonly
          />

          <!--操作狀態(啟用/停用)-->
          <!-- <div style="margin: 0 0 8px 0" class="label">
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
          </div> -->
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
            @click="
              changeStepEdit(2, this.dialogTable.processTypeInput)
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯車間數據 Dialog (第二步) -->
  <q-dialog v-model="editBusParamDialog_step2" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT007.editWorkshopData') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="editBusParamDialog_step2">
        <q-card-section class="dialog-content scroll">
          <!-- <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.secondStep') }}:
            {{ $t('IIOT008.SelectEquipt') }}
          </div> -->

          <!--數據編號(適用參數類型 1001、1003)-->
          <!-- <div v-if="!manuallySetDataNoBool">
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT007.DataNo') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(9, this.dialogTable.paramTypeTable)">
              <input type="text" v-model="dialogTable.dataInput.typeNo" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
          </div> -->
          <!--數據編號(適用參數類型 1002)-->
          <div style="margin: 16px 0 8px 0" class="label" v-if="manuallySetDataNoBool">
            <span>{{ $t('IIOT007.DataNo') }} :</span>
            <span>{{ dialogTable.dataInput.typeNo }}</span>
          </div>

          <!--參數路徑(nodePath)-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.detail.nodePath"
            v-if="displayNodePath"
            :label="translated.ParamPath"
            type="string"
          />

          <!--設備狀態-->
          <div v-if="dialogTable.processTypeInput.typeNo == '1001'">
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT007.EquipmentStatus') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(8, this.dialogTable.equipmentStatusTable)">
              <input type="text" v-model="dialogTable.setEquiptHint" readonly />
              <button>
                <img src="~assets/icons/png/plus.png" />
              </button>
            </div>
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
            :label="translated.btn.save"
            :loading="submitting"
            @click="
              API_PUT_WorkshopData(
                dialogTable.dataInput,
                dialogTable.taskCenterInput, 
                dialogTable.equipmentBasicInfoInput, 
                dialogTable.detail, 
                dialogTable.equipmentStatusList, 
                dialogTable.operateStatusInput,
                dialogTable.processTypeInput
              )
            "
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除 Dialog -->
  <q-dialog v-model="delGroupDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT007.delWorkshopData') }}
        </div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">{{ $t('IIOT007.delSlectItem') }}</span>
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
          @click="API_DEL_WorkshopData(this.selectedRows_level2)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 匯入CSV Dialog -->
  <q-dialog v-model="importCSVDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT007.ImportEqptCSV') }}
        </div>
      </q-card-section>

      <q-card-section>
        <input type="file" id="csvFile" accept=".csv" class="btn btn-sm btn-outline-secondary"/>
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
          @click="createTable()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 開窗 ag-grid Dialog -->
  <q-dialog v-model="jumpAgGridDialog" persistent style="max-width: 1000px">
    <q-card class="jump-bg-dialog">
      <iframe src="http://10.40.73.158:9095/index.html#/aj/z4KpCfYG" title="" style="width: 100%; height: 100%"></iframe>
      <dw-button
        class="button-theme text-white button-theme-del"
        :label="translated.btn.cancel"
        v-close-popup
      />
      <!-- <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT007.ImportEqptCSV') }}
        </div>
      </q-card-section>

      <div  class="jump_container">
        <q-card-section class="jump_chart">
          <div class="lineChart">
            <div class="timeIntervalPanel">
              <div class="title">
                {{ this.$t('TransactionRecord.TransactionDataVolume') }}
              </div>
              <q-space />
              <div class="timeGroup" v-for="(item, key) in timeList" :key="key">
                <div
                  class="timeItem"
                  :class="{ hightlight: selectType == item.value }"
                  @click="changeTimeInterval(item.value)"
                >
                  {{ item.name }} |
                </div>
              </div>
            </div>
            <div id="lineChart" style="border: 1px solid red"></div>
          </div>
        </q-card-section>
        <q-card-section class="jump_table"> -->


          <!-- <ag-grid-vue
            style="width: 100%; height: calc(100vh - 206px)"
            class="ag-theme-alpine"
            :columnDefs="dialogTable.jump.columnDefs"
            :defaultColDef="dialogTable.jump.defaultColDef"
            :rowData="dialogTable.jump.rowData"
            rowSelection="multiple"
            :gridOptions="dialogTable.jump.gridOptions"
            @selection-changed="onDialogTableSelectionChanged"
            @grid-ready="onGridReady_dialog"
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
          </div> -->

        <!-- </q-card-section>
      </div>
      

      <q-card-actions align="between" class="bottom">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          :loading="submitting"
          @click="createTable()"
        />
      </q-card-actions> -->

    </q-card>
  </q-dialog>

  <!-- 複製業務參數 Dialog -->
  <q-dialog v-model="copyBusParamDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT007.CopyParam') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addBusParamForm">
        <q-card-section class="dialog-content scroll">
          <!--選擇複製對象-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.Select') }}{{ $t('IIOT007.Copy') }}{{ $t('IIOT007.Object') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(4, this.dialogTable.equipmentBasicInfoTable)">
            <input type="text" v-model="dialogTable.copiedEqptObjectInput.equipmentName" readonly />
            <button>
              <img src="~assets/icons/png/plus.png" />
            </button>
          </div>

          <!--選擇複製目標-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT007.Select') }}{{ $t('IIOT007.Copy') }}{{ $t('IIOT007.Target') }}
          </div>
          <div class="chipSection q-gutter-xs row" style="height: 300px">
            <div v-for="item in dialogTable.copyEqptTarget" :key="item">
              <q-chip
                removable
                text-color="white"
                :label="item.equipmentName"
                @remove="removeEqptChip(item.guid)"
              />
            </div>
          </div>

          <dw-button
            class="button-theme text-white button-theme-del"
            :label="translated.btn.selectEqpt"
            @click="openTableDialog(5, this.dialogTable.copyEqptTargetTable)"
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
            @click="saveCopyParam()"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- ag-grid Dialog -->
  <q-dialog class="customDialog" v-model="ag_gridDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section class="dialog-title">
        <button class="prevBtn" v-close-popup>
          <img src="~assets/icons/svg/chevron_left.svg" />
        </button>
        <div class="dialogTitle text-h6">{{ $t('IIOT007.Select') }}{{ dialogTable.title }}</div>
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

  <!-- ag-grid edit Dialog -->
  <q-dialog class="customDialog" v-model="ag_gridDialog_edit" persistent position="right">
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
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          @click="ag_gridDialog_edit_confirmBtn(this.dialogTable.rowData)"
        />
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
import { API_GET_WorkshopData } from '../../../api/WorkshopData/API_GET_WorkshopData'
import { API_GET_WorkshopData_detail } from '../../../api/WorkshopData/API_GET_WorkshopData_detail'
import { API_GET_WorkshopData_EDIT } from '../../../api/WorkshopData/API_GET_WorkshopData_EDIT'
import { API_POST_WorkshopData } from '../../../api/WorkshopData/API_POST_WorkshopData'
import { API_POST_UploadParam } from '../../../api/WorkshopData/API_POST_UploadParam'
import { API_POST_DownloadParam } from '../../../api/WorkshopData/API_POST_DownloadParam'
import { API_PUT_WorkshopData } from '../../../api/WorkshopData/API_PUT_WorkshopData'
import { API_PUT_UploadParam } from '../../../api/WorkshopData/API_PUT_UploadParam'
import { API_PUT_DownloadParam } from '../../../api/WorkshopData/API_PUT_DownloadParam'
import { API_DEL_WorkshopData } from '../../../api/WorkshopData/API_DEL_WorkshopData'
import { API_GET_UploadParam } from '../../../api/WorkshopData/API_GET_UploadParam'
import { API_GET_DownloadParam } from '../../../api/WorkshopData/API_GET_DownloadParam'
import { API_GET_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo'
import { API_GET_TaskType } from '../../../api/TaskCenter/API_GET_TaskType'
import { API_GET_EquiptData } from '../../../api/WorkshopData/API_GET_EquiptData'
import { API_GET_ProductionData } from '../../../api/WorkshopData/API_GET_ProductionData'
import { API_GET_IndustrialProtocol } from '../../../api/NetWorks/API_GET_IndustrialProtocol'
import { API_GET_OperateStatus } from '../../../api/NetWorks/API_GET_OperateStatus'
import { API_GET_EqptBasicInfo_EDIT } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo_EDIT'
import { API_GET_CSVJson } from '../../../api/WorkshopData/API_GET_CSVJson'
import { API_POST_CSVJson } from '../../../api/WorkshopData/API_POST_CSVJson'

export default {
  components: {
    AgGridVue,
    'dw-input': dw_input,
    'dw-button': dw_button,
    'ag-grid-table': ag_grid_table,
  },
  data: function () {
    return {
      vanilla: '123',
      vanilla2: '456',
      selectTargetChip: ['123', '456', '745689'],
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
          add: this.$t('IIOT007.btn.add'),
          edit: this.$t('IIOT007.btn.edit'),
          del: this.$t('IIOT007.btn.del'),
          confirm: this.$t('IIOT007.btn.confirm'),
          cancel: this.$t('IIOT007.btn.cancel'),
          save: this.$t('IIOT007.btn.save'),
          selectEqpt: this.$t('IIOT007.Select') + this.$t('IIOT007.Equipment'),
          next: this.$t('IIOT007.btn.next'),
          previous: this.$t('IIOT007.btn.previous'),
          finish: this.$t('IIOT007.btn.finish'),
        },
        input: {
          search: this.$t('IIOT007.input.search'),
          pleaseEnter: this.$t('IIOT007.input.pleaseEnter'),
        },
        EquipmentNo: this.$t('IIOT007.EquipmentNo'),
        EquipmentName: this.$t('IIOT007.EquipmentName'),
        EquipmentCategory: this.$t('IIOT007.EquipmentCategory'),
        Protocol: this.$t('IIOT007.Protocol'),
        DataNo: this.$t('IIOT007.DataNo'),
        ParamType: this.$t('IIOT007.ParamType'),
        ParamPath: this.$t('IIOT007.ParamPath'),
        NetworkType: this.$t('IIOT007.NetworkType'),
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
      addBusParamDialog_Step1: false,
      addBusParamDialog_Step2: false,
      editBusParamDialog_step1: false,
      editBusParamDialog_step2: false,
      copyBusParamDialog: false,
      delGroupDialog: false,
      ag_gridDialog: false,
      ag_gridDialog_edit: false, // 可編輯的grid表格
      importCSVDialog: false,
      jumpAgGridDialog: false,
      editDisable: true,
      delDisable: true,
      selectedDelDataNo: '',
      selectedDelNodePath: '',
      selectedRows: [],
      selectedRows_level2: [],
      factoryList: [],
      currentType: null,
      dispMenuOperateStatus: false,
      dispMenuVariableType: false,
      operateStatusList: [],
      variableTypeList: [],
      cascadeResult: [],
      dispMenuTaskType: false,
      dispMenuUpperSystem: false,
      taskTypeList: [],
      upperSystemList: [],
      displayNodePath: false,
      level: null,
      dialogTable: {
        keyword: null,
        gridOptions: null,
        gridApi: null,
        columnApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        detail: {
          nodePath: null
        },
        jump: {
          gridOptions: null,
          gridApi: null,
          columnApi: null,
          columnDefs: null,
          defaultColDef: null,
          rowData: null,
        },
        factoryTable: [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT007.FactoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT007.FactoryName'),
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
            headerName: this.$t('IIOT007.GroupNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'groupName',
            headerName: this.$t('IIOT007.GroupName'),
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
        taskCenterInput: {
          id: null,
          taskType: {
            typeNo: null,
            typeName: null,
          },
          upperSystem: {
            typeNo: null,
            typeName: null,
          },
        },
        busParamInput: {
          id: null,
          paramNo: null,
          paramPath: null,
          isDisable: false,
        },
        dataInput: {
          typeNo: null,
          typeName: null,
        },
        equipmentBasicInfoTable: [
          {
            field: 'equipmentNo',
            headerName: this.$t('IIOT007.EquipmentNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT007.EquipmentName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          // {
          //   field: 'equipmentprocessType',
          //   headerName: this.$t('IIOT007.EquipmentCategory'),
          //   width: 189.4,
          //   editable: false,
          //   unSortIcon: true,
          // },
        ],
        equipmentBasicInfoInput: {
          id: null,
          typeGuid: null,
          typeName: null,
          equipmentNo: null,
          equipmentName: null,
        },
        paramTypeTable: [
          {
            field: 'typeNo',
            headerName: this.$t('IIOT007.DataNo'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'typeName',
            headerName: this.$t('IIOT007.ParamType'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        networkTypeTable: [
          {
            field: 'typeName',
            headerName: this.$t('IIOT007.ParamType'),
            width: 568,
            editable: false,
            unSortIcon: true,
          },
        ],
        networkTypeInput: {
          typeNo: null,
          typeName: null,
        },
        processTypeInput: {
          typeNo: null,
          typeName: null,
        },
        equipmentStatusList: {
          run: null,
          idle: null,
          error: null,
          setup: null,
          shutdown: null,
          repair: null,
          maintenance: null,
          hold: null,
        },
        copiedEqptObjectInput: {
          // 被複製設備對象
          guid: null,
          equipmentGuid: null,
          equipmentNo: null,
          equipmentName: null,
          typeGuid: null,
          boxGuid: null,
          protocolGuid: null,
          paramGuid: null,
          paramPath: null,
        },
        copyEqptTargetTable: [
          {
            field: 'equipmentNo',
            headerName: this.$t('IIOT007.EquipmentNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT007.EquipmentName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          // {
          //   field: 'typeName',
          //   headerName: this.$t('IIOT007.EquipmentCategory'),
          //   width: 189.4,
          //   editable: false,
          //   unSortIcon: true,
          // },
        ],
        setEquiptHint: this.$t('IIOT007.SetEquiptHint'),
        equipmentStatusTable: [
          {
            field: 'equiptStatusName',
            headerName: this.$t('IIOT007.EquiptStatusName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
            checkboxSelection: false,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
          },
          {
            field: 'equiptStatusValue',
            headerName: this.$t('IIOT007.EquiptStatusValue'),
            width: 189.4,
            editable: true,
            unSortIcon: true,
          },
        ],
        equipmentStatusValue: [
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.run'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.idle'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.error'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.setup'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.shutdown'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.repair'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.maintenance'),
            equiptStatusValue: ''
          },
          {
            equiptStatusName: this.$t('IIOT007.EquipmentStatusList.hold'),
            equiptStatusValue: ''
          },
        ],
        operateStatusInput: {
          typeNo: null,
          typeName: null
        },
        copiedEqptObject: [],
        copyEqptTarget: [], // 預備要套用複製內容的設備
        copyResult: [],
        selectedRows: [],
        currentPage: null,
        totalPages: null,
        previousLink: null,
        nextLink: null,
        firstLink: null,
        lastLink: null,
        manuallySetDataNoBool: true,
      },
    }
  },
  provide: function () {
    return {}
  },
  methods: {
    change() {
      if (document.getElementById('lineChart') == null) {
        clearInterval(this.timer)
        return null
      }

      let echarts = require('echarts')
      echarts.init(document.getElementById('lineChart')).dispose()
      let lineChart = echarts.init(document.getElementById('lineChart'))
      let randomData = []
      for (let i = 0; i < 6; i++) {
        randomData.push(Math.random())
      }

      let option = {
        // title: {
        //   text: this.$t("TransactionRecord.TransactionDataVolume"),
        //   subtext: "Fake Data",
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: {
          data: this.timeInterval_arry,
        },
        yAxis: {},
        series: [
          {
            name: this.$t('IIOT008.DeliverTask'),
            type: 'line',
            data: this.trade_download, //randomData,
            smooth: true,
            lineStyle: {
              // color: "#2686dd",
            },
          },
          {
            name: this.$t('IIOT008.UploadTask'),
            type: 'line',
            data: this.trad_upload,
            smooth: true,
            lineStyle: {
              // color: "#6fa8dc",
            },
          },
        ],
      }
      lineChart.setOption(option)

      window.addEventListener('resize', () => {
        // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
        this.myChart.resize()
        // 如果有多个echarts，就在这里执行多个echarts实例的resize方法,不过一般要做组件化开发，即一个.vue文件只会放置一个echarts实例
        /*
        this.myChart2.resize();
        this.myChart3.resize();
        ......

        */
      })
    },
    drawLineChart() {
      let echarts = require('echarts')
      this.lineChart = echarts.init(document.getElementById('lineChart'))
      let option = {
        // title: {
        //   text: this.$t("TransactionRecord.TransactionDataVolume"),
        //   subtext: "Fake Data",
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: function (params) {
            return `${params[0].name}<br />`;
          }
        },
        xAxis: {
          data: [
            '2021/07/30 12:00:00',
            '2021/07/30 12:00:00',
            '2021/07/30 12:00:00',
            '2021/07/30 12:00:00',
            '2021/07/30 12:00:00',
            '2021/07/30 12:00:00',
          ],
        },
        yAxis: {},
        series: [
          {
            type: 'line',
            data: [10, 22, 28, 23, 19, 32],
            smooth: true,
            lineStyle: {
              color: '#2686dd',
            },
          },
          {
            type: 'line',
            data: [20, 12, 28, 15, 12, 4],
            smooth: true,
            lineStyle: {
              color: '#6fa8dc',
            },
          },
        ],
      }
      // 使用刚指定的配置项和数据显示图表。
      this.lineChart.setOption(option)

      window.addEventListener('resize', () => {
        this.change()
        // this.lineChart.resize();
      })
    },
    changeTimeInterval(timeValue) {
      console.log(timeValue)
      this.$q.loading.show({
        delay: 400, // ms
      })
      this.getInterval(timeValue)
    },
    async getInterval(type) {
      this.selectType = type
      let fullDate = new Date()
      let yyyy = fullDate.getFullYear()
      let MM = fullDate.getMonth() + 1 >= 10 ? fullDate.getMonth() + 1 : '0' + (fullDate.getMonth() + 1)
      let dd = fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()
      let date = yyyy + '-' + MM + '-' + dd
      let time = fullDate.getHours() + ':' + fullDate.getMinutes() + ':' + fullDate.getSeconds()
      let timeInterval = []
      let resultString = ''

      if (type == 1) {
        // 5 min，每30秒一個區間，共10區間
        console.log('<-- 5 min -->')
        let count = 0
        let seconds = 0
        let minutes = fullDate.getMinutes() - 5
        let hours = fullDate.getHours()
        if (minutes < 0) {
          minutes += 60
          hours -= 1
        }
        timeInterval.push(date + ' ' + hours + ':' + minutes + ':' + seconds)
        for (let i = 1; i < 10; i++) {
          if (count + 30 == 60) {
            count = 0
            minutes += 1
          } else {
            count = 30
          }

          if (minutes >= 60) {
            minutes -= 60
          }

          seconds = count
          timeInterval.push(date + ' ' + fullDate.getHours() + ':' + minutes + ':' + seconds)
        }
      } else if (type == 2) {
        // 1 day，每2小時一個區間，共12區間
        console.log('<-- 1 day -->')
        let hours = fullDate.getHours()
        timeInterval.push(date + ' ' + hours + ':00:00')
        for (let i = 1; i <= 12; i++) {
          hours -= 2
          if (hours < 0) {
            let _hours = hours + 24
            let _dd = dd - 1
            timeInterval.push(yyyy + '-' + MM + '-' + _dd + ' ' + _hours + ':00:00')
          } else {
            timeInterval.push(date + ' ' + hours + ':00:00')
          }
        }
        timeInterval.reverse()
      } else if (type == 3) {
        // 7 day，每12小時一個區間，共14區間
        console.log('<-- 7 day -->')
        let hours = fullDate.getHours()
        dd -= 7
        timeInterval.push(yyyy + '-' + MM + '-' + dd + ' ' + hours + ':00:00')
        for (let i = 1; i <= 14; i++) {
          hours -= 12
          if (hours < 0) {
            let _hours = (hours % 24) + 24
            let _dd = dd - Math.floor(hours / 24)
            timeInterval.push(yyyy + '-' + MM + '-' + _dd + ' ' + _hours + ':00:00')
          } else {
            timeInterval.push(yyyy + '-' + MM + '-' + dd + ' ' + hours + ':00:00')
          }
        }
      } else if ((type = 4)) {
        // 30 day，每3天為一個區間，共10區間
        console.log('<-- 30 day -->')
        let thatDay = new Date()
        let number = 0
        let todayTime = thatDay.getTime()
        for (let i = 0; i <= 10; i++) {
          thatDay = new Date(todayTime + number * (24 * 60 * 60 * 1000))
          let month = thatDay.getMonth() + 1
          timeInterval.push(thatDay.getFullYear() + '-' + month + '-' + thatDay.getDate() + ' 00:00:00')
          number -= 3
        }
        timeInterval.reverse()
      }

      let i = 0,
        j = 1
      for (let index = 0; index < timeInterval.length - 1; index++) {
        // 串成字串傳給後端
        resultString += timeInterval[i++] + '@' + timeInterval[j++] + ','
      }
      timeInterval.splice(1, 1) // 刪除第一筆
      this.timeInterval_arry = timeInterval
      await this.API_GET_Task_TransactionDataVolume(resultString)
      this.change()
      // return resultString;
    },
    openImportCSVDialog() {
      if (this.editDisable == true) {
        errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectEquipt'))
        return null
      }
      this.importCSVDialog = true
    },
    createTable() {
      let csvFile = document.getElementById("csvFile");
      let reader = new FileReader()
      let f = csvFile.files[0]
      let _this = this
      reader.onload = function(e) {
        console.log(e.target.result)
        _this.csvToJson(e.target.result)
        // document.getElementById("dataTable").innerHTML = arrayToTable(e.target.result, "data")
      };
      reader.readAsText(f)
    },
    csvToJson(csv) {
      console.log(typeof(csv))
      let lines = csv.split("\n")
      lines.pop() // 去掉csv檔固定多一行的空白行
      let result = []
      let headers=lines[0].split(",")
      for (let i=1; i<lines.length; i++) {
        let obj = {}
        let currentline = lines[i].split(",")
        for (let j = 0; j < headers.length; j++) {
          
          if (currentline[j] != '' || currentline[j] != undefined) {
            // console.log(currentline[j])
            obj[headers[j].replace('\r', '')] = currentline[j].replace('\r', '')
          }
        }
        result.push(obj)
      }
      console.log(result) //JavaScript object
      // console.log(JSON.stringify(result)) //JSON

      this.API_POST_CSVJson(this.selectedRows_level2[0].equipmentId, result)
    },
    JsonToCsv() {
      if (this.editDisable == true) {
        errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectEquipt'))
        return null
      }
      this.API_GET_CSVJson(this.selectedRows_level2[0].equipmentId)

      // 測試用數據
      // let data = [{"columnA":"Susan","columnB":"41","columnC":"a"},{"columnA":"Mike","columnB":"5","columnC":"b"},{"columnA":"Jake","columnB":"33","columnC":"c"},{"columnA":"Jill","columnB":"30","columnC":"d"}]
      // this.buildData(data).then(data => this.downloadCSV(data))
    },
    buildData(data) {
      return new Promise((resolve, reject) => {
        console.log(data);
        // 最後所有的資料會存在這
        let arrayData = [];
        // 取 data 的第一個 Object 的 key 當表頭
        let arrayTitle = Object.keys(data[0]);
        arrayData.push(arrayTitle);
        // 取出每一個 Object 裡的 value，push 進新的 Array 裡
        Array.prototype.forEach.call(data, d => {
          let items = [];
          Array.prototype.forEach.call(arrayTitle, title => {
            let item = d[title] || '無';
            items.push(item);
          });
          arrayData.push(items)
        })
        resolve(arrayData);
      })
    },
    downloadCSV(data) {
      let csvContent = '';
      Array.prototype.forEach.call(data, d => {
        let dataString = d.join(',') + '\n';
        csvContent += dataString;
      })

      // 下載的檔案名稱
      let fileName = this.$t('IIOT007.EquipmentNo') + (new Date()).getDate() + '.csv';

      // 建立一個 a，並點擊它
      let link = document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
      link.setAttribute('download', fileName);
      link.click();
    },
    errorDetailMsg(msg) {
      this.$q.notify({
        color: 'negative',
        position: 'bottom',
        message: msg,
        icon: 'report_problem',
      })
    },
    removeEqptChip(item) {
      this.dialogTable.copyEqptTarget.forEach((ele, index) => {
        if (ele.guid == item) {
          this.dialogTable.copyEqptTarget.splice(index, 1)
        }
      })
    },
    clickEnterToChangePage(page) {
      this.API_GET_WorkshopData('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_EqptBasicInfo_detail('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePage_dialog(currentType, page) {
      if (currentType == 2) {
        this.API_GET_EqptBasicInfo('', '', page, 10)
      } else if (currentType == 3) {
        this.API_GET_ParamType('', '', page, 10)
      } else if (currentType == 6) {
        this.API_GET_FACTORY('', '', page, 10)
      } else if (currentType == 7) {
        this.API_GET_GROUP('', '', page, 10)
      }
    },
    onSearch(keyword) {
      this.API_GET_WorkshopData('', keyword, 1, this.paginationPageSize)
    },
    onSearch_dialog(currentType, keyword) {
      console.log(currentType)
      if (currentType == 2) {
        this.API_GET_EqptBasicInfo('', keyword, 1, 10)
      } else if (currentType == 3) {
        this.API_GET_Param('', keyword, 1, 10)
      } else if (currentType == 4) {
        this.API_GET_WorkshopData('', keyword, 1, 10, 1, null, 'unique')
      } else if (currentType == 5) {
        // 複製功能，選擇複製目標設備
        this.API_GET_EqptBasicInfo(
          '',
          keyword,
          1,
          10,
          'reversion',
          this.dialogTable.copiedEqptObjectInput.equipmentGuid,
          1
        )
      } else if (currentType == 6) {
        this.API_GET_FACTORY('', keyword, 1, 10, 1, null, 'unique')
      } else if (currentType == 7) {
        this.API_GET_GROUP('', keyword, 1, 10, 1, null, 'unique')
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
      this.API_GET_WorkshopData_detail(
          '',
          '',
          1,
          this.paginationPageSize,
          params.data.equipmentId)
    },
    onCellClicked_level2(params) {
      console.log('Cell level2 was clicked')
      console.log(params)
      // this.dialogTable.selectedRows = params

      // this.jumpAgGridDialog = true
      setTimeout(() => {
        this.drawLineChart() // 測試用
      }, 1000)
    },
    onCellDoubleClicked(params) {
      console.log('Cell was double clicked')
      console.log(params)
      console.log(this.currentType);
      this.dialogTable.selectedRows = params
      if (params.length != 0) {
        if (this.currentType == 1) {
          this.dialogTable.eqptBoxInput = params.data
        } else if (this.currentType == 2) {
          this.dialogTable.equipmentBasicInfoInput = params.data
          this.API_GET_EqptBasicInfo_EDIT('', '', 1, this.paginationPageSize, params.data.id)
        } else if (this.currentType == 3) {
          this.dialogTable.processTypeInput = params.data
        } else if (this.currentType == 4) {
          // 複製功能: 選擇設備對象
          this.dialogTable.copiedEqptObjectInput = params.data
          this.API_GET_WorkshopData(
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
        } else if (this.currentType == 6) {
          this.dialogTable.factoryInput = params.data
          this.dialogTable.groupInput = ''
        } else if (this.currentType == 7) {
          this.dialogTable.groupInput = params.data
        } else if (this.currentType == 9) {
          this.dialogTable.dataInput = params.data
        } else if (this.currentType == 10) {
          this.dialogTable.networkTypeInput = params.data
        }
      }
      this.ag_gridDialog = false
    },
    onSelectionChanged() {
      this.level = 1
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()
      console.log(this.selectedRows[0])

      if (this.selectedRows.length != 0) {
        this.API_GET_WorkshopData_detail(
          '',
          '',
          1,
          this.paginationPageSize,
          this.selectedRows[0].equipmentId)
      }

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
        this.selectedDelDataNo = this.dialogTable.busParamInput.paramNo
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
    onSelectionChanged_level2() {
      this.level = 2
      this.selectedRows_level2 = []
      this.selectedRows_level2 = this.agGridLevel2.gridApi.getSelectedRows()

      console.log(this.selectedRows_level2[0])

      if (this.selectedRows_level2.length > 0 && this.selectedRows_level2.length <= 1) {
        this.selectedDelDataNo = this.dialogTable.busParamInput.paramNo
        this.editDisable = false
        this.delDisable = false
      } else if (this.selectedRows_level2.length > 1) {
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
        .map((node) => `${node.groupNo} ${node.paramType}`)
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
    getTodayDate() {
      let fullDate = new Date()
      let yyyy = fullDate.getFullYear()
      let MM = fullDate.getMonth() + 1 >= 10 ? fullDate.getMonth() + 1 : '0' + (fullDate.getMonth() + 1)
      let dd = fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()
      let today = dd + '/' + MM + '/' + yyyy
      return today
    },
    onSelectionFactory(event) {},
    openAddBusParamDialog() {
      this.addBusParamDialog_Step1 = true

      // 清空欄位
      this.dialogTable.factoryInput.factoryNo = ''
      this.dialogTable.factoryInput.factoryName = ''
      this.dialogTable.groupInput.groupNo = ''
      this.dialogTable.groupInput.groupName = ''
      this.dialogTable.equipmentBasicInfoInput.typeName = ''
      this.dialogTable.equipmentBasicInfoInput.equipmentNo = ''
      this.dialogTable.equipmentBasicInfoInput.equipmentName = ''
      this.dialogTable.networkTypeInput.typeName = ''
      this.dialogTable.processTypeInput.typeNo = ''
      this.dialogTable.processTypeInput.typeName = ''
      this.dialogTable.busParamInput.paramNo = ''
      this.dialogTable.busParamInput.paramPath = ''
      this.dialogTable.dataInput.typeNo = ''
      this.dialogTable.dataInput.typeName = ''
      this.dialogTable.detail.nodePath = ''

      this.API_GET_TaskType('', '', 1, this.paginationPageSize) // 取得任務類型清單 上傳、下發
      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
    },
    openEditBusParamDialog() {
      let selectedNodes = ''
      if (this.editDisable == true) {
        return null
      }
      if (this.level == 1) {
        selectedNodes = this.gridApi.getSelectedNodes()
      } else if (this.level == 2){
        selectedNodes = this.agGridLevel2.gridApi.getSelectedNodes()
      }
      let selectedData = selectedNodes.map((node) => node.data)
      if (selectedNodes.length == 0) {
        return null
      }
      console.log(selectedData[0])

      this.API_GET_WorkshopData_EDIT('', selectedData[0].id, selectedData[0].processType)
      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單

      this.editBusParamDialog_step1 = true
    },
    openDelGroupConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }

      this.delGroupDialog = true

      const selectedNodes = this.agGridLevel2.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      console.log(selectedData)
      // selectedDelParamNo
    },
    openCopyBusParamDialog() {
      this.dialogTable.copiedEqptObjectInput = {
        // 被複製設備對象
        guid: null,
        equipmentGuid: null,
        equipmentNo: null,
        equipmentName: null,
        typeGuid: null,
        boxGuid: null,
        protocolGuid: null,
        paramGuid: null,
        paramPath: null,
      }
      this.dialogTable.copyEqptTarget = []
      this.copyBusParamDialog = true
    },
    openTableDialog(type, tableColumn) {
      this.dialogTable.keyword = ''
      this.dialogTable.gridOptions = {}
      this.dialogTable.editType = 'fullRow' // 整排編輯
      this.dialogTable.paginationPageSize = 10 // 預設顯示資料筆數

      this.dialogTable.columnDefs = tableColumn

      this.dialogTable.defaultColDef = {
        flex: 1,
        editable: false,
        sortable: true,
      }

      this.currentType = type
      if (type == 2) {
        if (
          this.dialogTable.groupInput.groupNo == null ||
          this.dialogTable.groupInput.groupNo == undefined
        ) {
          errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectAreaFirst'))
          return null
        }
        this.API_GET_EqptBasicInfo('', '', 1, 10, '', '', '', this.dialogTable.groupInput.id)
        this.dialogTable.title = this.$t('IIOT007.EqptBasicInfoSetting')
        this.ag_gridDialog = true
      } else if (type == 3) {
        // if (this.dialogTable.taskCenterInput.taskType.typeNo == 2025201) {
        //   this.API_GET_DownloadParam('', '', 1, this.paginationPageSize) // 下發參數類型
        // } else if (this.dialogTable.taskCenterInput.taskType.typeNo == 2025202) {
        //   this.API_GET_UploadParam('', '', 1, this.paginationPageSize) // 上傳參數類型
        // } else {
        //   console.error('[前端log] 沒有此任務類型')
        // }
        this.API_GET_UploadParam('', '', 1, this.paginationPageSize) // 上傳參數類型
        this.dialogTable.title = this.$t('IIOT007.ParamType')
        this.ag_gridDialog = true
      } else if (type == 4) {
        this.API_GET_WorkshopData('', '', 1, 10, 1, null, 'unique')
        this.dialogTable.title = this.$t('IIOT007.Equipment') + this.$t('IIOT007.Object')
        this.ag_gridDialog = true
      } else if (type == 5) {
        // 複製功能，選擇複製目標設備
        if (this.dialogTable.copiedEqptObjectInput.equipmentName == null) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: this.$t('IIOT007.warnMSG.pleaseSelectCopyObjectFirst'),
            icon: 'report_problem',
          })
          return null
        }
        this.API_GET_EqptBasicInfo(
          '',
          '',
          1,
          10,
          'reversion',
          this.dialogTable.copiedEqptObjectInput.equipmentGuid,
          1
        )
        this.dialogTable.title = this.$t('IIOT007.Target') + this.$t('IIOT007.Equipment')
        this.ag_gridDialog = true
      } else if (type == 6) {
        this.API_GET_FACTORY('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT007.Select') + this.$t('IIOT007.Factory')
        this.ag_gridDialog = true
      } else if (type == 7) {
        if (this.dialogTable.factoryInput.id == null || this.dialogTable.factoryInput.id == undefined) {
          errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectFactoryFirst'))
          return null
        }
        this.API_GET_GROUP('', '', 1, 10, this.dialogTable.factoryInput.id)
        this.dialogTable.title = this.$t('IIOT007.Select') + this.$t('IIOT007.Group')
        this.ag_gridDialog = true
      } else if (type == 8) {
        this.dialogTable.rowData = this.dialogTable.equipmentStatusValue;
        this.dialogTable.title = this.$t('IIOT007.SetEquipmentStatus')
        this.ag_gridDialog_edit = true;
      } else if (type == 9) {
        if (this.dialogTable.processTypeInput.typeNo == 1001) {
          this.API_GET_EquiptData('', 1, 10)
        } else if (this.dialogTable.processTypeInput.typeNo == 1003) {
          this.API_GET_ProductionData('', 1, 10)
        } else {
          // nothing
        }
        this.dialogTable.title = this.$t('IIOT007.DataNo')
        this.ag_gridDialog = true
      } else if (type == 10) {
        this.API_GET_IndustrialProtocol('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT007.Select') + this.$t('IIOT005.NetworkType')
        this.ag_gridDialog = true
      }

    },
    setDialogInput(currentType, item) {
      if (item.length != 0) {
        if (currentType == 2) {
          this.dialogTable.equipmentBasicInfoInput = item[0]
        } else if (currentType == 3) {
          this.dialogTable.processTypeInput = item[0]
        } else if (currentType == 4) {
          // 複製功能: 選擇設備對象
          this.dialogTable.copiedEqptObjectInput = item[0]
          this.API_GET_WorkshopData(
            '',
            '',
            1,
            this.paginationPageSize,
            3,
            this.dialogTable.copiedEqptObjectInput.equipmentNo,
            null
          )
        } else if (currentType == 5) {
          // 複製功能: 選擇目標設備
          item.forEach((ele) => [this.dialogTable.copyEqptTarget.push(ele)])
        }
      }

      this.ag_gridDialog = false
    },
    editDialogConfirm() {

    },
    ag_gridDialog_edit_confirmBtn(data) {
      this.dialogTable.gridApi.stopEditing()
      console.log(data);
      this.dialogTable.equipmentStatusList.run = data[0].equiptStatusValue;
      this.dialogTable.equipmentStatusList.idle = data[1].equiptStatusValue;
      this.dialogTable.equipmentStatusList.error = data[2].equiptStatusValue;
      this.dialogTable.equipmentStatusList.setup = data[3].equiptStatusValue;
      this.dialogTable.equipmentStatusList.shutdown = data[4].equiptStatusValue;
      this.dialogTable.equipmentStatusList.repair = data[5].equiptStatusValue;
      this.dialogTable.equipmentStatusList.maintenance = data[6].equiptStatusValue;
      this.dialogTable.equipmentStatusList.hold = data[7].equiptStatusValue;
      console.log(this.dialogTable.equipmentStatusList);
      this.ag_gridDialog_edit = false;
    },
    saveCopyParam() {
      if (this.dialogTable.copiedEqptObjectInput.equipmentName == null) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('IIOT007.warnMSG.pleaseSelectCopyObjectFirst'),
          icon: 'report_problem',
        })
      }

      if (this.dialogTable.copyEqptTarget.length == 0) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('IIOT007.warnMSG.pleaseSelectCopyTargetFirst'),
          icon: 'report_problem',
        })
        return null
      }

      let ary = this.copiedEqptObject
      this.dialogTable.copyResult = []
      this.dialogTable.copyEqptTarget.forEach((ele) => {
        ary.forEach((item) => {
          item.equipmentGuid = ele.guid
        })
        this.transform(ary)
      })
    },
    changeTaskType(item) {
      this.dialogTable.taskCenterInput.taskType = item
      this.dispMenuTaskType = false
      this.dialogTable.processTypeInput.typeNo = null
      this.dialogTable.processTypeInput.typeName = null
    },
    changeUpperSystem(item) {
      this.dialogTable.taskCenterInput.upperSystem = item
      this.dispMenuUpperSystem = false
    },
    changePage_dialog(currentType, type) {
      if (currentType == 2) {
        this.API_GET_EqptBasicInfo(type)
      } else if (currentType == 3) {
        this.API_GET_ParamType(type)
      } else if (currentType == 6) {
        this.API_GET_FACTORY(type)
      } else if (currentType == 7) {
        this.API_GET_GROUP(type)
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
    addNewBusParam(taskTypeNo, equipmentBasicInfoInput, processTypeInput, busParamInput, taskCenterInput) {
      if (taskTypeNo == 2025202) {
        // 上傳任務
        this.API_POST_UploadParam(equipmentBasicInfoInput, processTypeInput, busParamInput)
      } else if (taskTypeNo == 2025201) {
        // 下發任務
        this.API_POST_DownloadParam(
          equipmentBasicInfoInput,
          processTypeInput,
          busParamInput,
          taskCenterInput
        )
      }
    },
    editBusParam(taskTypeNo, equipmentBasicInfoInput, processTypeInput, busParamInput, taskCenterInput) {
      if (taskTypeNo == 2025202) {
        // 上傳任務
        this.API_PUT_UploadParam(equipmentBasicInfoInput, processTypeInput, busParamInput)
      } else if (taskTypeNo == 2025201) {
        // 下發任務
        this.API_PUT_DownloadParam(
          equipmentBasicInfoInput,
          processTypeInput,
          busParamInput,
          taskCenterInput
        )
      }
    },
    changeStep(step, processTypeInput) {
      console.log(processTypeInput);
      if (step == 1) {
        this.addBusParamDialog_Step1 = true
      } else if (step == 2) {
        this.$refs.addBusParamDialog_Step1.validate().then((success) => {
          if (success) {
            // 檢查第一步驟有沒有選擇設備
            if (this.dialogTable.equipmentBasicInfoInput.equipmentNo == '' || 
                this.dialogTable.equipmentBasicInfoInput.equipmentNo == undefined) {
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectEquipt'))
              return null
            }
            // 檢查第一步驟有沒有選擇聯網類型
            if (this.dialogTable.networkTypeInput.typeName == '' || 
                this.dialogTable.networkTypeInput.typeName == undefined) {
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectnetworkType'))
              return null
            }
            // 判斷第一步驟 參數類型選甚麼 
            if (processTypeInput.typeNo == 1001) {  // 1001=設備訊息
              this.manuallySetDataNoBool = false
            } else if (processTypeInput.typeNo == 1002) { // 1002=設備參數
              this.manuallySetDataNoBool = true
            } else if (processTypeInput.typeNo == 1003) { // 1003=生產數量
              this.manuallySetDataNoBool = false
            } else if (processTypeInput.typeName == '' || processTypeInput.typeName == undefined) {
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectprocessType'))
              return null
            } else {
              console.error("[前端] processTypeInput 判斷式查無此參數編號");
              return null
            }

            if (this.dialogTable.networkTypeInput.typeNo == '103') { // 如果選 OPCUA 則需設定nodePath
              this.displayNodePath = true
            } else {
              this.displayNodePath = false
            }
            this.addBusParamDialog_Step2 = true;
          }
        })
      }
    },
    changeStepEdit(step, processTypeInput) {
      console.log(processTypeInput);
      if (step == 1) {
        this.editBusParamDialog_step1 = true
      } else if (step == 2) {
        this.$refs.editBusParamDialog_step1.validate().then((success) => {
          if (success) {
            // 檢查第一步驟有沒有選擇設備
            if (this.dialogTable.equipmentBasicInfoInput.equipmentName == undefined) { // 設備名稱可以為空
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectEquipt'))
              return null
            }
            // 檢查第一步驟有沒有選擇聯網類型
            if (this.dialogTable.networkTypeInput.typeName == '' || 
                this.dialogTable.networkTypeInput.typeName == undefined) {
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectnetworkType'))
              return null
            }
            // 判斷第一步驟 參數類型選甚麼 
            if (processTypeInput.typeNo == 1001) {  // 1001=設備訊息
              this.manuallySetDataNoBool = false
            } else if (processTypeInput.typeNo == 1002) { // 1002=設備參數
              this.manuallySetDataNoBool = true
            } else if (processTypeInput.typeNo == 1003) { // 1003=生產數量
              this.manuallySetDataNoBool = false
            } else if (processTypeInput.typeName == '' || processTypeInput.typeName == undefined) {
              errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectprocessType'))
              return null
            } else {
              console.error("[前端] processTypeInput 判斷式查無此參數編號");
              return null
            }

            if (this.dialogTable.networkTypeInput.typeNo == '103') { // 如果選 OPCUA 則需設定nodePath
              this.displayNodePath = true
            } else {
              this.displayNodePath = false
            }
            this.editBusParamDialog_step2 = true;
          }
        })
      }
    },
    API_GET_TaskType(url, search, pageNumber, pageSize) {
      let _this = this
      API_GET_TaskType(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data)
          this.taskTypeList = res.data
          if (
            this.dialogTable.taskCenterInput.taskType.typeNo == null ||
            this.dialogTable.taskCenterInput.taskType.typeNo == undefined
          ) {
            this.dialogTable.taskCenterInput.taskType.typeNo = res.data[0].typeNo
            this.dialogTable.taskCenterInput.taskType.typeName = res.data[0].typeName
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_TaskType 失敗!')
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
    API_GET_GROUP(url, search, pageNumber, pageSize, factoryId) {
      // 群組
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
    API_GET_UploadParam(url, search, pageNumber, pageSize) {
      let _this = this
      API_GET_UploadParam(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data)
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
          errorDetailMsg('API_GET_UploadParam 失敗!')
        })
    },
    API_GET_DownloadParam(url, search, pageNumber, pageSize) {
      let _this = this
      API_GET_DownloadParam(url, search, pageNumber, pageSize)
        .then((res) => {
          console.log(res.data)
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
          errorDetailMsg('API_GET_DownloadParam 失敗!')
        })
    },
    API_POST_WorkshopData(taskCenterInput, equipmentBasicInfoInput, detail, equipmentStatusList, operateStatusInput, processTypeInput, dataInput) {
      console.log(taskCenterInput);
      // if (this.dialogTable.dataInput.typeNo == '' ||
      //     this.dialogTable.dataInput.typeNo == undefined) {
      //   errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectNetworkType'))
      //   return null
      // }
      // 新增車間數據
      this.$refs.addBusParamDialog_Step1.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_POST_WorkshopData(
            equipmentBasicInfoInput.id,
            operateStatusInput.typeNo,
            detail,
            equipmentStatusList,
            processTypeInput.typeNo,
            taskCenterInput.taskType.typeNo,
            dataInput.typeNo,
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addBusParamDialog_Step1 = false // 關閉新增Dialog
                this.addBusParamDialog_Step2 = false // 關閉新增Dialog
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
    API_PUT_WorkshopData(dataInput, taskCenterInput, equipmentBasicInfoInput, detail, equipmentStatusList, operateStatusInput, processTypeInput) {
      console.log(equipmentBasicInfoInput);
      // if (this.dialogTable.dataInput.typeNo == '' ||
      //     this.dialogTable.dataInput.typeNo == undefined) {
      //   errorDetailMsg(this.$t('IIOT007.warnMSG.pleaseSelectNetworkType'))
      //   return null
      // }
      // 新增車間數據
      this.$refs.editBusParamDialog_step1.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_PUT_WorkshopData(
            dataInput.id,
            equipmentBasicInfoInput.id,
            operateStatusInput.typeNo,
            detail,
            equipmentStatusList,
            taskCenterInput.taskType.typeNo,
            dataInput.typeNo,
            processTypeInput.typeNo
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editBusParamDialog_step1 = false // 關閉編輯Dialog
                this.editBusParamDialog_step2 = false // 關閉編輯Dialog
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
    API_POST_UploadParam(equipmentBasicInfoInput, processTypeInput, busParamInput) {
      // 新增上傳業務參數配置資料
      this.$refs.addBusParamDialog_Step1.validate().then((success) => {
        if (success) {
          this.submitting = true

          // 新增一筆業務參數
          let _this = this
          API_POST_UploadParam(
            busParamInput.paramNo,
            busParamInput.paramPath,
            equipmentBasicInfoInput.id,
            processTypeInput.typeNo,
            busParamInput.isDisable
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addBusParamDialog_Step1 = false // 關閉新增Dialog
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
    API_POST_DownloadParam(equipmentBasicInfoInput, processTypeInput, busParamInput, taskCenterInput) {
      // 新增上傳業務參數配置資料
      this.$refs.addBusParamDialog_Step1.validate().then((success) => {
        if (success) {
          this.submitting = true

          // 新增一筆業務參數
          let _this = this
          API_POST_DownloadParam(
            busParamInput.paramNo,
            equipmentBasicInfoInput.id,
            taskCenterInput.upperSystem.typeNo,
            processTypeInput.typeNo,
            busParamInput.isDisable
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.addBusParamDialog_Step1 = false // 關閉新增Dialog
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
    API_PUT_UploadParam(equipmentBasicInfoInput, processTypeInput, busParamInput) {
      // 新增上傳業務參數配置資料
      this.$refs.editBusParamForm.validate().then((success) => {
        if (success) {
          console.log(equipmentBasicInfoInput)
          this.submitting = true
          let _this = this
          API_PUT_UploadParam(
            busParamInput.id,
            busParamInput.paramNo,
            busParamInput.paramPath,
            equipmentBasicInfoInput.id,
            processTypeInput.typeNo,
            busParamInput.isDisable
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editBusParamDialog_step1 = false // 關閉修改Dialog
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
    API_PUT_DownloadParam(equipmentBasicInfoInput, processTypeInput, busParamInput, taskCenterInput) {
      // 新增上傳業務參數配置資料
      this.$refs.editBusParamForm.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_PUT_DownloadParam(
            busParamInput.id,
            busParamInput.paramNo,
            equipmentBasicInfoInput.id,
            taskCenterInput.upperSystem.typeNo,
            processTypeInput.typeNo,
            busParamInput.isDisable
          )
            .then((res) => {
              this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT007.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })
              setTimeout(() => {
                this.submitting = false
                this.editBusParamDialog_step1 = false // 關閉修改Dialog
              }, 1000)
            })
            .catch((error) => {
              console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
              console.log(error)
              errorDetailMsg(error.response.data.message)
              setTimeout(() => {
                _this.submitting = false
              }, 1000)
            })
        }
      })
    },
    API_GET_EqptBasicInfo(
      url,
      search,
      pageNumber,
      pageSize,
      businessType,
      guid,
      tableType,
      groupId
    ) {
      // 取得設備基礎資料配置資料
      let _this = this
      API_GET_EqptBasicInfo(url, search, pageNumber, pageSize, groupId)
        .then((res) => {
          console.log(res.data);
          if (tableType == 1) {
            this.dialogTable.rowData = []
            this.dialogTable.copyEqptTarget.forEach((item) => {
              res.data.forEach((ele, index) => {
                if (ele.guid == item.guid) {
                  res.data.splice(index, 1)
                }
              })
            })
            setTimeout(() => {
              this.dialogTable.rowData = res.data
            }, 500)
          } else {
            this.dialogTable.rowData = res.data
          }

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
          errorDetailMsg('API_GET_EqptBasicInfo 失敗!')
        })
    },
    API_GET_EqptBasicInfo_EDIT(url, search, pageNumber, pageSize, id) {
      let _this = this
      API_GET_EqptBasicInfo_EDIT(url, search, pageNumber, pageSize, id)
        .then((res) => {
          console.log(res.data);

          if (res.data.length != 0) {
            this.dialogTable.networkTypeInput.typeNo = res.data.networkType
            this.dialogTable.networkTypeInput.typeName = res.data.networkTransl
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EqptBasicInfo_EDIT 失敗!')
        })
    },
    API_GET_Param(url, search, pageNumber, pageSize) {
      // 取得基礎參數資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url = `/manufacture/fixed-parameters?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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
            message: 'API_GET_Param 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_ParamType(url, search, pageNumber, pageSize) {
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url = `/manufacture/business-parameters/timeseries?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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
            message: 'API_GET_ParamType 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_WorkshopData(url, search, pageNumber, pageSize, tableType, equipmentNo, businessType) {
      // 取得業務參數配置資料
      if (JSON.parse(sessionStorage.getItem('pageInfo')).currentTab.path != 'workshopData') {
        return null
      }

      if (equipmentNo == null) {
        equipmentNo = ''
      }

      if (businessType == null) {
        businessType = 'Undefined'
      }

      let _this = this
      API_GET_WorkshopData(url, search, pageNumber, pageSize, equipmentNo, businessType)
        .then((res) => {
          console.log('-----API_GET_WorkshopData-----');
          console.log(res.data);
          if (tableType == 1) {
            this.dialogTable.rowData = res.data
          } else if (tableType == 2) {
            this.rowData = res.data
          } else if (tableType == 3) {
            this.copiedEqptObject = res.data
          } else {
            this.rowData = res.data
          }
          let pagination = JSON.parse(res.headers['x-pagination'])
          this.totalPages = pagination['totalPages']
          this.currentPage = pagination['currentPage']
          this.previousLink = pagination['previousLink']
          this.nextLink = pagination['nextLink']
          this.firstLink = pagination['firstLink']
          this.lastLink = pagination['lastLink']

          if (res.data.length != 0) {
            this.API_GET_WorkshopData_detail('', '', 1, this.paginationPageSize, res.data[0].equipmentId)
          } else {
            this.agGridLevel2.rowData = []
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_WorkshopData 失敗!')
        })
    },
    API_GET_EquiptData(url, pageNumber, pageSize) {
      // 取得設備數據(枚舉)
      let _this = this
      API_GET_EquiptData(url, pageNumber, pageSize)
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
    API_GET_ProductionData(url, pageNumber, pageSize) {
      // 取得生產數據(枚舉)
      let _this = this
      API_GET_ProductionData(url, pageNumber, pageSize)
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
    transform(result) {
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
      result.forEach((item) => {
        this.dialogTable.copyResult.push({
          guid: this.guid(),
          paramPath: item.paramPath,
          equipmentGuid: item.equipmentGuid,
          typeGuid: item.typeGuid,
          paramGuid: item.paramGuid,
          boxGuid: item.boxGuid,
          protocolGuid: item.protocolGuid,
          creator: creator,
        })
      })
    },
    API_DEL_WorkshopData(selectRowArea) {
      let _this = this
      let delItem = ''
      selectRowArea.forEach((item) => {
        delItem += item.id + ','
      })
      console.log(delItem);

      API_DEL_WorkshopData(delItem)
        .then((res) => {
          this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT007.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.delGroupDialog = false
            this.onSelectionChanged()
          }, 500)
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg(error.response)
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
    },
    API_GET_WorkshopData_detail(url, search, pageNumber, pageSize, equipmentId) {
      console.log(equipmentId);
      let _this = this
      API_GET_WorkshopData_detail(url, search, pageNumber, pageSize, equipmentId)
        .then((res) => {
          console.log(res.data);
          this.agGridLevel2.rowData = res.data

          if (res.data.length != 0) {
            // this.dialogTable.taskCenterInput.taskType.typeName =
            //   res.data[0].workshopTaskTransl;
            this.dialogTable.processTypeInput.typeName = res.data[0].equipmentCategoryTransl

            // if (missionType == 'PushTask' || missionType == 2025202) {
            //   this.dialogTable.busParamInput.paramNo = res.data[0].attribNo
            //   this.dialogTable.processTypeInput.typeName = res.data[0].timeseriesParamTransl
            //   this.dialogTable.processTypeInput.typeNo = res.data[0].timeseriesParamType
            //   this.dialogTable.busParamInput.paramPath = res.data[0].nodePath
            // } else if (missionType == 'DownloadTask' || missionType == 2025201) {
            //   this.dialogTable.busParamInput.paramNo = res.data[0].commandNo
            //   this.dialogTable.taskCenterInput.upperSystem.typeNo = res.data[0].upperSystemType
            //   this.dialogTable.taskCenterInput.upperSystem.typeName = res.data[0].upperSystemTransl
            //   this.dialogTable.processTypeInput.typeNo = res.data[0].commandParamType
            //   this.dialogTable.processTypeInput.typeName = res.data[0].commandParamTransl
            // }
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
          errorDetailMsg('API_GET_WorkshopData_detail 失敗!')
          this.$q.loading.hide()
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
    API_GET_WorkshopData_EDIT(url, id, processType) {
      let _this = this
      API_GET_WorkshopData_EDIT(url, id, processType)
        .then((res) => {
          console.log(res.data)
          this.dialogTable.dataInput.id = res.data.id
          this.dialogTable.taskCenterInput.taskType.typeNo = res.data.missionType
          this.dialogTable.taskCenterInput.taskType.typeName = res.data.missionTransl
          this.dialogTable.factoryInput.factoryNo = res.data.factoryNo
          this.dialogTable.factoryInput.factoryName = res.data.factoryName
          this.dialogTable.groupInput.groupNo = res.data.groupNo
          this.dialogTable.groupInput.groupName = res.data.groupName
          this.dialogTable.equipmentBasicInfoInput.id = res.data.equipmentId
          this.dialogTable.equipmentBasicInfoInput.equipmentNo = res.data.equipmentNo
          this.dialogTable.equipmentBasicInfoInput.equipmentName = res.data.equipmentName
          this.dialogTable.networkTypeInput.typeNo = res.data.networkType
          this.dialogTable.networkTypeInput.typeName = res.data.networkTransl
          this.dialogTable.processTypeInput.typeNo = res.data.processType
          this.dialogTable.processTypeInput.typeName = res.data.processTransl
          
          if (res.data.part !== undefined && res.data.part !== null) {
            if (res.data.part.dataType !== undefined && res.data.part.dataType !== null) {
              this.dialogTable.dataInput.typeNo = res.data.part.dataType
              // this.dialogTable.dataInput.typeName = res.data.part.typeTransl
            } else if (res.data.part.dataNo !== undefined && res.data.part.dataNo !== null) {
              this.dialogTable.dataInput.typeNo = res.data.part.dataNo
            }
          }

          if (res.data.mapper !== undefined && res.data.mapper !== null) {
            let mapper = res.data.mapper
            this.dialogTable.equipmentStatusList.run = mapper.run
            this.dialogTable.equipmentStatusList.idle = mapper.idle
            this.dialogTable.equipmentStatusList.error = mapper.error
            this.dialogTable.equipmentStatusList.setup = mapper.setup
            this.dialogTable.equipmentStatusList.shutdown = mapper.shutdown
            this.dialogTable.equipmentStatusList.repair = mapper.repair
            this.dialogTable.equipmentStatusList.maintenance = mapper.maintenance
            this.dialogTable.equipmentStatusList.hold = mapper.hold
            this.dialogTable.equipmentStatusValue[0].equiptStatusValue = mapper.run
            this.dialogTable.equipmentStatusValue[1].equiptStatusValue = mapper.idle
            this.dialogTable.equipmentStatusValue[2].equiptStatusValue = mapper.error
            this.dialogTable.equipmentStatusValue[3].equiptStatusValue = mapper.setup
            this.dialogTable.equipmentStatusValue[4].equiptStatusValue = mapper.shutdown
            this.dialogTable.equipmentStatusValue[5].equiptStatusValue = mapper.repair
            this.dialogTable.equipmentStatusValue[6].equiptStatusValue = mapper.maintenance
            this.dialogTable.equipmentStatusValue[7].equiptStatusValue = mapper.hold
          }
          
          if (res.data.detail !== undefined && res.data.detail != null) {
            if (res.data.detail.nodePath !== undefined && res.data.detail.nodePath != null) {
              this.dialogTable.detail.nodePath = res.data.detail.nodePath
            }
          }

        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Networks_EDIT 失敗!')
        })
    },
    API_GET_CSVJson(id) {
      // 取得工廠配置資料
      let _this = this
      API_GET_CSVJson(id)
        .then((res) => {
          console.log(res.data)
          this.buildData(res.data).then(data => this.downloadCSV(data))
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT007.notifyMsg.exportSucess'), // 匯出成功
            icon: 'check_circle_outline',
          })
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_CSVJson 失敗!')
        })
    },
    API_POST_CSVJson(id, json) {
      // 新增車間數據
      this.submitting = true
      let _this = this
      API_POST_CSVJson(id, json)
        .then((res) => {
          this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT007.notifyMsg.importSucess'), // 匯入成功
            icon: 'check_circle_outline',
          })
          setTimeout(() => {
            this.submitting = false
            this.importCSVDialog = false // 關閉Dialog
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
    displayIsDisableFormatter(item) {
      if (item.data.isDisable == true) {
        return this.$t('IIOT007.Disable')
      } else if (item.data.isDisable == false) {
        return this.$t('IIOT007.Enable')
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
    this.paginationPageSize = 10 // 預設顯示資料筆數
    this.columnDefs = [
      {
        field: 'equipmentNo',
        headerName: this.$t('IIOT007.EquipmentNo'), // 設備編號
        checkboxSelection: false,
        width: 90,
      },
      {
        field: 'equipmentName',
        headerName: this.$t('IIOT007.EquipmentName'), // 設備名稱
        width: 90,
      },
      {
        field: 'networkTransl',
        headerName: this.$t('IIOT007.NetworkType'), // 聯網類型
        width: 90,
      },
      // {
      //   field: 'categoryTransl',
      //   headerName: this.$t('IIOT007.ParamType'), // 參數類型
      //   // checkboxSelection: true,
      //   // headerCheckboxSelection: false,
      //   // headerCheckboxSelectionFilteredOnly: false,
      //   editable: false,
      //   unSortIcon: true,
      // },
      // {
      //   field: 'missionTransl',
      //   headerName: this.$t('IIOT007.TaskType'), // 任務類型
      //   editable: false,
      // },
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
        field: 'processTransl',
        headerName: this.$t('IIOT007.ProcessType'), // 數據類型
        checkboxSelection: true,
      },
      {
        field: 'dataNo',
        headerName: this.$t('IIOT007.DataNo'), // 數據編號
      },
      {
        field: 'dataPath',
        headerName: this.$t('IIOT007.DataPath'), // 數據路徑
      },
      // {
      //   field: 'creator',
      //   headerName: this.$t('IIOT007.Creator'),
      //   width: 30,
      // },
      // {
      //   field: 'createTime',
      //   headerName: this.$t('IIOT007.CreateTime'),
      //   comparator: this.dateComparator,
      //   width: 30,
      // },
    ]
    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    this.API_GET_WorkshopData('', '', 1, this.paginationPageSize)
  },
  beforeCreate() {},
  setup() {
    return {}
  },
}
</script>
<style lang="sass" scoped>
@import 'src/css/app.sass'
.lineChart
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 500px
  width: 100%
  padding: 16px
  // border: 1px solid red
  .timeIntervalPanel
    display: flex
    flex-direction: row
    align-items: center
    height: 34px
    width: 90%
    margin: 0 0 16px 0
    padding: 0 16px 0 16px
    color: white
    background-color: $color-polo-blue
    // border: 1px solid red
    .title
      font-weight: bold
    .timeGroup
      .timeItem
        margin: 8px
        cursor: pointer

  #lineChart
    height: 100%
    width: 100%
    
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
