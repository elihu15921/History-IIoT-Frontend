import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_UploadParam(
  id,
  attribNo,
  nodePath,
  equipmentId,
  timeseriesParamType,
  isDisable
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = [
    {
      id: id,
      attribNo: attribNo,
      nodePath: nodePath,
      equipmentId: equipmentId,
      timeseriesParamType: timeseriesParamType,
      isDisable: isDisable,
      creator: creator,
    },
  ]
  console.log(body)
  return api('/parameters', {
    method: 'put',
    params: {
      workshopTaskType: 2025202,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
