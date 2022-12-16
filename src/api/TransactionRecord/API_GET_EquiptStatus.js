import { api } from 'boot/axios'

// 取得設備狀態
export function API_GET_EquiptStatus() {
  return api('/homes/equipments', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
