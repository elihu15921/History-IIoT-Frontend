<template>
  <div>
    <div class="main">
      <q-form class="dw-form" ref="loginform">
        <div class="dw-formitem">
          <dw-input v-model="loginForm.account" :label="account" type="string" required />
        </div>
        <div class="dw-formitem">
          <dw-input
            v-model="loginForm.password"
            :label="password"
            type="password"
            @keydown.enter="onLogin(loginForm.account, loginForm.password)"
            required
          />
        </div>
        <div class="dw-formitem">
          <div class="dropdownMenu" style="width: 178px">
            <div class="input" @click="dispMenuLang = !dispMenuLang">
              <input type="text" v-model="selectedLang" readonly style="border: none" />
              <img class="arrowIcon" src="~assets/icons/svg/up.svg" v-show="dispMenuLang == true" />
              <img class="arrowIcon" src="~assets/icons/svg/down.svg" v-show="dispMenuLang == false" />
            </div>
            <ul class="selectMenu" v-if="dispMenuLang" @mouseleave="dispMenuLang = false">
              <li v-for="(item, key) in langs" :key="key" @click="onSelectionLang(item)">
                <div class="bg">
                  <a>{{ item.name }}</a>
                </div>
              </li>
            </ul>
          </div>

          <!-- <select @change="onSelectionLang($event)" style="border: none">
            <option :value="item.value" v-for="(item, key) in langs" :key="key">
              {{ item.name }}
            </option>
          </select> -->
        </div>
      </q-form>
      <dw-button
        class="button-theme button-margin"
        @click="onLogin(loginForm.account, loginForm.password)"
        :loading="submitting"
        :label="btn.login"
      ></dw-button>

      <!-- {{$store.state.auth.count}}
      <button @click="$store.commit('auth/add')">test</button> -->
    </div>
  </div>
</template>

<script>
// import inject from "../../foundation/mixins/inject";
// import { notify } from "../../foundation/core/notify";
// import { loading } from "../../foundation/core/loading";
import { ref, reactive } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import dw_input from '../input/input'
import dw_select from '../input/select'
import dw_button from '../button/button'
import { API_GET_Authority_UserInfo } from '../../api/Authority/API_GET_Authority_UserInfo'
import { errorDetailMsg } from 'components/toolBox.js'

export default {
  components: {
    'dw-input': dw_input,
    'dw-button': dw_button,
    'dw-select': dw_select,
  },
  // mixins: [inject("context", "login_form")],
  created() {
    // this.notify = notify;
    // this.loading = loading;
  },
  data: function () {
    return {
      submitting: false,
      account: this.$t('LoginPage.account'),
      password: this.$t('LoginPage.password'),
      loginForm: {
        account: '',
        password: '',
      },
      btn: {
        login: this.$t('LoginPage.btn.login'),
      },
      selectedLang: null,
      dispMenuLang: false,
      langInput: {
        name: null,
      },
      langs: [
        {
          name: '简体中文',
          value: 'zh-CN',
        },
        {
          name: '繁體中文',
          value: 'zh-TW',
        },
        {
          name: '英文',
          value: 'en-US',
        },
      ],
    }
  },
  computed: {},
  methods: {
    treelistfn(e) {
      console.log(e)
    },
    onLogin(account, password) {
      this.$refs.loginform.validate().then((success) => {
        if (success) {
          this.submitting = true
          this.POST_API_TOKEN(account, password)
          // let login_info = {
          //   account: account,
          //   password: password,
          //   router : this.$router // 把全局router傳進action
          // }
          // this.$store.dispatch("auth/getToken", login_info)

        }
      })
    },
    onSelectionLang(item) {
      console.log('切換語系至: ' + item.value)
      this.$i18n.locale = item.value
      localStorage.setItem('lang', item.value)
      this.selectedLang = item.name
      this.account = this.$t('LoginPage.account')
      this.password = this.$t('LoginPage.password')
      this.btn.login = this.$t('LoginPage.btn.login')
    },
    POST_API_TOKEN(account, password) {
      const getHostIP = window.location.hostname
      // const url = `http://10.40.72.101:17770/digihua/iiot/station/users/authentications`;
      const url = `http://${getHostIP}:17770/digihua/iiot/station/users/authentications`
      const params = new URLSearchParams()
      const router = useRouter()
      // params.append('client_id', 'iiot-root')
      // params.append('client_secret', 'iiot-secret')
      // params.append('grant_type', 'password')
      params.append('account', account)
      params.append('password', password)
      // params.append('Accept-Language', localStorage.getItem('lang'))
      let _this = this
      api
        .post(url, params, {
          headers: {
            // accept: 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          console.log(res.data)
          localStorage.setItem('token', res.data.accessToken)
          sessionStorage.setItem('displayTabMenu', true)

          let pageInfo = {
            topTitle: this.$t('TransactionRecord.Home'),
            tabMenu: null,
            currentTab: null,
          }
          sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo))
          this.API_GET_Authority_UserInfo(res.data.accessToken)
        })
        .catch(function (error) {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          Notify.create({
            color: 'negative',
            position: 'bottom',
            message: _this.$t('LoginPage.warnMSG.serverError'),
            icon: 'report_problem',
          })
          setTimeout(() => {
            _this.submitting = false
          }, 1000)
        })
    },
    API_GET_Authority_UserInfo(token) {
      console.log(token);
      // 取得用戶資料
      let _this = this
      API_GET_Authority_UserInfo(token)
        .then((res) => {
          console.log(res.data);
          sessionStorage.setItem('userInfo', JSON.stringify(res.data))

          // 到時候丟當前user的角色給後端API，回傳對應的路由陣列
          // console.log(this.$router.getRoutes());
        
          // this.$router.addRoute({ //addRoute一次只能添加一個路由，多個則須跑遍歷
          //   path: '/mainmenu',
          //   component: () => import('layouts/mainmenu/mainmenu-tabbed.vue'),
          //   children: [
          //     { path: 'globalSettings', meta: { 
          //         requiresAuth: true,
          //         licenseType: [101,102,103],
          //         directPath: { path: '/transactionRecord' }
          //       }, // 需驗證，有了meta 可以搭配index.js裡的Router.beforeEach
          //       component: () => import('src/pages/GlobalSettings.vue') 
          //     }]})

          
          // this.$router.replace(this.$router.currentRoute.value.fullPath)
          // console.log(this.$router.getRoutes());

          //this.$router.go('mainmenu/transactionRecord')
          location.href = '#/mainmenu/transactionRecord'
        })
        .catch((error) => {
          console.error('[錯誤訊息] ' + error) //失敗的話回傳錯誤訊息
          errorDetailMsg('API_GET_Authority_UserInfo 失敗!')
        })
    },
  },
  beforeMount() {
    let currentLang = localStorage.getItem('lang')
    if (currentLang == 'zh-CN') {
      this.selectedLang = '简体中文'
    } else if (currentLang == 'en-US') {
      this.selectedLang = '英文'
    } else {
      this.selectedLang = '繁體中文'
    }
    console.log(this.selectedLang)
  },
  setup() {
    function test() {
      alert(11111)
    }

    const state = reactive({
      selectValue: '',
    })

    return {
      test,
      state,
    }
  },
}
</script>

<style lang="sass" scoped>
@import 'src/css/app.sass'
/////////////////$LAYOUT$/////////////////
.main
  margin: 0px 24px
  .button-margin
    margin-top: 24px

//////////////////$MISC$//////////////////
/////////////////$THEMES$/////////////////
.button-theme
  background: rgb(235, 172, 78)
  color: white
  width: 100%
</style>
