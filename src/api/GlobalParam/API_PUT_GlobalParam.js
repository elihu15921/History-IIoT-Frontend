import { api } from 'boot/axios'

// 更新設備基礎信息
export function API_PUT_GlobalParam(data) {
  let creator = JSON.parse(sessionStorage.getItem('userInfo')).account
  const body = {
    smes: {
      formalAreaURL: data.smes.formalAreaURL,
      testAreaURL: data.smes.testAreaURL
    },
    poller: {
      pushTask: {
        frequency: data.poller.pushTask.frequency
      }
    },
    pcba: {
      url: data.pcba.url
    },
    database: {
      ip: data.database.ip,
      postgresPort: data.database.postgresPort,
      influxdbPort: data.database.influxdbPort,
      database: data.database.database,
      username: data.database.username,
      password: data.database.password
    }
  }
  console.log(body)
  return api('/globals', {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Accept-Language': localStorage.getItem('lang'),
      accept: 'application/json',
    },
    data: body,
  })
}
