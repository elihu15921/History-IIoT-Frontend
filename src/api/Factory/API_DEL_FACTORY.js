import { api } from 'boot/axios'

// 刪除工廠配置資料
export function API_DEL_FACTORY(delItem) {
  return api(`/factories/${delItem}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
