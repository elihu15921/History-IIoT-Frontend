import { api } from 'boot/axios'

// 取得用戶群組
export function API_GET_UserGourp() {
  return api('/users/group-types', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
