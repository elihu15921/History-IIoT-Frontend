import { api } from 'boot/axios'

// 更新用戶
export function API_PUT_Authority(id, groupType, licenseType, operateType, username, password) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    groupType: groupType,
    licenseType: licenseType,
    operateType: operateType,
    username: username,
    password: password,
    creator: creator
  }

  console.log(body)
  return api(`/users`, {
    method: 'put',
    params: {},
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
