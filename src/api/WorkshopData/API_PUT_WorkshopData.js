import { api } from 'boot/axios'

// 更新車間數據
export function API_PUT_WorkshopData(id, equipmentId, operateType, detail, mapper, missionType, dataType, processType) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
      id: id,
      equipmentId: equipmentId,
      operateType: operateType,
      part: {
        dataNo: dataType,
        dataType: dataType,
      },
      mapper: mapper,
      detail: detail,
      creator: creator,
    }

  console.log(body)
  return api(`/parameters/${processType}`, {
    method: 'put',
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
