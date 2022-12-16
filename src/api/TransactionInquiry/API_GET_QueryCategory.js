import { api } from 'boot/axios'

// 取得交易紀錄查詢類別資料
export function API_GET_QueryCategory() {
  return api('/transactions/query-conditions', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
