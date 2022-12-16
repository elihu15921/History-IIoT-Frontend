import { api } from 'boot/axios'

// 取得工廠配置資料
export function API_GET_FACTORY(url, search, pageNumber, pageSize) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/factories`
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
    },
    headers: {
      // 共用內容寫在axios.js
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
  })
}
