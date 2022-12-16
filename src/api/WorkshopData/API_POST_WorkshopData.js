import { api } from 'boot/axios'

// 新增車間數據
export function API_POST_WorkshopData(equipmentId, operateType, detail, mapper, processType, missionType, dataType) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    equipmentId: equipmentId,
    operateType: operateType,
    part: {
      dataNo: dataType,
      dataType: dataType,
    },
    mapper: mapper,
    detail: detail,
    creator: creator
  }
  console.log(body)
  return api(`/parameters/${processType}`, {
    method: 'post',
    params: {
      missionType: missionType,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
