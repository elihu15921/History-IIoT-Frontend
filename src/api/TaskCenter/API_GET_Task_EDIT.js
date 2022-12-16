import { api } from 'boot/axios'

// 取得編輯資料(右邊開窗)
export function API_GET_Task_EDIT(url, id) {
  if (url == '') {
    // 有條件的查詢，都沒符合此if判斷式時為觸發上一頁或下一頁
    url = `/logics/${id}`
  } else if (url == null) {
    // 情境: 沒有下一頁、或沒有上一頁時
    return null
  }
  console.log(url);
  return api(url, {
    method: 'get',
    params: {
    },
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
  })
}
