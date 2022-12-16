import { useQuasar } from 'quasar'

export const setToken = (state, token) => {
  state.token = token
  state.isAuthenticated = true
  window.localStorage.setItem('token', JSON.stringify(token))
}

export const removeToken = (state) => {
  state.token = ''
  state.isAuthenticated = false
}

export const setMe = (state, me) => {
  state.me = me
}

// const TokenKey = 'admin-token'
// const $q = useQuasar()

// export function getToken() {
//   return $q.cookies.get(TokenKey)
// }
// export function setToken(token) {
//   return $q.cookies.set(TokenKey, token)
// }
// export function removeToken() {
//   return $q.cookies.remove(TokenKey)
// }
