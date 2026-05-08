import {
  ElectrumServerConfig,
  findElectrumServerById,
  getDefaultElectrumServerId,
  getDefaultElectrumServers,
  normalizeElectrumServer
} from '@/utils/electrumServers'

interface ElectrumServersState {
  selectedServerId: string
  customServers: ElectrumServerConfig[]
}

const state: ElectrumServersState = {
  selectedServerId: getDefaultElectrumServerId(),
  customServers: []
}

const mutations = {
  UPDATE_ELECTRUM_SERVER_SELECTION (state: ElectrumServersState, selectedServerId: string) {
    state.selectedServerId = selectedServerId
  },
  UPSERT_CUSTOM_ELECTRUM_SERVER (state: ElectrumServersState, server: ElectrumServerConfig) {
    const normalized = normalizeElectrumServer({ ...server, source: 'custom' })
    const existingIndex = state.customServers.findIndex(item => item.id === normalized.id)

    if (existingIndex >= 0) {
      state.customServers.splice(existingIndex, 1, normalized)
      return
    }

    state.customServers.push(normalized)
  },
  REMOVE_CUSTOM_ELECTRUM_SERVER (state: ElectrumServersState, serverId: string) {
    state.customServers = state.customServers.filter(server => server.id !== serverId)
    if (state.selectedServerId === serverId) {
      state.selectedServerId = getDefaultElectrumServerId()
    }
  }
}

const actions = {
  // @ts-ignore
  updateElectrumServerSelection ({ commit }, selectedServerId: string) {
    commit('UPDATE_ELECTRUM_SERVER_SELECTION', selectedServerId)
  },
  // @ts-ignore
  upsertCustomElectrumServer ({ commit }, server: ElectrumServerConfig) {
    commit('UPSERT_CUSTOM_ELECTRUM_SERVER', server)
  },
  // @ts-ignore
  removeCustomElectrumServer ({ commit }, serverId: string) {
    commit('REMOVE_CUSTOM_ELECTRUM_SERVER', serverId)
  }
}

const getters = {
  allElectrumServers: (state: ElectrumServersState): ElectrumServerConfig[] => {
    return [
      ...getDefaultElectrumServers(),
      ...(state.customServers || []).map(server => normalizeElectrumServer({ ...server, source: 'custom' }))
    ]
  },
  currentElectrumServerId: (state: ElectrumServersState): string => {
    return state.selectedServerId || getDefaultElectrumServerId()
  },
  currentElectrumServer: (state: ElectrumServersState, getters: any): ElectrumServerConfig => {
    return findElectrumServerById(getters.allElectrumServers, getters.currentElectrumServerId) || getDefaultElectrumServers()[0]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
