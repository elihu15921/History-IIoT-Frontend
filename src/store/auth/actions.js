export const doLogin = async ({ commit }, payload) => {
  console.log(payload)
}

export const signOut = ({ commit }) => {
  service.defaults.headers.common.Authorization = ''
  commit('removeToken')
}

export const getMe = async ({ commit }, token) => {
  await service.get('/api/v1/users/me/', token.access).then((response) => {
    commit('setMe', response.data)
  })
}

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem('token')
  if (token) {
    await commit('setToken', JSON.parse(token))
    service.defaults.headers.common.Authorization = 'JWT ' + JSON.parse(token).access
    dispatch('getMe', JSON.parse(token))
  } else {
    commit('removeToken')
  }
}
