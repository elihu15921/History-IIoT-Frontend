import { api } from 'boot/axios'

// 取得工廠配置資料
export function API_GET_Task_Collection_log(
  url,
  search,
  pageNumber,
  pageSize,
  dateTimeFilter,
  conditions,
  missionType
) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/transactions`
  } else if (url == null) {
    // 情境: 沒有下一頁、或沒有上一頁時
    return null
  }
  console.log('dateTimeFilter: ' + dateTimeFilter)
  console.log('conditions: ' + conditions)
  console.log('missionType: ' + missionType)
  return api(url, {
    method: 'get',
    params: {
      search: search,
      pageNumber: pageNumber,
      pageSize: pageSize,
      dateTimeFilter: dateTimeFilter,
      conditions: conditions,
      missionType: missionType,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
