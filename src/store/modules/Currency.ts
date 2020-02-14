import constants from '@/utils/constants'

interface Currency {
  code: string
}

const state: Currency = {
  code: constants.defaultCurrencyCode
}

const mutations = {
  UPDATE_CURRENCY (state: Currency, newCurrencyCode: string) {
    state.code = newCurrencyCode
  }
}

const actions = {
  // @ts-ignore
  updateCurrency ({ commit }, currency: string) {
    commit('UPDATE_CURRENCY', currency)
  }
}

const getters = {
  currentCurrencyCode: (state: Currency) => {
    return state.code
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
