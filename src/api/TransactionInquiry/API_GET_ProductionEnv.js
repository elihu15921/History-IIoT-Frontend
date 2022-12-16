import { api } from 'boot/axios'

// 取得 是否為生產數據 下拉選單
export function API_GET_ProductionEnv() {
  return api('/logics/environment-types', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
