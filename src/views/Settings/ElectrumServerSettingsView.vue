<template>
  <div>
    <navigation-header
      :back="{ name: 'settings' }"
      title="ElectrumX Servers"
    />

    <div class="box">
      <form-section title="ElectrumX Servers" no-divider>
        <form-box
          title="Default server"
          description="Select the ElectrumX server used for mobile-compatible restore wallets."
          :is-narrow="false"
          type="is-info"
        >
          <b-field label="Server">
            <b-select v-model="selectedServerId" expanded>
              <option v-for="server in allElectrumServers" :key="server.id" :value="server.id">
                {{ server.label }} ({{ server.protocol.toUpperCase() }} {{ server.host }}:{{ server.port }})
              </option>
            </b-select>
          </b-field>
          <p class="electrum-status-line">
            <span :class="['electrum-status-light', liveConnectionStatusClass]"></span>
            <span class="electrum-status-text">{{ liveConnectionStatusText }}</span>
          </p>
          <div class="buttons">
            <b-button
              class="is-primary is-cta"
              :disabled="!selectedServer || connecting"
              @click="connectSelectedServer"
            >
              {{ connecting ? 'Connecting...' : 'Connect' }}
            </b-button>
          </div>
        </form-box>

        <form-box
          title="Add custom server"
          description="Add your own ElectrumX endpoint if you want a private or self-hosted server."
          :is-narrow="false"
        >
          <div class="columns">
            <div class="column">
              <b-field label="Label">
                <b-input v-model="draft.label" />
              </b-field>
            </div>
            <div class="column">
              <b-field label="Host">
                <b-input v-model="draft.host" />
              </b-field>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <b-field label="Port">
                <b-input v-model.number="draft.port" type="number" min="1" max="65535" />
              </b-field>
            </div>
            <div class="column">
              <b-field label="Protocol">
                <b-select v-model="draft.protocol" expanded>
                  <option value="ssl">SSL</option>
                  <option value="tcp">TCP</option>
                </b-select>
              </b-field>
            </div>
          </div>

          <div class="buttons">
            <b-button
              class="is-primary is-cta"
              :disabled="!draftValid"
              @click="saveCustomServer"
            >
              Save custom server
            </b-button>
          </div>
        </form-box>

        <form-box
          title="Custom servers"
          description="Remove any custom endpoint you no longer want to keep."
          :is-narrow="false"
        >
          <div v-if="customServers.length === 0" class="has-text-grey">
            No custom ElectrumX servers saved yet.
          </div>

          <div v-for="server in customServers" :key="server.id" class="custom-server-row">
            <div>
              <strong>{{ server.label }}</strong>
              <div>{{ server.protocol.toUpperCase() }} {{ server.host }}:{{ server.port }}</div>
            </div>
            <b-button type="is-danger" outlined size="is-small" @click="removeServer(server.id)">
              Remove
            </b-button>
          </div>
        </form-box>
      </form-section>
    </div>

    <version-block/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NavigationHeader from '@/components/layout/NavigationHeader'
import FormSection from '@/components/layout/FormSection'
import FormBox from '@/components/layout/FormBox'
import VersionBlock from '@/components/VersionBlock'
import { isValidElectrumServer, normalizeElectrumServer } from '@/utils/electrumServers'

