<template>
  <div>
    {{ rootName }}
    <div style="margin-bottom: 5px">
      <input
        type="text"
        v-on:input="onQuickFilterChanged()"
        id="quickFilter"
        placeholder="quick filter..."
      />
    </div>
    <button @click="add()">add Rows</button>
    <button @click="getSelectedRows()">Get Selected Rows</button>
    <div style="margin-bottom: 5px">
      <button style="font-size: 12px" v-on:click="onBtStartEditing(4)">Start Editing Line 2</button>
      <button style="font-size: 12px" v-on:click="onBtStopEditing()">Stop Editing</button>
    </div>
    <select v-on:change="onPageSizeChanged()" id="page-size">
      <option value="10" selected="">10</option>
      <option value="100">100</option>
      <option value="500">500</option>
      <option value="1000">1000</option>
    </select>
    <ag-grid-vue
      style="width: 1000px; height: 520px"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :editType="editType"
      :rowData="rowData"
      rowSelection="multiple"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
      :suppressRowClickSelection="true"
      :pagination="true"
      :paginationPageSize="paginationPageSize"
    ></ag-grid-vue>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue3'
import { inject } from 'vue'

// 日期排序-start
window.dateComparator = function dateComparator(date1, date2) {
  var date1Number = monthToComparableNumber(date1)
  var date2Number = monthToComparableNumber(date2)
  if (date1Number === null && date2Number === null) {
    return 0
  }
  if (date1Number === null) {
    return -1
  }
  if (date2Number === null) {
    return 1
  }
  return date1Number - date2Number
}

window.monthToComparableNumber = function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null
  }
  var yearNumber = date.substring(6, 10)
  var monthNumber = date.substring(3, 5)
  var dayNumber = date.substring(0, 2)
  var result = yearNumber * 10000 + monthNumber * 100 + dayNumber
  return result
}
// 日期排序-end

export default {
  name: 'App',
  components: {
    AgGridVue,
  },
  inject: ['rootName', 'rootColumn'],
  data() {
    return {
      // ag-grid setting
      gridOptions: null,
      gridApi: null,
      columnDefs: null,
      defaultColDef: null,
      editType: null,
      rowData: null,
      columnApi: null,
      paginationPageSize: null,
      rootName: this.rootName,
    }
  },
  methods: {
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
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => `${node.FactoryNo} ${node.FactoryName}`)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
    },
    onBtStopEditing() {
      this.gridApi.stopEditing()
    },
    onBtStartEditing(index) {
      this.gridApi.setFocusedCell(index, 'athlete')
      this.gridApi.startEditingCell({
        rowIndex: index,
        colKey: 'athlete',
      })
    },
    onFilterTextBoxChanged() {
      this.gridOptions.api.setQuickFilter(document.getElementById('filter-text-box').value)
    },
    add() {
      this.rowData.push({
        FactoryNo: '0000',
        FactoryName: '鼎新電腦',
        RecentlyUpdatedStaff: 'test',
        date: '03/08/2021',
      })
      this.gridOptions.api.setRowData(this.rowData)
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api
  },
  beforeMount() {
    this.gridOptions = {}
    this.editType = 'fullRow' // 整排編輯
    this.paginationPageSize = 10 // 預設顯示資料筆數
    console.log(this.rootColumn)
    this.columnDefs = this.rootColumn

    // this.columnDefs = [
    //   {
    //     field: "FactoryNo",
    //     headerName: this.$t("FactoryNo"),
    //     width: 90,
    //     // cellEditor: "agSelectCellEditor", // 下拉選單
    //     // cellEditorParams: { // 下拉選單選項
    //     //   values: ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"],
    //     // },
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     headerCheckboxSelectionFilteredOnly: true,
    //     unSortIcon: true,
    //   },
    //   {
    //     field: "FactoryName",
    //     headerName: this.$t("FactoryName"),
    //     width: 90,
    //   },
    //   {
    //     field: "RecentlyUpdatedStaff",
    //     headerName: this.$t("RecentlyUpdatedStaff"),
    //     width: 90,
    //   },
    //   {
    //     field: "date",
    //     comparator: dateComparator,
    //   },
    // ];

    this.defaultColDef = {
      flex: 1,
      editable: true,
      sortable: true,
    }

    const result = [
      // 模擬 API GET
      {
        FactoryNo: '0001',
        FactoryName: '鼎新電腦',
        RecentlyUpdatedStaff: '小明',
        date: '24/08/2008',
      },
      {
        FactoryNo: '0002',
        FactoryName: '鼎新電腦',
        RecentlyUpdatedStaff: '小梅',
        date: '29/08/2004',
      },
    ]
    this.rowData = result
    // fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    //   .then((result) => result.json())
    //   .then((rowData) => (this.rowData = rowData));
  },
  setup() {
    // const name = inject("name"); // vue3 寫法
    return { name }
  },
}
</script>

<style lang="scss"></style>
