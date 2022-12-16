import { api } from 'boot/axios'

// 取得操作狀態清單
// [
//   {
//       "typeNo": 101,
//       "typeName": "启用"
//   },
//   {
//       "typeNo": 102,
//       "typeName": "禁用"
//   }
// ]
export function API_GET_OperateStatus(url, search, pageNumber, pageSize) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/globals/operate_types`
  } else if (url == null) {
    // 情境: 沒有下一頁、或沒有上一頁時
    return null
  }
  return api(url, {
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
