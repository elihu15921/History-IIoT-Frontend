import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_EqptBasicInfo(
  id,
  equipmentNo,
  equipmentName,
  groupId,
  networkId,
  operateType
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    equipmentNo: equipmentNo,
    equipmentName: equipmentName,
    groupId: groupId,
    networkId: networkId,
    operateType: operateType,
    creator: creator,
  }

  console.log(body)
  return api('/equipments', {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
