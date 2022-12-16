import { api } from 'boot/axios'

// 新增用戶
export function API_POST_Authority(groupType, licenseType, operateType, username, account, password) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    groupType: groupType,
    licenseType: licenseType,
    operateType: operateType,
    username: username,
    account: account,
    password: password,
    creator: creator
  }
  console.log(body)
  return api(`/users`, {
    method: 'post',
    params: {},
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
