import { api } from 'boot/axios'

// 新增上傳任務
export function API_POST_DownloadTask(workshopTaskType, taskNo, taskName, equipmentId) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    taskNo: taskNo,
    taskName: taskName,
    equipmentId: equipmentId,
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
