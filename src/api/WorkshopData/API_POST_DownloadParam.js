import { api } from 'boot/axios'

// 新增設備基礎信息
export function API_POST_DownloadParam(
  commandNo,
  equipmentId,
  upperSystemType,
  commandParamType,
  isDisable
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    commandNo: commandNo,
    equipmentId: equipmentId,
    upperSystemType: upperSystemType,
    commandParamType: commandParamType,
    isDisable: isDisable,
    creator: creator,
  }
  console.log(body)
  return api('/parameters', {
    method: 'post',
    params: {
      workshopTaskType: 2025201,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
