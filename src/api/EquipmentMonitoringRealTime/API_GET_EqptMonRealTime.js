import { api } from 'boot/axios'

// 取得工廠配置資料
export function API_GET_EqptMonRealTime(url, search, pageNumber, pageSize, environmentType, conditions) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/monitors`
  } else if (url == null) {
    // 情境: 沒有下一頁、或沒有上一頁時
    return null
  }
  console.log('conditions: ' + conditions)
  return api(url, {
    method: 'get',
    params: {
      search: search,
      pageNumber: pageNumber,
      pageSize: pageSize,
      environmentType: environmentType,
      conditions: conditions,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
