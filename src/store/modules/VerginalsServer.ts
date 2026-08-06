import { getDefaultVerginalsApiUrl, normalizeVerginalsApiUrl } from '@/utils/verginalsApi'

interface VerginalsServerState {
  api: string
}

const state: VerginalsServerState = {
  api: getDefaultVerginalsApiUrl()
}

const mutations = {
  UPDATE_VERGINALS_API (state: VerginalsServerState, api: string) {
    state.api = normalizeVerginalsApiUrl(api)
  }
}

const actions = {
  // @ts-ignore
  updateVerginalsApi ({ commit }, api: string) {
    commit('UPDATE_VERGINALS_API', api)
  }
}

const getters = {
  currentVerginalsApi: (state: VerginalsServerState) => {
    return state.api || getDefaultVerginalsApiUrl()
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
