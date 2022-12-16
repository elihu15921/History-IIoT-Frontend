import { api } from 'boot/axios'

// 取得設備下拉選單過濾條件
export function GET_API_MonQueryFilter() {
  return api('/monitors/monitor-query-filters', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
