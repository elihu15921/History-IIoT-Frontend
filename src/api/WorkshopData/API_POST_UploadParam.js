import { api } from 'boot/axios'

// 新增設備基礎信息
export function API_POST_UploadParam(attribNo, nodePath, equipmentId, timeseriesParamType, isDisable) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    attribNo: attribNo,
    nodePath: nodePath,
    equipmentId: equipmentId,
    timeseriesParamType: timeseriesParamType,
    isDisable: isDisable,
    creator: creator,
  }
  console.log(body)
  return api('/parameters', {
    method: 'post',
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
