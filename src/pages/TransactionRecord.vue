<template>
  <div class="homePage">
    <div class="equiptStatusCount">
      <div class="block">
        <div class="title">
          {{ this.$t('TransactionRecord.RegisterEquipt') }}
        </div>
        <div class="content">
          <div class="count">{{ EquiptStatus.equipmentTotal }}</div>
          <div class="unit">台</div>
        </div>
      </div>
      <div class="block">
        <div class="title">
          {{ this.$t('TransactionRecord.ProcessingEquipt') }}
        </div>
        <div class="content">
          <div class="count">{{ EquiptStatus.equipmentStatusRunQuantity }}</div>
          <div class="unit">台</div>
        </div>
      </div>
      <div class="block">
        <div class="title">{{ this.$t('TransactionRecord.IdleEquipt') }}</div>
        <div class="content">
          <div class="count">{{ EquiptStatus.equipmentStatusIdleQuantity }}</div>
          <div class="unit">台</div>
        </div>
      </div>
      <div class="block">
        <div class="title">
          {{ this.$t('TransactionRecord.MalfunctioningEquipt') }}
        </div>
        <div class="content">
          <div class="count">{{ EquiptStatus.equipmentStatusErrorQuantity }}</div>
          <div class="unit">台</div>
        </div>
      </div>
    </div>

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
      <div id="lineChart"></div>
    </div>

    <!-- <div
    id="donutChart"
    style="width: 1600px; height: 400px; margin: 16px 0 0 16px"
  ></div> -->
  </div>
</template>
<script>
import { API_GET_EquiptStatus } from '../api/TransactionRecord/API_GET_EquiptStatus'
import { API_GET_Task_TransactionDataVolume } from '../api/TransactionRecord/API_GET_Task_TransactionDataVolume'
import { errorDetailMsg } from '../components/toolBox.js'

export default {
  mounted() {
    // this.drawLineChart();
    // this.donutChart();
    this.promiseTest()

    this.getInterval(1)

    this.change()
    // this.timer = setInterval(this.change, 30000); // 設定時間刷新數據
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  destroyed() {},
  data: function () {
    return {
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
    async promiseTest() {
      // 測試同步程式
      // let mingRun = await this.runPromise("小明", 2000);
      // console.log("跑完了:", mingRun);
      // let auntieRun = await this.runPromise("漂亮阿姨", 2500);
      // console.log("跑完了:", auntieRun);
    },
    runPromise(someone, timer, success = true) {
      // console.log(`${someone} 開始跑開始`);
      // return new Promise((resolve, reject) => {
      //   // 傳入 resolve 與 reject，表示資料成功與失敗
      //   if (success) {
      //     setTimeout(function () {
      //       // 3 秒時間後，透過 resolve 來表示完成
      //       resolve(`${someone} 跑 ${timer / 1000} 秒時間(fulfilled)`);
      //     }, timer);
      //   } else {
      //     // 回傳失敗
      //     reject(`${someone} 跌倒失敗(rejected)`);
      //   }
      // });
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
    // 圓餅圖
    // donutChart() {
    //   var echarts = require("echarts");
    //   var donutChart = echarts.init(document.getElementById("donutChart"));
    //   var option = {
    //     tooltip: {
    //       trigger: "item",
    //     },
    //     legend: {
    //       top: "5%",
    //       left: "center",
    //     },
    //     series: [
    //       {
    //         name: "Access From",
    //         type: "pie",
    //         radius: ["40%", "70%"],
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: false,
    //           position: "center",
    //         },
    //         emphasis: {
    //           label: {
    //             show: true,
    //             fontSize: "40",
    //             fontWeight: "bold",
    //           },
    //         },
    //         labelLine: {
    //           show: false,
    //         },
    //         data: [
    //           { value: 1048, name: "Search Engine" },
    //           { value: 735, name: "Direct" },
    //           { value: 580, name: "Email" },
    //           { value: 484, name: "Union Ads" },
    //           { value: 300, name: "Video Ads" },
    //         ],
    //       },
    //     ],
    //   };
    //   // 使用刚指定的配置项和数据显示图表。
    //   donutChart.setOption(option);
    // },
    API_GET_EquiptStatus() {
      let _this = this
      API_GET_EquiptStatus()
        .then((res) => {
          // console.log(res.data);
          this.EquiptStatus.equipmentTotal = res.data.equipmentTotal
          this.EquiptStatus.equipmentStatusRunQuantity = res.data.equipmentStatusRunQuantity
          this.EquiptStatus.equipmentStatusIdleQuantity = res.data.equipmentStatusIdleQuantity
          this.EquiptStatus.equipmentStatusErrorQuantity = res.data.equipmentStatusErrorQuantity
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_EquiptStatus 失敗!')
        })
    },
    API_GET_Task_TransactionDataVolume(dateTimeGroup) {
      let _this = this
      return new Promise((resolve, reject) => {
        API_GET_Task_TransactionDataVolume(dateTimeGroup)
          .then((res) => {
            // console.log(res.data);
            this.trade_download = res.data.download
            this.trad_upload = res.data.upload
            this.$q.loading.hide()
            resolve(true)
          })
          .catch((error) => {
            console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
            errorDetailMsg('API_GET_Task_TransactionDataVolume 失敗!')
            this.$q.loading.hide()
            reject(false)
          })
      })
    },
  },
  created() {
    this.API_GET_EquiptStatus()
  },
}
</script>

<style lang="sass">
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
