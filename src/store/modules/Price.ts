const state = {
  rate: 0.001
}

const mutations = {
  UPDATE_RATE_PRICE_USD (state: object, newRate: number) {
    // @ts-ignore
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
  currentRate: (state: object) => {
    // @ts-ignore
    return state.rate
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
