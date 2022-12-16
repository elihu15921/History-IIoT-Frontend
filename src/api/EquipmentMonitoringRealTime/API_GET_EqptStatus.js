import { api } from 'boot/axios'

// 取得設備狀態標籤
export function API_GET_EqptStatus() {
  return api('/monitors/equipment-status', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
