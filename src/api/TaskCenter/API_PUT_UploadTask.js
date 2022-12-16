import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_UploadTask(
  workshopTaskType,
  id,
  taskNo,
  taskName,
  equipmentId,
  isProduction,
  isUpload
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = [
    {
      id: id,
      taskNo: taskNo,
      taskName: taskName,
      equipmentId: equipmentId,
      isProduction: isProduction,
      isUpload: isUpload,
      creator: creator,
    },
  ]
  console.log(body)
  return api('/logics', {
    method: 'put',
    params: {
      workshopTaskType: workshopTaskType,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
