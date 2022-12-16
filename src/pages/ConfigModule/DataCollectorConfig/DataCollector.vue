<template>
  <div class="homePage">

    <div class="test" style="width: 100%">
      <iframe :src=url frameborder="0"  style="width: inherit;height: 850px"></iframe>
    </div>

  </div>
</template>
<script>
import { API_GET_GlobalParam } from '../../../api/GlobalParam/API_GET_GlobalParam'
// import { API_GET_Task_TransactionDataVolume } from '../api/TransactionRecord/API_GET_Task_TransactionDataVolume'
// import { errorDetailMsg } from '../components/toolBox.js'

export default {
  mounted() {

  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  destroyed() {},
  data: function () {
    return {
      url: '',
      selectType: null,
      lineChart: null,
      timer: 0,
      timeList: [
        {
          name: this.$t('TransactionRecord.TimeInterval.fiveMinut'),
          value: 1,
        },
        {
          name: this.$t('TransactionRecord.TimeInterval.oneDay'),
          value: 2,
        },
        {
          name: this.$t('TransactionRecord.TimeInterval.seven'),
          value: 3,
        },
        {
          name: this.$t('TransactionRecord.TimeInterval.thirty'),
          value: 4,
        },
      ],
      timeInterval_arry: [],
      trad_upload: null,
      trade_download: null,
      EquiptStatus: {
        equipmentTotal: null,
        equipmentStatusRunQuantity: null,
        equipmentStatusIdleQuantity: null,
        equipmentStatusErrorQuantity: null,
      },
    }
  },
  methods: {
    API_GET_GlobalParam() {
      let _this = this
      
      API_GET_GlobalParam()
        .then((res) => {
          // console.log(res.data);
          this.receiveData = res.data
          this.url = res.data.pcba.url;
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_GlobalParam 失敗!')
        })
    },
    // API_GET_Task_TransactionDataVolume(dateTimeGroup) {
    //   let _this = this
    //   return new Promise((resolve, reject) => {
    //     API_GET_Task_TransactionDataVolume(dateTimeGroup)
    //       .then((res) => {
    //         // console.log(res.data);
    //         this.trade_download = res.data.download
    //         this.trad_upload = res.data.upload
    //         this.$q.loading.hide()
    //         resolve(true)
    //       })
    //       .catch((error) => {
    //         console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
    //         errorDetailMsg('API_GET_Task_TransactionDataVolume 失敗!')
    //         this.$q.loading.hide()
    //         reject(false)
    //       })
    //   })
    // },
  },
  created() {
    this.API_GET_GlobalParam()
  },
}
</script>

<style lang="sass" scoped>
@import 'src/css/app.sass'
.homePage
  height: calc(100vh - 64px)
  overflow-y: scroll

.hightlight
  color: $color-pale-pink

.equiptStatusCount
  display: flex
  flex-direction: row
  align-items: center
  justify-content: space-around
  height: 300px
  width: 100%
  padding: 16px
  // border: 1px solid red
  .block
    height: 200px
    width: 250px
    border-radius: 4px
    border: 1px solid $color-polo-blue
    .title
      display: flex
      flex-direction: row
      align-items: center
      justify-content: left
      height: 68px
      padding: 8px
      font-size: 16px
      font-weight: bold
      color: white
      background-color: $color-polo-blue
      // border: 1px solid red
    .content
      display: flex
      flex-direction: row
      align-items: flex-end
      justify-content: center
      height: calc( 100% - 68px )
      padding: 16px
      // border: 1px solid red
      .count
        height: 95px
        line-height: 95px
        font-size: 76px
        // border: 1px solid blue
      .unit
        font-size: 26px
        // border: 1px solid green

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

    // border: 1px solid blue
// .q-table__container
//   margin: 16px
// .button-theme
//   color: white
//   width: 100px
//   &-add
//     background: $color-casablanca
//     &-del
//       background: $color-pale-pink

// .q-table
//   thead
//     color: white
//     background-color: $color-polo-blue
//     .q-checkbox__bg
//       color: white
// .bg-dialog
//   background-color: $color-hawkes-blue
//
</style>
