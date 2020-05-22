const state: string[] = []

const mutations = {
  ADD_WALLET_NAME (state: string[], newWalletName: string) {
    state.push(newWalletName)
  },

  REMOVE_WALLET_NAME (state: string[], walletName: string) {
    state.splice(state.findIndex(n => n === walletName), 1)
  }
}

const actions = {
  // @ts-ignore
  addWalletName ({ commit }, walletName: string) {
    commit('ADD_WALLET_NAME', walletName)
  },

  // @ts-ignore
  removeWalletName ({ commit }, walletName: string) {
    commit('REMOVE_WALLET_NAME', walletName)
  }
}

const getters = {
  allWalletNames: (state: string[]) => {
    return state
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
