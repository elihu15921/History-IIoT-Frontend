import { api } from 'boot/axios'

// 新增CSV檔的JSON
export function API_POST_CSVJson(id, json) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = json
  console.log(body)
  return api(`/parameters/import-nodes/${id}`, {
    method: 'post',
    params: {
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
