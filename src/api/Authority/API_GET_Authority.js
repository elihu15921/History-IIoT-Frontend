import { api } from 'boot/axios'

// 取得用戶清單
export function API_GET_Authority() {
  return api('/users', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
