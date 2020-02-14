interface Language {
  code: string
}

const state: Language = {
  code: 'en'
}

const mutations = {
  UPDATE_LANGUAGE (state: Language, newLanguageCode: string) {
    state.code = newLanguageCode
  }
}

const actions = {
  // @ts-ignore
  updateLanguage ({ commit }, language: string) {
    commit('UPDATE_LANGUAGE', language)
  }
}

const getters = {
  currentLanguageCode: (state: Language) => {
    return state.code
  }
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}
