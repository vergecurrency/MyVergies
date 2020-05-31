<template>
  <b-dropdown hoverable aria-role="list" class="dropdown-trigger">
    <button class="button is-white is-not-draggable" slot="trigger">
      <LoadingOnion v-if="connectionStatus === 'loading'" />
      <DisconnectedOnion v-if="connectionStatus === 'disconnected'" />
      <ConnectedOnion v-if="connectionStatus === 'connected'" />
    </button>
    <b-dropdown-item aria-role="listitem" :focusable="false" custom paddingless>
      <div class="app-content-box">
        <div class="has-text-centered">
          <b-switch v-model="torActivated" @input="changed">
            {{ $i18n.t("tor.toggle") }}
          </b-switch>
          <br /><br />
          <b>Tor Status:</b> <br />{{ this.connectionStatusName }}<br /><br />
          <div v-if="!loading">
            <b>IP Address:</b> <br />{{ networkData.ip }}<br /><br />
            <b>Region:</b> <br />{{ networkData.country_name }},
            {{ networkData.city }}
          </div>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { ipcRenderer } from 'electron'
import LoadingOnion from '@/assets/tor-icons/onion-loading'
import DisconnectedOnion from '@/assets/tor-icons/onion-disconnected'
import ConnectedOnion from '@/assets/tor-icons/onion-connected'
import constants from '@/utils/constants'

export default {
  name: 'tor-status',
  components: { LoadingOnion, DisconnectedOnion, ConnectedOnion },
  data () {
    return {
      loading: true,
      networkData: {},
      error: null,
      torActivated: true
    }
  },
  mounted () {
    this.fetchIpAddress()
  },
  computed: {
    connectionStatusName: function () {
      if (this.loading) {
        return this.$i18n.t('tor.status.loading')
      }

      if (!this.torActivated) {
        return this.$i18n.t('tor.status.disconnected')
      }

      return this.$i18n.t('tor.status.connected')
    },
    connectionStatus: function () {
      if (this.loading) {
        return 'loading'
      }

      if (!this.torActivated) {
        return 'disconnected'
      }

      return 'connected'
    }
  },
  methods: {
    fetchIpAddress: function () {
      this.error = null
      this.ip = null
      this.loading = true
      return fetch(constants.ipApi)
        .then(res => res.ok && res.json())
        .then(networkData => {
          this.networkData = networkData
          this.loading = false
        })
        .catch(err => {
          this.error = err
          this.loading = false
        })
    },
    changed: function () {
      ipcRenderer.sendSync('TOGGLE_TOR', { activate: this.torActivated })
      ipcRenderer.once('TOR_TOGGLED', () => {
        this.fetchIpAddress()
      })
    }
  }
}
</script>
