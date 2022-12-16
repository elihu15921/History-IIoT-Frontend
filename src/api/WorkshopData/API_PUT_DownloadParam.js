import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_DownloadParam(
  id,
  commandNo,
  equipmentId,
  upperSystemType,
  commandParamType,
  isDisable
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = [
    {
      id: id,
      commandNo: commandNo,
      equipmentId: equipmentId,
      upperSystemType: upperSystemType,
      commandParamType: commandParamType,
      isDisable: isDisable,
      creator: creator,
    },
  ]
  console.log(body)
  return api('/parameters', {
    method: 'put',
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
