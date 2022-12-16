import { api } from 'boot/axios'

// 新增任務
export function API_POST_Task(
  missionType,
  equipmentId,
  operateType,
  situationType
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    equipmentId: equipmentId,
    operateType: operateType,
    part: {
      situationType: situationType
    },
    creator: creator,
  }
  console.log(body)
  return api(`/logics/${missionType}`, {
    method: 'post',
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
