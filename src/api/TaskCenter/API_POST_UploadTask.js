import { api } from 'boot/axios'

// 新增設備基礎信息
export function API_POST_UploadTask(
  workshopTaskType,
  taskNo,
  taskName,
  equipmentId,
  isProduction,
  isUpload
) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    taskNo: taskNo,
    taskName: taskName,
    equipmentId: equipmentId,
    isProduction: isProduction,
    isUpload: isUpload,
    creator: creator,
  }
  console.log(body)
  return api('/logics', {
    method: 'post',
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
