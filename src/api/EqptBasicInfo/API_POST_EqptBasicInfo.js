import { api } from 'boot/axios'

// 新增設備基礎信息
export function API_POST_EqptBasicInfo(
  equipmentNo,
  equipmentName,
  groupId,
  networkId,
  operateType
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    equipmentNo: equipmentNo,
    equipmentName: equipmentName,
    groupId: groupId,
    networkId: networkId,
    operateType: operateType,
    creator: creator,
  }
  console.log(body)
  return api('/equipments', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
