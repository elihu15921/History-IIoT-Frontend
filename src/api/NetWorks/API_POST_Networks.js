import { api } from 'boot/axios'

// 新增設備基礎信息
export function API_POST_Networks(sessionNo, sessionName, networkType, detail) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    sessionNo: sessionNo,
    sessionName: sessionName,
    creator: creator,
    detail: detail,
  }
  console.log(body)
  return api(`/networks/${networkType}`, {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
