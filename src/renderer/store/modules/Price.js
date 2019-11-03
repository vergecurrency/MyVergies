const state = {
  rate: 0.001
}

const mutations = {
  UPDATE_RATE_PRICE_USD (state, newRate) {
    state.rate = newRate
  }
}

const actions = {
  updatePriceRate ({ commit }, price) {
    commit('UPDATE_RATE_PRICE_USD', price)
  }
}

const getters = {
  currentRate: (state) => {
    return state.rate
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
