import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_Networks(id, sessionNo, sessionName, networkType, detail) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    sessionNo: sessionNo,
    sessionName: sessionName,
    networkType: networkType,
    detail: detail,
    creator: creator,
  }

  console.log(body)
  return api(`/networks/${networkType}`, {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
