import { api } from 'boot/axios'

// 更新工廠配置資料
export function API_PUT_FACTORY(id, factoryNo, factoryName) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    id: id,
    factoryNo: factoryNo,
    factoryName: factoryName,
    creator: creator,
  }
  
  console.log(body)
  return api('/factories', {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
