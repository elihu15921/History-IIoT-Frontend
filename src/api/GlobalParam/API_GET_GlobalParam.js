import { api } from 'boot/axios'

// 取得工廠配置資料
export function API_GET_GlobalParam() {
  return api('/globals', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
