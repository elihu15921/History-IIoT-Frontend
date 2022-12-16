import { api } from 'boot/axios'

// 新增工廠配置資料
export function API_POST_GROUP(groupNo, groupName, factoryId) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    groupNo: groupNo,
    groupName: groupName,
    factoryId: factoryId,
    creator: creator,
  }
  console.log(body)
  return api('/groups', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
