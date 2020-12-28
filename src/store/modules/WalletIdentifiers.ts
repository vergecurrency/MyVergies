const state: string[] = []

const mutations = {
  ADD_WALLET_IDENTIFIER (state: string[], newWalletIdentifier: string) {
    state.push(newWalletIdentifier)
  },

  REMOVE_WALLET_IDENTIFIER (state: string[], walletIdentifier: string) {
    state.splice(state.findIndex(n => n === walletIdentifier), 1)
  }
}

const actions = {
  // @ts-ignore
  addWalletIdentifier ({ commit }, walletIdentifier: string) {
    commit('ADD_WALLET_IDENTIFIER', walletIdentifier)
  },

  // @ts-ignore
  removeWalletIdentifier ({ commit }, walletIdentifier: string) {
    commit('REMOVE_WALLET_IDENTIFIER', walletIdentifier)
  }
}

const getters = {
  allWalletIdentifiers: (state: string[]) => {
    return state
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
