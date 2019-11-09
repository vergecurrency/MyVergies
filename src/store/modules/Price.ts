interface Price {
  rate: number
}

const state: Price = {
  rate: 0.001
}

const mutations = {
  UPDATE_RATE_PRICE_USD (state: Price, newRate: number) {
    state.rate = newRate
  }
}

const actions = {
  // @ts-ignore
  updatePriceRate ({ commit }, price: number) {
    commit('UPDATE_RATE_PRICE_USD', price)
  }
}

const getters = {
  currentRate: (state: Price) => {
    return state.rate
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
