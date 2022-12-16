import { api } from 'boot/axios'

// 取得要匯出CSV檔案的JSON
export function API_GET_CSVJson(id) {
  return api(`/parameters/export-nodes/${id}`, {
    method: 'get',
    params: {
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
