<template>
  <b-dropdown aria-role="list" class="dropdown-trigger" position="is-bottom-left">
    <button class="button is-white is-not-draggable" slot="trigger">
      <LoadingOnion v-if="connectionStatus === 'loading'" />
      <DisconnectedOnion v-if="connectionStatus === 'disconnected'" />
      <ConnectedOnion v-if="connectionStatus === 'connected'" />
    </button>
    <b-dropdown-item aria-role="listitem" :focusable="false" custom>
      <div class="ox">
        <b-field>
          <b-switch v-model="torActivated" @input="changed">
            {{ $i18n.t("tor.toggle") }}
          </b-switch>
        </b-field>
      </div>
    </b-dropdown-item>
    <hr class="dropdown-divider">
    <b-dropdown-item aria-role="listitem" :focusable="false" custom>
      <b-field label="Tor Status">
        {{ this.connectionStatusName }}
      </b-field>
    </b-dropdown-item>
    <div v-if="!loading">
      <b-dropdown-item aria-role="listitem" :focusable="false" custom>
        <b-field label="IP Address">
          {{ networkData.ip }}
        </b-field>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem" :focusable="false" custom>
        <b-field label="Region">
          {{ networkData.country_name }}, {{ networkData.city }}
        </b-field>
      </b-dropdown-item>
    </div>
  </b-dropdown>
</template>

<script>
import { ipcRenderer } from 'electron'
import LoadingOnion from '@/assets/tor-icons/onion-loading'
import DisconnectedOnion from '@/assets/tor-icons/onion-disconnected'
import ConnectedOnion from '@/assets/tor-icons/onion-connected'
import constants, { eventConstants } from '@/utils/constants'

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
      ipcRenderer.sendSync(eventConstants.toggleTor, { activate: this.torActivated })
      ipcRenderer.once(eventConstants.toggledTor, () => {
        this.fetchIpAddress()
      })
    }
  }
}
</script>
