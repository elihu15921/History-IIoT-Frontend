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

    <!--集成設定-->
    <!-- <div
      class="iconBtn"
      @click="openTableDialog(7, this.dialogTable.taskCenterTable)"
    >
      <img src="~assets/icons/png/cloud-upload.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t("IIOT008.btn.integrationSettings") }}
      </q-tooltip>
    </div> -->

    <!--新增-->
    <div class="iconBtn" @click="openAddTaskCenterDialog()">
      <img src="~assets/icons/png/plus.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT008.btn.add') }}
      </q-tooltip>
    </div>

    <!--編輯-->
    <div class="iconBtn" @click="openEditTaskCenterDialog()" :class="{ 'iconBtn-disable': editDisable }">
      <img src="~assets/icons/png/edit.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT008.btn.edit') }}
      </q-tooltip>
    </div>

    <!--刪除-->
    <div class="delBtn" @click="openDelTaskConfirmDialog()" :class="{ 'delBtn-disable': delDisable }">
      <img src="~assets/icons/png/trash_white.png" />
      <q-tooltip anchor="bottom middle" :offset="[5, 5]">
        {{ $t('IIOT008.btn.del') }}
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
        <img src="~assets/icons/png/firstPage.png" @click="API_GET_Task(this.firstLink)" />
        <img src="~assets/icons/png/previousPage.png" @click="API_GET_Task(this.previousLink)" />
        <input
          type="text"
          v-model="this.currentPage"
          oninput="value = value.replace(/[^\d]/g,'')"
          @keypress.enter="clickEnterToChangePage(this.currentPage)"
        />
        <span class="slash">/</span>
        <span class="totalPages">{{ totalPages }}</span>
        <img src="~assets/icons/png/nextPage.png" @click="API_GET_Task(this.nextLink)" />
        <img src="~assets/icons/png/lastPage.png" @click="API_GET_Task(this.lastLink)" />
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
    ></ag-grid-vue>
    <div class="tablePagination">
      <span class="container">
        <img
          src="~assets/icons/png/firstPage.png"
          @click="API_GET_Task_detail(this.agGridLevel2.pagination.firstLink)"
        />
        <img
          src="~assets/icons/png/previousPage.png"
          @click="API_GET_Task_detail(this.agGridLevel2.pagination.previousLink)"
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
          @click="API_GET_Task_detail(this.agGridLevel2.pagination.nextLink)"
        />
        <img
          src="~assets/icons/png/lastPage.png"
          @click="API_GET_Task_detail(this.agGridLevel2.pagination.lastLink)"
        />
      </span>
    </div>
  </div>

  <!-- 新增任務中心 Dialog (第一步) -->
  <q-dialog v-model="addTaskCenterDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.addTaskCenter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addTaskCenterDialog">
        <q-card-section class="dialog-content scroll">
          <!--第一步: 設定任務基礎資料-->
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.firstStep') }}: {{ $t('IIOT008.SetTaskBasicInfo') }}
          </div>

          <!--任務類型-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT008.TaskType') }}
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
          </div>

          <!--任務編號-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.taskCenterInput.taskNo"
            :label="translated.TaskNo"
            type="string"
            required
          /> -->

          <!--任務名稱-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.taskCenterInput.taskName"
            :label="translated.TaskName"
            type="string"
            required
          /> -->

          <!--選擇設備盒子-->
          <!-- <div
            v-if="dialogTable.taskCenterInput.taskType.typeNo == 101"
          >
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t("IIOT008.EqptBox2") }}
            </div>
            <div
              class="inputBtn"
              @click="openTableDialog(1, this.dialogTable.EqptBoxTable)"
            >
              <input
                type="text"
                v-model="dialogTable.eqptBoxInput.boxName"
                readonly
              />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div>
          </div> -->

          <!--選擇設備-->
          <!-- <div style="margin: 8px 0 8px 0" class="label">
            {{ $t("IIOT008.Equipment") }}
          </div>
          <div
            class="inputBtn"
            @click="
              openTableDialog(2, this.dialogTable.equipmentBasicInfoTable)
            "
          >
            <input
              type="text"
              v-model="dialogTable.equipmentBasicInfoInput.equipmentName"
              readonly
            />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
          </div> -->

          <!--生產數據-->
          <!-- <div
            v-bind:class="{
              switchOn: dialogTable.taskCenterInput.isProduction,
            }"
            style="padding: 16px 0; display: flex; flex-direction: row"
            v-if="dialogTable.taskCenterInput.taskType.typeNo == 101"
          >
            <span style="margin: 0 16px 0 0">{{ $t('IIOT008.ProductionData') }} :</span>
            <div
              class="slideToggle"
              @click="
                dialogTable.taskCenterInput.isProduction = !dialogTable.taskCenterInput.isProduction
              "
            >
              <div class="switchBtn"></div> -->
              <!--啟用/停用 按鈕-->
            <!-- </div>
          </div> -->

          <!--生產環境(下拉)-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT008.Situation') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuSituationType = !dispMenuSituationType">
              <input type="text" v-model="dialogTable.situationTypeInput.typeName" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuSituationType == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuSituationType == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuSituationType" @mouseleave="dispMenuSituationType = false">
              <li v-for="(item, key) in situationTypeList" :key="key" @click="changeSituationType(item)">
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
            :label="translated.btn.next"
            :loading="submitting"
            @click="changeStep(2)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 新增任務中心 Dialog (第二步: 選擇設備) -->
  <q-dialog v-model="addTaskCenterDialog_Step2" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.addTaskCenter') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addTaskCenterDialog_Step2">
        <q-card-section class="dialog-content scroll">
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.secondStep') }}:
            {{ $t('IIOT008.SelectEquipt') }}
          </div>

          <!--選擇業務參數(參數編號)-->
          <!-- <div style="margin: 16px 0 8px 0" class="label">
              {{ $t("IIOT008.ParamNo") }}
            </div>
            <div
              class="inputBtn"
              @click="openTableDialog(4, this.dialogTable.busParamTable)"
            >
              <input
                type="text"
                v-model="dialogTable.busParamInput.attribNo"
                readonly
              />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div> -->

          <!--參數類型-->
          <!-- <dw-input
              style="margin-bottom: 16px"
              v-model="dialogTable.busParamInput.fixedParamType"
              :label="translated.ParamType"
              type="string"
              readonly
            /> -->

          <!--選擇工廠-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.Factory') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(9, this.dialogTable.factoryTable)">
            <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
          </div>

          <!--選擇區域-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.Group') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(10, this.dialogTable.areaTable)">
            <input type="text" v-model="dialogTable.groupInput.groupNo" readonly />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
          </div>

          <!--選擇設備(設備編號)-->
          <div style="margin: 8px 0 8px 0" class="label">
            {{ $t('IIOT008.EquipmentNo') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(11, this.dialogTable.equipmentBasicInfoTable)">
            <input type="text" v-model="dialogTable.equipmentBasicInfoInput.equipmentNo" readonly />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
          </div>

          <!--設備名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
            readonly
          />

          <!--設備類型-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentType"
            :label="translated.EquipmentCategory"
            type="string"
            readonly
          /> -->

          <!--上傳MES-->
          <!-- <div
            v-if="dialogTable.taskCenterInput.taskType.typeNo == 101"
            v-bind:class="{ switchOn: dialogTable.taskCenterInput.isUpload }"
            style="padding: 16px 0; display: flex; flex-direction: row"
          >
            <span style="margin: 0 16px 0 0">{{ $t('IIOT008.UploadMES') }} :</span>
            <div
              class="slideToggle"
              @click="dialogTable.taskCenterInput.isUpload = !dialogTable.taskCenterInput.isUpload"
            >
              <div class="switchBtn"></div> -->
              <!--啟用/停用 按鈕-->
            <!-- </div>
          </div> -->

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 0 0 8px 0" class="label">
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
            :label="translated.btn.previous"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.save"
            :loading="submitting"
            @click="API_POST_Task(
              dialogTable.taskCenterInput, 
              dialogTable.equipmentBasicInfoInput,
              dialogTable.operateStatusInput, 
              dialogTable.situationTypeInput
              )"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯任務中心 Dialog (第一步)-->
  <q-dialog v-model="editTaskCenterDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT008.editTaskCenter') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="editTaskCenterDialog">
        <q-card-section class="dialog-content scroll">
          <!--第一步: 編輯任務基礎資料-->
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.firstStep') }}: {{ $t('IIOT008.SetTaskBasicInfo') }}
          </div>

          <!--任務類型-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.taskCenterInput.taskType.typeName"
            :label="translated.TaskType"
            type="string"
            required
            readonly
          />

          <!--任務編號-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.taskCenterInput.taskNo"
            :label="translated.TaskNo"
            type="string"
            required
          /> -->

          <!--任務名稱-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.taskCenterInput.taskName"
            :label="translated.TaskName"
            type="string"
            required
          /> -->

          <!--生產數據-->
          <!-- <div
            v-bind:class="{
              switchOn: dialogTable.taskCenterInput.isProduction,
            }"
            v-if="dialogTable.taskCenterInput.taskType.typeNo == 101"
            style="padding: 16px 0; display: flex; flex-direction: row"
          >
            <span style="margin: 0 16px 0 0">{{ $t('IIOT008.ProductionData') }} :</span>
            <div
              class="slideToggle"
              @click="
                dialogTable.taskCenterInput.isProduction = !dialogTable.taskCenterInput.isProduction
              "
            >
              <div class="switchBtn"></div> -->
              <!--啟用/停用 按鈕-->
            <!-- </div>
          </div> -->

          <!--生產環境(下拉)-->
          <div style="margin: 0 0 8px 0" class="label">
            {{ $t('IIOT008.Situation') }}
          </div>
          <div class="dropdownMenu">
            <div class="input" @click="dispMenuSituationType = !dispMenuSituationType">
              <input type="text" v-model="dialogTable.situationTypeInput.typeName" readonly />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuSituationType == true" />
              <img
                class="arrowIcon"
                src="~assets/icons/svg/down.svg"
                v-show="dispMenuSituationType == false"
              />
            </div>
            <ul class="selectMenu" v-if="dispMenuSituationType" @mouseleave="dispMenuSituationType = false">
              <li v-for="(item, key) in situationTypeList" :key="key" @click="changeSituationType(item)">
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
            :label="translated.btn.next"
            :loading="submitting"
            @click="changeEditStep(2)"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 編輯任務中心 Dialog (第二步: 選擇設備)-->
  <q-dialog v-model="editTaskCenterDialog_BusParam" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">
          {{ $t('IIOT008.editTaskCenter') }}
        </div>
      </q-card-section>

      <q-form class="dw-form" ref="editTaskCenterDialog_BusParam">
        <q-card-section class="dialog-content scroll">
          <div style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold" class="label">
            {{ $t('IIOT008.secondStep') }}:
            {{ $t('IIOT008.SelectEquipt') }}
          </div>

          <div v-if="dialogTable.taskCenterInput.taskType.typeNo == 0">
            <!--選擇業務參數(參數編號)-->

            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT008.ParamNo') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(4, this.dialogTable.busParamTable)">
              <input type="text" v-model="dialogTable.busParamInput.attribNo" readonly />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div>

            <!--參數類型-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="dialogTable.busParamInput.fixedParamType"
              :label="translated.ParamType"
              type="string"
              readonly
            />

            <!--設備編號-->
            <dw-input
              style="margin-bottom: 16px"
              v-model="dialogTable.busParamInput.equipmentNo"
              :label="translated.EquipmentNo"
              type="string"
              readonly
            />
          </div>

          <div>
            <!--設備盒子-->
            <!-- <div style="padding: 16px 0">
              <span>{{ $t("IIOT008.EqptBox2") }} : </span>
              <span> {{ this.dialogTable.eqptBoxInput.boxName }} </span>
            </div> -->

            <!--選擇工廠-->
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT008.Factory') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(9, this.dialogTable.factoryTable)">
              <input type="text" v-model="dialogTable.factoryInput.factoryNo" readonly />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div>

            <!--選擇區域-->
            <div style="margin: 16px 0 8px 0" class="label">
              {{ $t('IIOT008.Group') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(10, this.dialogTable.areaTable)">
              <input type="text" v-model="dialogTable.groupInput.groupNo" readonly />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div>

            <!--選擇設備(設備編號)-->
            <div style="margin: 8px 0 8px 0" class="label">
              {{ $t('IIOT008.EquipmentNo') }}
            </div>
            <div class="inputBtn" @click="openTableDialog(11, this.dialogTable.equipmentBasicInfoTable)">
              <input type="text" v-model="dialogTable.equipmentBasicInfoInput.equipmentNo" readonly />
              <button>
                <img src="~assets/icons/svg/add.svg" />
              </button>
            </div>
          </div>

          <!--設備名稱-->
          <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentName"
            :label="translated.EquipmentName"
            type="string"
            readonly
          />

          <!--設備類別-->
          <!-- <dw-input
            style="margin-bottom: 16px"
            v-model="dialogTable.equipmentBasicInfoInput.equipmentType"
            :label="translated.EquipmentCategory"
            type="string"
            readonly
          /> -->

          <!--上傳MES-->
          <!-- <div
            v-bind:class="{ switchOn: dialogTable.taskCenterInput.isUpload }"
            style="padding: 16px 0; display: flex; flex-direction: row"
          >
            <span style="margin: 0 16px 0 0">{{ $t('IIOT008.UploadMES') }} :</span>
            <div
              class="slideToggle"
              @click="dialogTable.taskCenterInput.isUpload = !dialogTable.taskCenterInput.isUpload"
            >
              <div class="switchBtn"></div> -->
              <!--啟用/停用 按鈕-->
            <!-- </div>
          </div> -->

          <!--操作狀態(啟用/停用)-->
          <div style="margin: 0 0 8px 0" class="label">
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
            :label="translated.btn.previous"
            v-close-popup
          />
          <dw-button
            class="button-theme text-white button-theme-add"
            :label="translated.btn.save"
            :loading="submitting"
            @click="API_PUT_Task(
              dialogTable.taskCenterInput, 
              dialogTable.equipmentBasicInfoInput,
              dialogTable.operateStatusInput, 
              dialogTable.situationTypeInput
            )"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- 確認刪除任務資料 Dialog -->
  <q-dialog v-model="delTaskDialog" persistent>
    <q-card class="bg-dialog">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.delTaskCenter') }}</div>
      </q-card-section>

      <q-card-section>
        <span style="margin: 0 16px 0 0">
          {{ $t('IIOT008.delSlectItem') }}
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
          @click="API_DEL_Task(this.selectedRows_level2)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 複製任務中心 Dialog -->
  <q-dialog v-model="copyBusParamDialog" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section style="padding: 16px 16px 8px 16px">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.CopyParam') }}</div>
      </q-card-section>

      <q-form class="dw-form" ref="addBusParamForm">
        <q-card-section class="dialog-content scroll">
          <!--選擇複製對象-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.Select') }}{{ $t('IIOT008.Copy') }}{{ $t('IIOT008.Object') }}
          </div>
          <div class="inputBtn" @click="openTableDialog(4, this.dialogTable.equipmentBasicInfoTable)">
            <input type="text" v-model="dialogTable.copiedEqptObjectInput.equipmentName" readonly />
            <button>
              <img src="~assets/icons/svg/add.svg" />
            </button>
          </div>

          <!--選擇複製目標-->
          <div style="margin: 16px 0 8px 0" class="label">
            {{ $t('IIOT008.Select') }}{{ $t('IIOT008.Copy') }}{{ $t('IIOT008.Target') }}
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
        <button class="prevBtn" @click="changeDialogPage(this.currentType, 'default')">
          <img src="~assets/icons/svg/chevron_left.svg" />
        </button>
        <div class="dialogTitle text-h6">{{ $t('IIOT008.Select') }}{{ dialogTable.title }}</div>
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

      <q-card-actions align="between" v-if="currentType == 8">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          @click="changeDialogPage(this.currentType, 'default')"
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.confirm"
          @click="changeDialogPage(this.currentType, 'confirmBtn')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ag-grid Dialog -->
  <q-dialog class="customDialog" v-model="ag_gridDialog_upload" persistent position="right">
    <q-card class="bg-dialog-fullHeight">
      <q-card-section class="dialog-title">
        <div class="dialogTitle text-h6">{{ $t('IIOT008.Select') }}{{ dialogTable.title }}</div>
      </q-card-section>

      <q-card-section class="dialog-content">
        <div class="searchBar">
          <!--查詢-->
          <div class="searchContainer">
            <input
              class="searchInput"
              style="width: 442px"
              type="text"
              v-model="dialogTable.keyword"
              :placeholder="translated.input.pleaseEnter"
              id="quickFilter"
            />
            <button class="searchBtn" @click="onSearch_dialog(this.currentType, dialogTable.keyword)">
              <img src="~assets/icons/svg/search.svg" />
            </button>
            <!--新增按鈕-->
            <div
              class="iconBtn"
              style="margin-left: 8px"
              @click="openTableDialog(8, this.dialogTable.taskCenterTable)"
            >
              <img src="~assets/icons/png/plus.png" />
              <q-tooltip anchor="bottom middle" :offset="[5, 5]">
                {{ $t('IIOT008.btn.add') }}
              </q-tooltip>
            </div>
            <!--刪除按鈕-->
            <div
              class="delBtn"
              @click="API_PUT_Task_isUpload(this.dialogTable.selectedRows, false)"
              :class="{ 'delBtn-disable': ag_gridDialog_upload_delDisable }"
            >
              <img src="~assets/icons/svg/trash_white.svg" />
              <q-tooltip anchor="bottom middle" :offset="[5, 5]">
                {{ $t('IIOT008.btn.del') }}
              </q-tooltip>
            </div>
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
          @selection-changed="onDialogTableSelectionChanged_upload"
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

      <q-card-actions align="between">
        <dw-button
          class="button-theme text-white button-theme-del"
          :label="translated.btn.cancel"
          v-close-popup
        />
        <dw-button
          class="button-theme text-white button-theme-add"
          :label="translated.btn.finish"
          v-close-popup
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
import { errorDetailMsg } from '../../../components/toolBox.js'
import { api } from 'boot/axios'
import { API_GET_FACTORY } from '../../../api/Factory/API_GET_FACTORY'
import { API_GET_GROUP } from '../../../api/EqptGroup/API_GET_GROUP'
import { API_GET_EqptBasicInfo } from '../../../api/EqptBasicInfo/API_GET_EqptBasicInfo'
import { API_GET_Task } from '../../../api/TaskCenter/API_GET_Task'
import { API_GET_Task_detail } from '../../../api/TaskCenter/API_GET_Task_detail'
import { API_GET_Task_EDIT } from '../../../api/TaskCenter/API_GET_Task_EDIT'
import { API_POST_Task } from '../../../api/TaskCenter/API_POST_Task'
import { API_POST_UploadTask } from '../../../api/TaskCenter/API_POST_UploadTask'
import { API_POST_DownloadTask } from '../../../api/TaskCenter/API_POST_DownloadTask'
import { API_PUT_Task } from '../../../api/TaskCenter/API_PUT_Task'
import { API_PUT_UploadTask } from '../../../api/TaskCenter/API_PUT_UploadTask'
import { API_PUT_DownloadTask } from '../../../api/TaskCenter/API_PUT_DownloadTask'
import { API_DEL_Task } from '../../../api/TaskCenter/API_DEL_Task'
import { API_GET_TaskType } from '../../../api/TaskCenter/API_GET_TaskType'
import { API_GET_OperateStatus } from '../../../api/NetWorks/API_GET_OperateStatus'
import { API_GET_ProductionEnv } from '../../../api/TransactionInquiry/API_GET_ProductionEnv'

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
      enablePagination: true,
      busParamList: [],
      updateBusParamStatus: [],
      translated: {
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
          finish: this.$t('IIOT008.btn.finish'),
        },
        input: {
          search: this.$t('IIOT008.input.search'),
          pleaseEnter: this.$t('IIOT008.input.pleaseEnter'),
        },
        EquipmentNo: this.$t('IIOT008.EquipmentNo'),
        EquipmentName: this.$t('IIOT008.EquipmentName'),
        EquipmentCategory: this.$t('IIOT008.EquipmentCategory'),
        Protocol: this.$t('IIOT008.Protocol'),
        ParamType: this.$t('IIOT008.ParamType'),
        ParamPath: this.$t('IIOT008.ParamPath'),
        TaskNo: this.$t('IIOT008.TaskNo'),
        TaskName: this.$t('IIOT008.TaskName'),
        TaskType: this.$t('IIOT008.TaskType'),
        ServicePath: this.$t('IIOT008.ServicePath'),
        UploadFreq: this.$t('IIOT008.UploadFreq'),
      },
      dispMenuFactory: false,
      dispMenuTaskType: false,
      dispMenuIntegrationObject: false,
      dispMenuSystemService: false,
      dispMenuUploadMethod: false,
      dispMenuCollectionType: false,
      dispMenuUploadTaskType: false,
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
      addTaskCenterDialog: false,
      addTaskCenterDialog_Step2: false,
      editBusParamDialog: false,
      copyBusParamDialog: false,
      editTaskCenterDialog: false,
      editTaskCenterDialog_BusParam: false,
      delTaskDialog: false,
      ag_gridDialog: false,
      ag_gridDialog_upload: false,
      editDisable: true,
      delDisable: true,
      ag_gridDialog_upload_delDisable: true,
      selectedDelParamNo: '',
      selectedDelParamType: '',
      selectedRows: [],
      selectedRows_level2: [],
      factoryList: [],
      taskTypeList: [],
      integrationObjectList: [],
      systemServiceList: [],
      uploadMethodList: [],
      collectionTypeList: [],
      currentType: null,
      dispMenuOperateStatus: false,
      operateStatusList: [],
      dispMenuSituationType: false,
      situationTypeList: [],
      cascadeResult: [],
      dialogTable: {
        keyword: null,
        gridOptions: null,
        gridApi: null,
        columnDefs: null,
        defaultColDef: null,
        editType: null,
        rowData: null,
        title: null,
        setFreq: false,
        factoryTable: [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT008.FactoryNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT008.FactoryName'),
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
            headerName: this.$t('IIOT008.GroupNo'),
            width: 284,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'groupName',
            headerName: this.$t('IIOT008.GroupName'),
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
        collectionTypeInput: {
          typeId: null,
          typeName: null,
        },
        taskCenterInput: {
          id: null,
          isDisable: false,
          isProduction: false,
          isUpload: false,
          isIssued: false,
          taskNo: null,
          taskName: null,
          taskType: {
            typeNo: null,
            typeName: null,
          },
        },
        ServiceConfig: {
          IntegrationObject: {
            type: null,
            name: null,
          },
          SystemService: {
            type: null,
            name: null,
          },
          ServicePath: null,
          UploadMethod: {
            type: null,
            name: null,
          },
          UploadFreq: null,
        },
        contentRouterTable: [
          {
            field: 'routingNo',
            headerName: this.$t('IIOT008.RoutingNo'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'routingName',
            headerName: this.$t('IIOT008.RoutingName'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'routingTyep',
            headerName: this.$t('IIOT008.RoutingTyep'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
        ],
        contentRouterInput: {
          guid: null,
          routingNo: null,
          routingName: null,
          routingTyep: null,
          messageType: null,
          importFile: null,
        },
        equipmentBasicInfoTable: [
          {
            field: 'equipmentNo',
            headerName: this.$t('IIOT008.EquipmentNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT008.EquipmentName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'equipmentCategoryType',
            headerName: this.$t('IIOT008.EquipmentCategory'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
        ],
        equipmentBasicInfoInput: {
          id: null,
          typeGuid: null,
          typeName: null,
          equipmentNo: null,
          equipmentName: null,
          equipmentType: null,
        },
        EqptBoxTable: [
          {
            field: 'boxNo',
            headerName: this.$t('IIOT008.EqptBoxNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'boxName',
            headerName: this.$t('IIOT008.EqptBoxName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'industrialProtocolType',
            headerName: this.$t('IIOT008.Protocol'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
        ],
        eqptBoxInput: {
          id: null,
          boxGuid: null,
          boxName: null,
          protocolName: null,
          protocolGuid: null,
        },
        paramTable: [
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT008.EquipmentName'),
            width: 190,
            editable: false,
            unSortIcon: true,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: function (params) {
              return '<span><i class="material-icons">edit</i>' + params.value + '</span>'
            },
          },
          {
            field: 'paramName',
            headerName: this.$t('IIOT008.ParamName'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'nodePath',
            headerName: this.$t('IIOT008.ParamPath'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
        ],
        paramInput: {
          guid: null,
          paramNo: null,
          paramName: null,
        },
        paramPath: null,
        busParamTable: [
          {
            field: 'attribNo',
            headerName: this.$t('IIOT008.ParamNo'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'fixedParamType',
            headerName: this.$t('IIOT008.ParamType'),
            width: 190,
            editable: false,
            unSortIcon: true,
            valueFormatter: this.displayFixParamTypeFormatter,
          },
          {
            field: 'nodePath',
            headerName: this.$t('IIOT008.ParamPath'),
            width: 190,
            editable: false,
            unSortIcon: true,
          },
          // {
          //   field: "equipmentNo",
          //   headerName: this.$t("IIOT008.EquipmentNo"),
          //   width: 190,
          //   editable: false,
          //   unSortIcon: true,
          // },
        ],
        busParamInput: {
          id: null,
          attribNo: null,
          fixedParamType: null,
          equipmentNo: null,
          equipmentName: null,
          equipmentType: null,
          equipmentTypeNo: null,
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
            headerName: this.$t('IIOT008.EquipmentNo'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT008.EquipmentName'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'typeName',
            headerName: this.$t('IIOT008.EquipmentCategory'),
            width: 189.4,
            editable: false,
            unSortIcon: true,
          },
        ],
        taskCenterTable: [
          {
            field: 'taskNo',
            headerName: this.$t('IIOT008.TaskNo'),
            width: 90,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            editable: false,
            unSortIcon: true,
          },
          {
            field: 'taskName',
            headerName: this.$t('IIOT008.TaskName'),
            width: 90,
            editable: false,
            unSortIcon: true,
          },
          // {
          //   field: "equipmentNo",
          //   headerName: this.$t("IIOT008.EquipmentNo"),
          //   width: 90,
          // },
          // {
          //   field: "attribNo",
          //   headerName: this.$t("IIOT008.ParamNo"),
          //   width: 90,
          // },
        ],
        operateStatusInput: {
          typeNo: null,
          typeName: null
        },
        situationTypeInput: {
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
    changeTaskType(item) {
      this.dialogTable.taskCenterInput.taskType = item
      this.dispMenuTaskType = false
    },
    removeEqptChip(item) {
      this.dialogTable.copyEqptTarget.forEach((ele, index) => {
        if (ele.guid == item) {
          this.dialogTable.copyEqptTarget.splice(index, 1)
        }
      })
    },
    addNewTask(taskCenterInput, equipmentBasicInfoInput) {
      if (taskCenterInput.taskType.typeNo == 101) {
        // 上傳任務
        this.API_POST_UploadTask(taskCenterInput, equipmentBasicInfoInput)
      } else if (taskCenterInput.taskType.typeNo == 102) {
        // 下發任務
        this.API_POST_DownloadTask(taskCenterInput, equipmentBasicInfoInput)
      } else {
        console.error('[前端log] 此任務編號不存在')
      }
    },
    editTask(taskCenterInput, equipmentBasicInfoInput) {
      if (taskCenterInput.taskType.typeNo == 101) {
        // 上傳任務
        this.API_PUT_UploadTask(taskCenterInput, equipmentBasicInfoInput)
      } else if (taskCenterInput.taskType.typeNo == 102) {
        // 下發任務
        this.API_PUT_DownloadTask(taskCenterInput, equipmentBasicInfoInput)
      } else {
        console.error('[前端log] 此任務編號不存在')
      }
    },
    changeStep(step) {
      if (step == 1) {
        this.addTaskCenterDialog = true
      } else if (step == 2) {
        this.$refs.addTaskCenterDialog.validate().then((success) => {
          if (success) {
            this.addTaskCenterDialog_Step2 = true
          }
        })
      }
    },
    changeEditStep(step) {
      if (step == 1) {
        this.editTaskCenterDialog = true
      } else if (step == 2) {
        this.$refs.editTaskCenterDialog.validate().then((success) => {
          if (success) {
            // 檢查欄位是否為空
            this.editTaskCenterDialog_BusParam = true
          }
        })
      }
    },
    changeDialogPage(currentType, status) {
      if (currentType == 8 && status == 'default') {
        this.openTableDialog(7, this.dialogTable.taskCenterTable)
      } else if (currentType == 8 && status == 'confirmBtn') {
        this.API_PUT_Task_isUpload(this.dialogTable.selectedRows, true)
        this.ag_gridDialog = false
        this.ag_gridDialog_upload = true
      } else {
        this.ag_gridDialog = false
      }
    },
    clickEnterToChangePage(page) {
      this.API_GET_BusParam('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePageLevel2(page) {
      this.API_GET_EqptBasicInfo_detail('', '', page, this.paginationPageSize)
    },
    clickEnterToChangePage_dialog(currentType, page) {
      if (currentType == 1) {
        this.API_GET_EqptBox('', '', page, 10)
      } else if (currentType == 9) {
        this.API_GET_FACTORY('', '', page, 10)
      } else if (currentType == 10) {
        this.API_GET_GROUP('', '', page, 10)
      } else if (currentType == 11) {
        this.API_GET_EqptBasicInfo('', '', page, 10)
      } else if (currentType == 3) {
        this.API_GET_Param('', '', page, 10)
      }
    },
    onSearch(keyword) {
      this.API_GET_Task('', keyword, 1, this.paginationPageSize)
    },
    onSearch_dialog(currentType, keyword) {
      console.log(currentType)
      if (currentType == 1) {
        this.API_GET_EqptBox('', keyword, 1, 10)
      } else if (currentType == 2) {
        this.API_GET_EqptBasicInfo('', keyword, 1, 10)
      } else if (currentType == 3) {
        this.API_GET_Param('', keyword, 1, 10)
      } else if (currentType == 4) {
        this.API_GET_BusParam('', keyword, 1, 10, 1, null, 'unique')
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

      // this.changeTaskTypeTable(params.data.id, params.data.missionType)
      this.API_GET_Task_detail('', '', 1, this.paginationPageSize, params.data.missionType)
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
          this.dialogTable.busParamInput = params.data
          this.API_GET_BusParam_detail('', '', 1, this.paginationPageSize, params.data.id)
        } else if (this.currentType == 5) {
          // 複製功能: 選擇目標設備
          params.forEach((ele) => [this.dialogTable.copyEqptTarget.push(ele)])
        } else if (this.currentType == 6) {
          this.dialogTable.contentRouterInput = params.data
        } else if (this.currentType == 9) {
          this.dialogTable.factoryInput = params.data
          this.dialogTable.groupInput = ''
        } else if (this.currentType == 10) {
          this.dialogTable.groupInput = params.data
        } else if (this.currentType == 11) {
          this.dialogTable.equipmentBasicInfoInput = params.data
        }
      }
      this.ag_gridDialog = false
      console.log(this.dialogTable.groupInput.groupNo)
    },
    onSelectionChanged() {
      this.selectedRows = []
      this.selectedRows = this.gridApi.getSelectedRows()
      console.log(this.selectedRows)

      if (this.selectedRows.length != 0) {
        this.changeTaskTypeTable(this.selectedRows[0].id, this.selectedRows[0].missionType)
      }

      // 清空欄位
      this.dialogTable.taskCenterInput.taskNo = null
      this.dialogTable.taskCenterInput.taskName = null
      this.dialogTable.eqptBoxInput.id = null
      this.dialogTable.eqptBoxInput.boxNo = null
      this.dialogTable.ServiceConfig.IntegrationObject.name = null
      this.dialogTable.ServiceConfig.SystemService.name = null
      this.dialogTable.ServiceConfig.ServicePath = null
      this.dialogTable.ServiceConfig.UploadMethod.name = null
      this.dialogTable.contentRouterInput.routingNo = null

      if (this.selectedRows.length > 0 && this.selectedRows.length <= 1) {
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
      console.log(this.dialogTable.selectedRows)
    },
    onDialogTableSelectionChanged_upload() {
      // this.dialogTable.gridApi = this.dialogTable.gridOptions.api;
      this.dialogTable.selectedRows = []
      this.dialogTable.selectedRows = this.dialogTable.gridApi.getSelectedRows()
      console.log(this.dialogTable.selectedRows)
      if (this.dialogTable.selectedRows.length > 0 && this.dialogTable.selectedRows.length <= 1) {
        // this.editDisable = false;
        this.ag_gridDialog_upload_delDisable = false
      } else if (this.dialogTable.selectedRows.length > 1) {
        // this.editDisable = true;
        this.ag_gridDialog_upload_delDisable = false
      } else {
        // this.editDisable = true;
        this.ag_gridDialog_upload_delDisable = true
      }
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => `${node.groupNo} ${node.paramName}`)
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
    openEditTaskCenterDialog() {
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
      this.dialogTable.taskCenterInput.id = selectedData[0].id
      // this.dialogTable.taskCenterInput.taskNo = selectedData[0].taskNo
      // this.dialogTable.taskCenterInput.taskName = selectedData[0].taskName
      this.dialogTable.equipmentBasicInfoInput.id = selectedData[0].equipmentId

      if (
        selectedData[0].missionType == 'PushTask' ||
        selectedData[0].missionType == 101
      ) {
        this.dialogTable.taskCenterInput.taskType.typeNo = 101
        this.dialogTable.taskCenterInput.taskType.typeName = '推播任务'
      } else if (
        selectedData[0].missionType == 'DownloadTask' ||
        selectedData[0].missionType == 102
      ) {
        this.dialogTable.taskCenterInput.taskType.typeNo = 102
        this.dialogTable.taskCenterInput.taskType.typeName = '下發任务'
      }


      this.API_GET_Task_EDIT('', selectedData[0].id)
      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
      this.API_GET_ProductionEnv('', '', 1, this.paginationPageSize) // 取得生產環境清單

      this.editTaskCenterDialog = true
    },
    openAddTaskCenterDialog() {
      // 清空欄位
      this.dialogTable.taskCenterInput.isProduction = false
      this.dialogTable.taskCenterInput.isUpload = false
      this.dialogTable.taskCenterInput.taskNo = null
      this.dialogTable.taskCenterInput.taskName = null
      this.dialogTable.eqptBoxInput.boxName = null
      this.dialogTable.ServiceConfig.IntegrationObject.name = null
      this.dialogTable.ServiceConfig.SystemService.name = null
      this.dialogTable.ServiceConfig.ServicePath = null
      this.dialogTable.ServiceConfig.UploadMethod.name = null
      this.dialogTable.contentRouterInput.routingNo = null
      this.dialogTable.busParamInput.attribNo = null
      this.dialogTable.busParamInput.fixedParamType = null
      this.dialogTable.factoryInput.id = null
      this.dialogTable.factoryInput.factoryNo = null
      this.dialogTable.factoryInput.factoryName = null
      this.dialogTable.groupInput.id = null
      this.dialogTable.groupInput.groupNo = null
      this.dialogTable.groupInput.groupName = null
      this.dialogTable.equipmentBasicInfoInput.equipmentNo = null
      this.dialogTable.equipmentBasicInfoInput.equipmentName = null
      this.dialogTable.equipmentBasicInfoInput.equipmentType = null
      this.dialogTable.equipmentBasicInfoInput.typeName = null

      this.API_GET_TaskType('', '', 1, this.paginationPageSize) // 取得任務類型清單 上傳、下發
      this.API_GET_OperateStatus('', '', 1, this.paginationPageSize) // 取得操作狀態清單
      this.API_GET_ProductionEnv('', '', 1, this.paginationPageSize) // 取得生產環境清單

      this.dialogTable.taskCenterInput.taskType.typeNo = 101 // 預設任務類型->上傳任務
      this.dialogTable.taskCenterInput.taskType.typeName = this.$t('IIOT008.PushTask') // 預設任務類型
      this.addTaskCenterDialog = true
    },
    openDelTaskConfirmDialog() {
      if (this.delDisable == true) {
        return null
      }

      this.delTaskDialog = true
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
      if (type == 1) {
        this.API_GET_EqptBox('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT008.EqptBox2')
        this.ag_gridDialog = true
      } else if (type == 2) {
        this.API_GET_EqptBasicInfo('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT008.EqptBasicInfoSetting')
        this.ag_gridDialog = true
      } else if (type == 3) {
        this.API_GET_Param('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT008.BasicParam')
        this.ag_gridDialog = true
      } else if (type == 4) {
        this.API_GET_BusParam('', '', 1, 10, 1, null, '')
        this.dialogTable.title = this.$t('IIOT008.Select') + this.$t('IIOT008.BusParm2')
        this.ag_gridDialog = true
      } else if (type == 5) {
        // 複製功能，選擇複製目標設備
        if (this.dialogTable.copiedEqptObjectInput.equipmentName == null) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: this.$t('IIOT008.warnMSG.pleaseSelectCopyObjectFirst'),
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
        this.dialogTable.title = this.$t('IIOT008.Target') + this.$t('IIOT008.Equipment')
        this.ag_gridDialog = true
      } else if (type == 6) {
      } else if (type == 7) {
        this.API_GET_Task('', '', 1, 10, 'enableUpload')
      } else if (type == 8) {
        this.API_GET_Task('', '', 1, 10, 'disableUpload')
        setTimeout(() => {
          this.dialogTable.title = this.$t('IIOT008.UploadParam') // 新增上傳參數
          this.ag_gridDialog_upload = false
          this.ag_gridDialog = true
        }, 1000)
      } else if (type == 9) {
        this.API_GET_FACTORY('', '', 1, 10)
        this.dialogTable.title = this.$t('IIOT008.Select') + this.$t('IIOT008.Factory')
        this.ag_gridDialog = true
      } else if (type == 10) {
        if (
          this.dialogTable.factoryInput.factoryNo == null ||
          this.dialogTable.factoryInput.factoryNo == undefined
        ) {
          errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectFactoryFirst'))
          return null
        }
        this.API_GET_GROUP('', '', 1, 10, this.dialogTable.factoryInput.id)
        this.dialogTable.title = this.$t('IIOT008.Select') + this.$t('IIOT008.Group')
        this.ag_gridDialog = true
      } else if (type == 11) {
        if (
          this.dialogTable.groupInput.groupNo == null ||
          this.dialogTable.groupInput.groupNo == undefined
        ) {
          errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectAreaFirst'))
          return null
        }
        console.log(this.dialogTable.groupInput.id)
        this.API_GET_EqptBasicInfo('', '', 1, 10, this.dialogTable.groupInput.id)
        this.dialogTable.title = this.$t('IIOT008.EqptBasicInfoSetting')
        this.ag_gridDialog = true
      }
    },
    setDialogInput(currentType, item) {
      if (item.length != 0) {
        if (currentType == 1) {
          this.dialogTable.eqptBoxInput = item[0]
        } else if (currentType == 2) {
          this.dialogTable.equipmentBasicInfoInput = item[0]
        } else if (currentType == 3) {
          this.dialogTable.paramInput = item[0]
        } else if (currentType == 4) {
          // 複製功能: 選擇設備對象
          this.dialogTable.copiedEqptObjectInput = item[0]
          this.API_GET_BusParam(
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
        } else if (currentType == 6) {
          this.dialogTable.contentRouterInput = item[0]
        }
      }

      this.ag_gridDialog = false
    },
    saveCopyParam() {
      if (this.dialogTable.copiedEqptObjectInput.equipmentName == null) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('IIOT008.warnMSG.pleaseSelectCopyObjectFirst'),
          icon: 'report_problem',
        })
      }

      if (this.dialogTable.copyEqptTarget.length == 0) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: this.$t('IIOT008.warnMSG.pleaseSelectCopyTargetFirst'),
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

      this.API_POST_BusParam(null, null, null, null, 1)
      console.log(this.dialogTable.copyResult)
    },
    changePage_dialog(currentType, type) {
      console.log(currentType)
      if (currentType == 1) {
        this.API_GET_EqptBox(type)
      } else if (currentType == 3) {
        this.API_GET_Param(type)
      } else if (currentType == 9) {
        this.API_GET_FACTORY(type)
      } else if (currentType == 10) {
        this.API_GET_GROUP(type)
      } else if (currentType == 11) {
        this.API_GET_EqptBasicInfo(type)
      }
    },
    changeOperateStatus(item) {
      this.dialogTable.operateStatusInput = item
      this.dispMenuOperateStatus = false
    },
    changeSituationType(item) {
      this.dialogTable.situationTypeInput = item
      this.dispMenuSituationType = false
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    changeTaskTypeTable(id, taskType) {
      let columnDefs = this.agGridLevel2.gridOptions.api.getColumnDefs()
      if (taskType == 'PushTask' || taskType == 101) {
        columnDefs = [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT008.FactoryNo'),
            width: 90,
            editable: false,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT008.FactoryName'),
            width: 90,
            editable: false,
          },
          {
            field: 'groupNo',
            headerName: this.$t('IIOT008.GroupNo'),
            width: 90,
            editable: false,
          },
          {
            field: 'groupName',
            headerName: this.$t('IIOT008.GroupName'),
            width: 90,
            editable: false,
          },
          // {
          //   field: 'equipmentNo',
          //   headerName: this.$t('IIOT008.EquipmentNo'),
          //   width: 90,
          //   editable: false,
          // },
          // {
          //   field: 'equipmentName',
          //   headerName: this.$t('IIOT008.EquipmentName'),
          //   width: 90,
          //   editable: false,
          // },
          // {
          //   field: 'equipmentCategoryTransl',
          //   headerName: this.$t('IIOT008.EquipmentCategory'),
          //   width: 90,
          //   editable: false,
          // },
          // {
          //   field: 'connectionTransl',
          //   headerName: this.$t('IIOT008.EqptProtocol'),
          //   width: 90,
          //   editable: false,
          // },
          {
            field: 'isProduction',
            headerName: this.$t('IIOT008.ProductionData'),
            width: 90,
            editable: false,
            valueFormatter: this.displayIsProductionFormatter,
          },
          {
            field: 'isUpload',
            headerName: this.$t('IIOT008.DataUpload'),
            width: 90,
            editable: false,
            valueFormatter: this.displayIsUploadFormatter,
          },
        ]
      } else if (taskType == 'DownloadTask' || taskType == 102) {
        columnDefs = [
          {
            field: 'factoryNo',
            headerName: this.$t('IIOT008.FactoryNo'),
            width: 90,
            editable: false,
          },
          {
            field: 'factoryName',
            headerName: this.$t('IIOT008.FactoryName'),
            width: 90,
            editable: false,
          },
          {
            field: 'groupNo',
            headerName: this.$t('IIOT008.GroupNo'),
            width: 90,
            editable: false,
          },
          {
            field: 'groupName',
            headerName: this.$t('IIOT008.GroupName'),
            width: 90,
            editable: false,
          },
          {
            field: 'equipmentNo',
            headerName: this.$t('IIOT008.EquipmentNo'),
            width: 90,
            editable: false,
          },
          {
            field: 'equipmentName',
            headerName: this.$t('IIOT008.EquipmentName'),
            width: 90,
            editable: false,
          },
          {
            field: 'equipmentCategoryTransl',
            headerName: this.$t('IIOT008.EquipmentCategory'),
            width: 90,
            editable: false,
          },
          {
            field: 'connectionTransl',
            headerName: this.$t('IIOT008.EqptProtocol'),
            width: 90,
            editable: false,
          },
          {
            field: 'creator',
            headerName: this.$t('IIOT008.CreateTime'),
            width: 90,
            editable: false,
          },
          {
            field: 'modifytime',
            headerName: this.$t('IIOT008.LastUpdateDate'),
            width: 90,
            editable: false,
          },
        ]
      }
      // console.log(columnDefs);
      this.agGridLevel2.gridOptions.api.setColumnDefs(columnDefs)
      this.API_GET_Task_detail('', '', 1, this.paginationPageSize, id, taskType)
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
    API_GET_EqptBasicInfo(url, search, pageNumber, pageSize, groupId) {
      // 取得設備配置資料
      let _this = this
      API_GET_EqptBasicInfo(url, search, pageNumber, pageSize, groupId, true)
        .then((res) => {
          this.dialogTable.rowData = res.data
          console.log(res.data)
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
    API_GET_TaskType(url, search, pageNumber, pageSize) {
      let _this = this
      API_GET_TaskType(url, search, pageNumber, pageSize)
        .then((res) => {
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
    API_GET_EqptBox(url, search, pageNumber, pageSize) {
      // 取得設備盒子配置資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url = `/equipment/boxes?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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
            message: _this.$t('IIOT008.notifyMsg.addFail'), // 新增失敗
            icon: 'report_problem',
          })
        })
    },
    API_GET_Param(url, search, pageNumber, pageSize) {
      // 取得基礎參數資料
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url =
          '/edifices/foundations/groups/equipment-basis-params?search=' +
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
            message: 'API_GET_Param 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_BusParam(url, search, pageNumber, pageSize, tableType, boxGuid, businessType) {
      // 取得任務中心配置資料
      if (boxGuid == null) {
        boxGuid = ''
      }

      if (businessType == null || businessType == '') {
        businessType = 'Undefined'
      }

      console.log(boxGuid)

      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url = `/manufacture/business-parameters?search=${search}&businessType=${businessType}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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
          this.busParamList = res.data
          if (tableType == 1) {
            this.dialogTable.rowData = res.data
          } else {
            this.rowData = res.data
          }

          setTimeout(() => {
            this.dialogTable.gridApi.forEachNode(function (node) {
              _this.busParamList.forEach((item) => {
                if (item.id == node.data.id) {
                  node.setSelected(item.isDisable)
                }
              })
            })
          }, 500)

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
            message: 'API_GET_BusParam 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_BusParam_detail(url, search, pageNumber, pageSize, id) {
      let _this = this
      if (url == '') {
        // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
        url = `/manufacture/business-parameters/${id}?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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
          console.log(res.data)
          this.agGridLevel2.rowData = res.data

          if (res.data.length != 0) {
            this.dialogTable.equipmentBasicInfoInput.equipmentNo = res.data[0].equipmentNo
            this.dialogTable.equipmentBasicInfoInput.equipmentName = res.data[0].equipmentName
            this.dialogTable.equipmentBasicInfoInput.equipmentType = res.data[0].equipmentCategoryTransl
          }

          let pagination = JSON.parse(res.headers['x-pagination'])
          this.agGridLevel2.pagination.totalPages = pagination['totalPages']
          this.agGridLevel2.pagination.currentPage = pagination['currentPage']
          this.agGridLevel2.pagination.previousLink = pagination['previousLink']
          this.agGridLevel2.pagination.nextLink = pagination['nextLink']
          this.agGridLevel2.pagination.firstLink = pagination['firstLink']
          this.agGridLevel2.pagination.lastLink = pagination['lastLink']
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'API_GET_EqptBasicInfo_detail 失敗!',
            icon: 'report_problem',
          })
        })
    },
    API_GET_Task(url, search, pageNumber, pageSize) {
      let _this = this
      if (JSON.parse(sessionStorage.getItem('pageInfo')).currentTab.path != 'taskCenterSetting') {
        return null
      }
      API_GET_Task(url, search, pageNumber, pageSize)
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

          if (res.data.length != 0) {
            // this.changeTaskTypeTable(res.data[0].id, res.data[0].missionType)
            this.API_GET_Task_detail('', '', 1, this.paginationPageSize, res.data[0].missionType)
          } else {
            this.agGridLevel2.rowData = []
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Task 失敗!')
        })
    },
    API_GET_Task_EDIT(url, missionType) {
      let _this = this
      API_GET_Task_EDIT(url, missionType)
        .then((res) => {
          console.log(res.data)
          this.dialogTable.taskCenterInput.id = res.data.id
          this.dialogTable.taskCenterInput.taskType.typeNo = res.data.missionType
          this.dialogTable.taskCenterInput.taskType.typeName = res.data.missionTransl
          this.dialogTable.factoryInput.factoryNo = res.data.factoryNo
          this.dialogTable.factoryInput.factoryName = res.data.factoryName
          this.dialogTable.groupInput.groupNo = res.data.groupNo
          this.dialogTable.groupInput.groupName = res.data.groupName
          this.dialogTable.equipmentBasicInfoInput.id = res.data.equipmentId
          this.dialogTable.equipmentBasicInfoInput.equipmentNo = res.data.equipmentNo
          this.dialogTable.equipmentBasicInfoInput.equipmentName = res.data.equipmentName
          this.dialogTable.operateStatusInput.typeNo = res.data.operateType
          this.dialogTable.operateStatusInput.typeName = res.data.operateTransl
          
          if (res.data.part !== undefined && res.data.part !== null) {
            this.dialogTable.situationTypeInput.typeNo = res.data.part.situationType
            this.dialogTable.situationTypeInput.typeName = res.data.part.situationTransl
          }

        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Networks_EDIT 失敗!')
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
    API_GET_ProductionEnv() {
      // 取得 是否為生產數據 下拉選單
      let _this = this
      API_GET_ProductionEnv()
        .then((res) => {
          console.log(res.data)
          this.situationTypeList = res.data
          if (
            this.dialogTable.situationTypeInput.typeNo == null ||
            this.dialogTable.situationTypeInput.typeNo == undefined
          ) {
            this.dialogTable.situationTypeInput.typeNo = res.data[0].typeNo
            this.dialogTable.situationTypeInput.typeName = res.data[0].typeName
          }
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_ProductionEnv 失敗!')
        })
    },
    transform(result) {
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
      result.forEach((item) => {
        this.dialogTable.copyResult.push({
          id: this.guid(),
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
    API_POST_Task(taskCenterInput, equipmentBasicInfoInput, operateStatusInput, situationTypeInput) {

      if (this.dialogTable.factoryInput.factoryNo == '' || 
          this.dialogTable.factoryInput.factoryNo == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectFactoryFirst')) // 請選擇工廠
        return null
      } else if (this.dialogTable.groupInput.groupNo == '' || 
          this.dialogTable.groupInput.groupNo == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectAreaFirst')) // 請選擇群組
        return null
      } else if (this.dialogTable.equipmentBasicInfoInput.equipmentNo == '' || 
          this.dialogTable.equipmentBasicInfoInput.equipmentNo == undefined) {
        errorDetailMsg(this.$t('IIOT008.warnMSG.pleaseSelectEqptFirst')) // 請選擇設備
        return null
      }

      // 新增上傳業務參數配置資料
      this.$refs.addTaskCenterDialog.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_POST_Task(
            taskCenterInput.taskType.typeNo,
            equipmentBasicInfoInput.id,
            operateStatusInput.typeNo,
            situationTypeInput.typeNo
          )
            .then((res) => {
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.addTaskCenterDialog = false // 關閉新增Dialog
                this.addTaskCenterDialog_Step2 = false
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
    API_POST_UploadTask(taskCenterInput, equipmentBasicInfoInput) {
      // 新增上傳業務參數配置資料
      this.$refs.addTaskCenterDialog.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_POST_UploadTask(
            101,
            taskCenterInput.taskNo,
            taskCenterInput.taskName,
            equipmentBasicInfoInput.id,
            taskCenterInput.isProduction,
            taskCenterInput.isUpload
          )
            .then((res) => {
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.addTaskCenterDialog = false // 關閉新增Dialog
                this.addTaskCenterDialog_Step2 = false
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
    API_POST_DownloadTask(taskCenterInput, equipmentBasicInfoInput) {
      // 新增上傳業務參數配置資料
      this.$refs.addTaskCenterDialog.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_POST_DownloadTask(
            102,
            taskCenterInput.taskNo,
            taskCenterInput.taskName,
            equipmentBasicInfoInput.id
          )
            .then((res) => {
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.addSucess'), // 新增成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.addTaskCenterDialog = false // 關閉新增Dialog
                this.addTaskCenterDialog_Step2 = false
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
    API_PUT_Task(taskCenterInput, equipmentBasicInfoInput, operateStatusInput, situationTypeInput) {
      // 更新上傳任務
      this.$refs.editTaskCenterDialog.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_PUT_Task(
            taskCenterInput.id,
            taskCenterInput.taskType.typeNo,
            equipmentBasicInfoInput.id,
            operateStatusInput.typeNo,
            situationTypeInput.typeNo
          )
            .then((res) => {
              console.log(res.data)
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.editTaskCenterDialog = false // 關閉Dialog
                this.editTaskCenterDialog_BusParam = false // 關閉Dialog
              }, 1000)
            })
            .catch((error) => {
              console.error('[錯誤訊息] API_PUT_Task ' + error) //失敗的話回傳錯誤訊息
              errorDetailMsg(error.response.data.message)
              setTimeout(() => {
                _this.submitting = false
              }, 1000)
            })
        }
      })
    },
    API_PUT_UploadTask(taskCenterInput, equipmentBasicInfoInput) {
      // 更新上傳任務
      this.$refs.editTaskCenterDialog.validate().then((success) => {
        if (success) {
          this.submitting = true
          let _this = this
          API_PUT_UploadTask(
            101,
            taskCenterInput.id,
            taskCenterInput.taskNo,
            taskCenterInput.taskName,
            equipmentBasicInfoInput.id,
            taskCenterInput.isProduction,
            taskCenterInput.isUpload
          )
            .then((res) => {
              console.log(res.data)
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.editTaskCenterDialog = false // 關閉Dialog
                this.editTaskCenterDialog_BusParam = false // 關閉Dialog
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
    API_PUT_DownloadTask(taskCenterInput, equipmentBasicInfoInput) {
      // 更新下發任務
      this.$refs.editTaskCenterDialog.validate().then((success) => {
        if (success) {
          console.log(equipmentBasicInfoInput)
          this.submitting = true
          let _this = this
          API_PUT_DownloadTask(
            102,
            taskCenterInput.id,
            taskCenterInput.taskNo,
            taskCenterInput.taskName,
            equipmentBasicInfoInput.id,
            taskCenterInput.isProduction,
            taskCenterInput.isUpload
          )
            .then((res) => {
              console.log(res.data)
              this.API_GET_Task('', '', 1, this.paginationPageSize)
              this.$q.notify({
                color: 'green',
                position: 'bottom',
                message: this.$t('IIOT008.notifyMsg.editSucess'), // 修改成功
                icon: 'check_circle_outline',
              })

              setTimeout(() => {
                this.submitting = false
                this.editTaskCenterDialog = false // 關閉Dialog
                this.editTaskCenterDialog_BusParam = false // 關閉Dialog
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
    API_DEL_Task(selectRowArea) {
      let _this = this
      let missionType = selectRowArea[0].missionType
      let delItem = ''
      selectRowArea.forEach((item) => {
        delItem += item.id + ','
      })
      console.log(delItem);
      API_DEL_Task(missionType, delItem)
        .then((res) => {
          this.API_GET_Task('', '', 1, this.paginationPageSize)

          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT008.notifyMsg.delSucess'), // 刪除成功
            icon: 'check_circle_outline',
          })

          // selectTask.forEach((ele) => {
          //   this.rowData.forEach((item, index) => {
          //     if (ele.id == item.id) {
          //       this.rowData.splice(index, 1)
          //     }
          //   })
          // })
          // this.gridOptions.api.setRowData(this.rowData)
          this.delTaskDialog = false
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
    API_PUT_Task_isUpload(selectedRows, status) {
      if (selectedRows.length == 0) {
        this.$q.notify({
          color: 'negative',
          position: 'bottom',
          message: 'nonono', //this.$t("IIOT008.notifyMsg.editFail"), // 修改失敗
          icon: 'report_problem',
        })
        return null
      }
      // 更新任務中心的isUpload欄位
      let _this = this
      let body = []
      let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
      selectedRows.forEach((item) => {
        body.push({
          id: item.id,
          // taskNo: item.taskNo,
          // taskName: item.taskName,
          equipmentBoxId: item.equipmentBoxId,
          businessParamId: item.businessParamId,
          isDisable: item.isDisable,
          isProduction: item.isProduction,
          isUpload: status,
          creator: creator,
        })
      })

      console.log(body)
      this.submitting = true
      api
        .put('/manufacture/task-collections', body, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Accept-Language': localStorage.getItem('lang'),
            accept: 'application/json',
          },
        })
        .then((res) => {
          console.log(res)
          this.API_GET_Task('', '', 1, 10, 'enableUpload')
          this.$q.notify({
            color: 'green',
            position: 'bottom',
            message: this.$t('IIOT008.notifyMsg.editSucess'), // 修改成功
            icon: 'check_circle_outline',
          })

          setTimeout(() => {
            this.submitting = false
          }, 1000)
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          console.error(error.response) //失敗的話回傳錯誤訊息
          console.error(error.response.data.detail) //失敗的話回傳錯誤訊息
          _this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: _this.$t('IIOT008.notifyMsg.editFail'), // 修改失敗
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
    API_GET_Task_detail(url, search, pageNumber, pageSize, missionType) {
      let _this = this
      API_GET_Task_detail(url, search, pageNumber, pageSize, missionType)
        .then((res) => {
          console.log(res.data)
          this.agGridLevel2.rowData = res.data

          if (res.data.length != 0) {
            this.dialogTable.factoryInput.factoryNo = res.data[0].factoryNo
            this.dialogTable.factoryInput.factoryName = res.data[0].factoryName
            this.dialogTable.groupInput.id = res.data[0].groupId
            this.dialogTable.groupInput.groupNo = res.data[0].groupNo
            this.dialogTable.groupInput.groupName = res.data[0].groupName
            this.dialogTable.equipmentBasicInfoInput.equipmentNo = res.data[0].equipmentNo
            this.dialogTable.equipmentBasicInfoInput.equipmentName = res.data[0].equipmentName
            this.dialogTable.equipmentBasicInfoInput.equipmentType = res.data[0].equipmentCategoryTransl

            if (missionType == 'PushTask' || missionType == 101) {
              this.dialogTable.taskCenterInput.isProduction = res.data[0].isProduction
              this.dialogTable.taskCenterInput.isUpload = res.data[0].isUpload
            } else if (missionType == 'DownloadTask' || missionType == 102) {
            }
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
          errorDetailMsg('API_GET_Task_detail 失敗!')
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
        return this.$t('IIOT008.Disable')
      } else if (item.data.isDisable == false) {
        return this.$t('IIOT008.Enable')
      }
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
    displayFixParamTypeFormatter(item) {
      if (item.data.fixedParamType == 'ProductionQuantity') {
        return this.$t('IIOT008.ProductionQuantity')
      } else if (item.data.fixedParamType == 'EquipmentStatus') {
        return this.$t('IIOT008.EquipmentStatus')
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
        field: 'missionTransl',
        headerName: this.$t('IIOT008.TaskType'),
        width: 90,
        checkboxSelection: false,
        headerCheckboxSelection: false,
        headerCheckboxSelectionFilteredOnly: false,
        editable: false,
        unSortIcon: true,
      },
      {
        field: 'missionTotal',
        headerName: this.$t('IIOT008.TaskTotal'),
        width: 90,
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
        headerName: this.$t('IIOT008.EquipmentNo'),
        checkboxSelection: true,
        width: 90,
      },
      {
        field: 'operateTransl',
        headerName: this.$t('IIOT008.OperateStatus'),
        width: 90,
      },
      {
        field: 'creator',
        headerName: this.$t('IIOT008.Creator'),
        width: 90,
      },
      {
        field: 'createTime',
        headerName: this.$t('IIOT008.CreateTime'),
        width: 90,
      },
    ]
    this.agGridLevel2.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }
    this.API_GET_Task('', '', 1, this.paginationPageSize)
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
