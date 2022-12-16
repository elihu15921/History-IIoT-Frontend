import { api } from 'boot/axios'

const getHostIP = window.location.hostname
const url = `http://${getHostIP}:17770/apis/edifices/peripheries/globals/apply-button`

// 重啟後台 (已棄用)
export function API_PUT_Reboot() {
  return api(url, {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
