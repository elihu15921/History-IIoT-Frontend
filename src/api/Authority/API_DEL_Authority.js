import { api } from 'boot/axios'

// 刪除用戶
export function API_DEL_Authority(delItem) {
  return api(`/users/${delItem}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
