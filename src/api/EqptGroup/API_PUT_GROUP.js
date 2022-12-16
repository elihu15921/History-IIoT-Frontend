import { api } from 'boot/axios'

// 更新工廠配置資料
export function API_PUT_GROUP(id, groupNo, groupName, factoryId) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    groupNo: groupNo,
    groupName: groupName,
    factoryId: factoryId,
    creator: creator,
  }

  console.log(body)
  return api('/groups', {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
