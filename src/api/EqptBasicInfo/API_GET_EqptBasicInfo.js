import { api } from 'boot/axios'

// 取得設備基礎信息
export function API_GET_EqptBasicInfo(url, search, pageNumber, pageSize, groupId, pushTaskFilter) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/equipments`
  } else if (url == null) {
    // 情境: 沒有下一頁、或沒有上一頁時
    return null
  }
  return api(url, {
    method: 'get',
    params: {
      search: search,
      pageNumber: pageNumber,
      pageSize: pageSize,
      groupId: groupId,
      pushTaskFilter: pushTaskFilter,
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}