import { api } from 'boot/axios'

// 更新任務
export function API_PUT_Task(
  id,
  missionType,
  equipmentId,
  operateType,
  situationType
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    equipmentId: equipmentId,
    operateType: operateType,
    part: {
      situationType: situationType
    },
    creator: creator,
  }
  console.log(body)
  return api(`/logics/${missionType}`, {
    method: 'put',
    params: {
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
