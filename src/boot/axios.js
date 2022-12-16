import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { errorDetailMsg } from '../components/toolBox.js'

// const url = `http://10.40.72.101:17770`;
const url = `http://${window.location.hostname}:17770`

const api = axios.create({ // axios.create 預設axios裏的config物件
  baseURL: `${url}/digihua/iiot/station`, // 所有呼叫後端API的前綴
  timeout: 10000, // 發出請求時間出於timeout所設定的時間，請求就會被中斷
  headers: {
    'Accept-Language': localStorage.getItem('lang'),
    'accept': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error) {
      switch (error.response.status) {
        case 401:
          {
            const request = error.config
            const params = new URLSearchParams()
            params.append('client_id', 'iiot-root')
            params.append('client_secret', 'iiot-secret')
            params.append('grant_type', 'refresh_token')
            params.append('refresh_token', localStorage.getItem('refresh_token'))
            return api
              .post(`${url}/connect/token`, params, {
                headers: {
                  accept: 'application/x-www-form-urlencoded',
                },
              })
              .then((res) => {
                localStorage.setItem('token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                request.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
                return api(request)
              })
              .catch((err) => {
                console.error(err.response)
                location.href = '#/login'
                location.reload()
              })
          }
          break

        case 404:
          errorDetailMsg(error.response.data.message)
          break

        default:
          break
      }
    } else {
      if (!window.navigator.onLine) {
        console.error('client is disconnected')
        return
      }
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
