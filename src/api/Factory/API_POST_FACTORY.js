import { api } from 'boot/axios'

// 新增工廠配置資料
export function API_POST_FACTORY(factoryNo, factoryName) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    factoryNo: factoryNo,
    factoryName: factoryName,
    creator: creator,
  }
  console.log(body)
  return api('/factories', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