export default {
  name: 'electrum-server-settings-view',
  components: {
    FormBox,
    FormSection,
    NavigationHeader,
    VersionBlock
  },
  data () {
    return {
      selectedServerId: '',
      connecting: false,
      liveConnectionStatusText: 'No ElectrumX wallet connected yet.',
      liveConnectionStatusClass: 'is-idle',
      draft: {
        label: '',
        host: '',
        port: 50002,
        protocol: 'ssl'
      }
    }
  },
  computed: {
    ...mapGetters(['allElectrumServers', 'currentElectrumServerId']),
    selectedServer () {
      return this.allElectrumServers.find(server => server.id === this.selectedServerId) || null
    },
    customServers () {
      return this.allElectrumServers.filter(server => server.source === 'custom')
    },
    draftValid () {
      return isValidElectrumServer({
        ...this.draft,
        source: 'custom'
      })
    }
  },
  created () {
    this.selectedServerId = this.currentElectrumServerId
    this.refreshLiveConnectionStatus()
  },
  methods: {
    ...mapActions(['removeCustomElectrumServer', 'updateElectrumServerSelection', 'upsertCustomElectrumServer']),
    refreshLiveConnectionStatus () {
      const electrumWallet = this.$walletManager.getWallets().find(wallet => {
        return wallet && wallet.info && wallet.info.wallet && wallet.info.wallet.backend === 'electrumx'
      })

      if (!electrumWallet || !electrumWallet.info || !electrumWallet.info.wallet) {
        this.liveConnectionStatusText = 'No ElectrumX wallet connected yet.'
        this.liveConnectionStatusClass = 'is-idle'
        return
      }

      const walletInfo = electrumWallet.info.wallet
      const server = walletInfo.electrumServer || 'unknown server'

      if (walletInfo.electrumConnected) {
        this.liveConnectionStatusText = `Connected to ${server}`
        this.liveConnectionStatusClass = 'is-connected'
        return
      }

      this.liveConnectionStatusText = `Disconnected from ${server}`
      this.liveConnectionStatusClass = 'is-disconnected'
    },
    async connectSelectedServer () {
      if (!this.selectedServer) {
        return
      }

      this.connecting = true
      this.liveConnectionStatusText = `Connecting to ${this.selectedServer.label}...`
      this.liveConnectionStatusClass = 'is-pending'

      try {
        this.updateElectrumServerSelection(this.selectedServer.id)
        const updatedWallets = await this.$walletManager.reconnectElectrumWallets(this.selectedServer)
        this.refreshLiveConnectionStatus()
        this.$buefy.toast.open({
          message: updatedWallets > 0
            ? `Connected ${updatedWallets} ElectrumX wallet${updatedWallets === 1 ? '' : 's'} to ${this.selectedServer.label}.`
            : `Saved ${this.selectedServer.label} as the default ElectrumX server.`,
          type: 'is-success'
        })
      } catch (error) {
        this.refreshLiveConnectionStatus()
        this.$buefy.toast.open({
          message: error.message || String(error),
          type: 'is-danger'
        })
      } finally {
        this.connecting = false
      }
    },
    saveCustomServer () {
      if (!this.draftValid) {
        this.$buefy.toast.open({
          message: 'Enter a valid ElectrumX server.',
          type: 'is-danger'
        })
        return
      }

      const server = normalizeElectrumServer({
        ...this.draft,
        source: 'custom'
      })

      this.upsertCustomElectrumServer(server)
      this.selectedServerId = server.id
      this.$buefy.toast.open({
        message: 'ElectrumX server saved.',
        type: 'is-success'
      })

      this.draft = {
        label: '',
        host: '',
        port: 50002,
        protocol: 'ssl'
      }
    },
    removeServer (serverId) {
      this.removeCustomElectrumServer(serverId)
    }
  }
}
</script>

<style scoped>
.electrum-status-line {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0.5rem 0 1rem;
  color: var(--rv-text-soft);
}

.electrum-status-light {
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
}

.electrum-status-light.is-connected {
  background: #24dc8f;
  color: #24dc8f;
}

.electrum-status-light.is-disconnected {
  background: #ff5ba4;
  color: #ff5ba4;
}

.electrum-status-light.is-pending {
  background: #ffd166;
  color: #ffd166;
}

.electrum-status-light.is-idle {
  background: #8e95c8;
  color: #8e95c8;
}

.electrum-status-text {
  color: var(--rv-text-soft);
}

.custom-server-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0;
  border-top: 1px solid rgba(83, 243, 255, 0.12);
}

.custom-server-row:first-child {
  border-top: none;
  padding-top: 0;
}
</style>
