import { api } from 'boot/axios'

// 刪除設備基礎信息
export function API_DEL_EqptBasicInfo(delItem) {
  return api(`/equipments/${delItem}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
