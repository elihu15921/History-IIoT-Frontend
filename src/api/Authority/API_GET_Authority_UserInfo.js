import { api } from 'boot/axios'

// 取得單一用戶
export function API_GET_Authority_UserInfo(token) {
  return api(`/users/informations`, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
