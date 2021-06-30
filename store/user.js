const state = () => ({
  value: 'myvalue',
})

const getters = {
  getterValue: (state) => {
    return state.value
  },
}

const mutations = {
  updateValue: (state, payload) => {
    state.value = payload
  },
}

const actions = {
  updateActionValue({ commit }, payload) {
    commit('updateValue', payload)
  },
}

export default { state, getters, actions, mutations }
