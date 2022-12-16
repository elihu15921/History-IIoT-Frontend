import { api } from 'boot/axios'

// 取得交易數據量
export function API_GET_Task_TransactionDataVolume(dateTimeGroup) {
  return api(`/homes/transactions?dateTimeGroup=${dateTimeGroup}`, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
