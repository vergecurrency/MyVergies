<template>
  <content-view title="Verginals">
    <template slot="section">
      <section class="section verginals-section">
        <div class="verginals-panel">
          <div class="verginals-header">
            <div>
              <h3 class="is-size-4 is-family-display verginals-title">Verginals</h3>
              <p class="verginals-copy">{{ statusSummary }}</p>
            </div>
            <b-button
              type="is-primary"
              icon-left="sync-alt"
              :loading="loading"
              :disabled="!canLoad"
              @click="loadVerginals"
            >
              Refresh
            </b-button>
          </div>

          <div class="verginals-controls">
            <b-field label="Verginals API" :type="apiValid ? '' : 'is-danger'" :message="apiMessage">
              <b-input v-model="apiDraft" type="url" expanded @blur="saveApi"/>
            </b-field>

            <div class="columns">
              <div class="column">
                <b-field label="Wallet">
                  <b-select v-model="selectedWalletIdentifier" expanded>
                    <option value="">No wallet selected</option>
                    <option v-for="wallet in wallets" :key="wallet.identifier" :value="wallet.identifier">
                      {{ wallet.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Address">
                  <b-input
                    v-model="manualAddress"
                    expanded
                    placeholder="Paste a Verge address"
                    @keyup.native.enter="loadVerginals"
                  />
                </b-field>
              </div>
            </div>
          </div>

          <b-notification v-if="error" type="is-danger" :closable="false">
            <p>{{ error }}</p>
            <div class="buttons mt-2">
              <b-button v-if="lastLookupUrl" size="is-small" type="is-light" @click="openExternal(lastLookupUrl)">
                Open API query
              </b-button>
              <b-button v-if="galleryUrl" size="is-small" type="is-light" @click="openExternal(galleryUrl)">
                Open gallery
              </b-button>
            </div>
          </b-notification>

          <div v-if="loading" class="verginals-grid">
            <div v-for="index in 6" :key="index" class="verginal-card verginal-card-loading">
              <b-skeleton animated height="160"></b-skeleton>
              <b-skeleton animated width="70%"></b-skeleton>
            </div>
          </div>

          <div v-else-if="inscriptions.length > 0" class="verginals-grid">
            <a
              v-for="inscription in inscriptions"
              :key="inscription.key"
              class="verginal-card"
              :href="inscription.contentUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="verginal-media">
                <img
                  v-if="inscription.contentUrl"
                  :src="inscription.contentUrl"
                  :alt="inscription.title"
                  @error="markImageFailed(inscription)"
                >
                <div v-else class="verginal-media-fallback">
                  <b-icon icon="images" size="is-large"/>
                </div>
              </div>
              <div class="verginal-body">
                <p class="verginal-title">{{ inscription.title }}</p>
                <p class="verginal-meta">{{ inscription.owner }}</p>
                <p v-if="inscription.txid" class="verginal-txid">{{ inscription.txid }}</p>
              </div>
            </a>
          </div>

          <div v-else-if="!error" class="verginals-empty">
            <b-icon icon="images" size="is-large"/>
            <p>No Verginals found for the selected addresses.</p>
          </div>
        </div>
      </section>
    </template>
  </content-view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ContentView from '@/components/layout/ContentView'
import { buildVerginalsApiUrl, getDefaultVerginalsApiUrl, isValidVerginalsApiUrl, normalizeVerginalsApiUrl } from '@/utils/verginalsApi'
import { ensureTorProxyState } from '@/utils/torStartup'

export default {
  name: 'VerginalsView',
  components: { ContentView },
  data () {
    return {
      apiDraft: '',
      selectedWalletIdentifier: '',
      manualAddress: '',
      loading: false,
      waitingForTor: false,
      error: '',
      lastLookupUrl: '',
      inscriptions: []
    }
  },
  computed: {
    ...mapGetters(['currentVerginalsApi']),
    wallets () {
      return this.$walletManager.getWallets()
    },
    selectedWallet () {
      return this.wallets.find(wallet => wallet.identifier === this.selectedWalletIdentifier)
    },
    apiValid () {
      return isValidVerginalsApiUrl(this.apiDraft)
    },
    apiMessage () {
      return this.apiValid
        ? `Default: ${getDefaultVerginalsApiUrl()}`
        : 'Use a full HTTP or HTTPS URL.'
    },
    canLoad () {
      return this.apiValid && (this.selectedWallet || this.manualAddress.trim())
    },
    galleryUrl () {
      const address = this.manualAddress.trim()

      return address ? buildVerginalsApiUrl(this.currentVerginalsApi, `/gallery/${encodeURIComponent(address)}`) : ''
    },
    statusSummary () {
      if (this.waitingForTor) {
        return 'Waiting for Tor'
      }

      if (this.loading) {
        return 'Loading'
      }

      return `${this.inscriptions.length} found`
    }
  },
  watch: {
    currentVerginalsApi (api) {
      this.apiDraft = normalizeVerginalsApiUrl(api)
    }
  },
  created () {
    this.apiDraft = normalizeVerginalsApiUrl(this.currentVerginalsApi)

    if (this.wallets.length > 0) {
      this.selectedWalletIdentifier = this.wallets[0].identifier
      this.loadVerginals()
    }
  },
  methods: {
    ...mapActions(['updateVerginalsApi']),
    saveApi () {
      if (!this.apiValid) {
        return
      }

      this.apiDraft = normalizeVerginalsApiUrl(this.apiDraft)
      this.updateVerginalsApi(this.apiDraft)
    },
    async loadVerginals () {
      if (!this.canLoad) {
        return
      }

      this.saveApi()
      this.loading = true
      this.waitingForTor = false
      this.error = ''
      this.lastLookupUrl = ''

      try {
        await this.waitForTorIfEnabled()
        const addresses = await this.getLookupAddresses()

        if (addresses.length === 0) {
          this.inscriptions = []
          this.error = 'No wallet addresses are available yet. Open Receive or paste an address to search.'
          return
        }

        const results = await Promise.allSettled(addresses.map(address => this.fetchAddressInscriptions(address)))
        const failed = results.filter(result => result.status === 'rejected')
        const items = results
          .filter(result => result.status === 'fulfilled')
          .reduce((items, result) => items.concat(result.value.items), [])

        this.inscriptions = this.normalizeInscriptions(items)

        if (failed.length > 0 && this.inscriptions.length === 0) {
          this.error = this.formatLookupError(failed[0].reason)
        } else if (failed.length > 0) {
          this.$buefy.toast.open({
            message: `Some address lookups failed (${failed.length}/${addresses.length}).`,
            type: 'is-warning'
          })
        }
      } catch (error) {
        this.error = this.formatLookupError(error)
      } finally {
        this.loading = false
        this.waitingForTor = false
      }
    },
    async waitForTorIfEnabled () {
      if (!this.$store.getters.isTorEnabled) {
        return
      }

      this.waitingForTor = true
      await ensureTorProxyState(true)
      this.waitingForTor = false
    },
    async getLookupAddresses () {
      const addresses = new Set()
      const manualAddress = this.manualAddress.trim()

      if (manualAddress) {
        addresses.add(manualAddress)

        return Array.from(addresses)
      }

      if (!this.selectedWallet) {
        return Array.from(addresses)
      }

      this.addWalletAddresses(addresses, this.selectedWallet)

      try {
        await this.selectedWallet.getMainAddresses({})
        this.addWalletAddresses(addresses, this.selectedWallet)
      } catch (error) {
        // Existing cached addresses are still useful if the wallet service is temporarily unavailable.
      }

      return Array.from(addresses)
    },
    addWalletAddresses (addresses, wallet) {
      if (wallet.addresses) {
        wallet.addresses.forEach(entry => {
          if (entry.address) {
            addresses.add(entry.address)
          }
        })
      }

      const byAddress = wallet.info && wallet.info.balance && wallet.info.balance.byAddress
        ? wallet.info.balance.byAddress
        : []

      byAddress.forEach(entry => {
        if (entry.address) {
          addresses.add(entry.address)
        }
      })
    },
    async fetchAddressInscriptions (address) {
      const url = buildVerginalsApiUrl(this.currentVerginalsApi, `/api/inscriptions?owner=${encodeURIComponent(address)}`)
      this.lastLookupUrl = url
      const response = await this.fetchVerginalsJson(url)
      const data = response.data
      const items = Array.isArray(data)
        ? data
        : data.inscriptions || data.items || data.results || data.assets || []

      return { address, items }
    },
    async fetchVerginalsJson (url) {
      const attempts = 2
      let lastError = null

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await this.$http.get(url, {
            timeout: 90000,
            headers: {
              accept: 'application/json'
            }
          })
        } catch (error) {
          lastError = error

          if (attempt < attempts) {
            await new Promise(resolve => setTimeout(resolve, 2500))
          }
        }
      }

      throw lastError
    },
    normalizeInscriptions (items) {
      const seen = new Set()

      return items.map(item => this.normalizeInscription(item))
        .filter(item => {
          if (!item.key || seen.has(item.key)) {
            return false
          }

          seen.add(item.key)
          return true
        })
    },
    normalizeInscription (item) {
      const txid = item.txid || item.genesis || item.id || this.extractTxid(item.location || '')
      const number = item.number || item.num || item.index || item.collectionNumber
      const owner = item.owner || item.address || item.to || ''
      const title = number ? `Verginal #${number}` : (txid ? `Verginal ${txid.slice(0, 8)}` : 'Verginal')
      const contentUrl = item.contentUrl || item.content || (txid ? buildVerginalsApiUrl(this.currentVerginalsApi, `/api/content/${txid}`) : '')

      return {
        key: txid || item.location || JSON.stringify(item),
        txid,
        owner,
        title,
        contentUrl
      }
    },
    extractTxid (location) {
      const match = location.match(/[a-fA-F0-9]{64}/)

      return match ? match[0] : ''
    },
    markImageFailed (inscription) {
      inscription.contentUrl = ''
    },
    openExternal (url) {
      this.$electron.shell.openExternal(url)
    },
    formatLookupError (error) {
      const message = error && error.message ? error.message : error.toString()

      if (/timeout/i.test(message)) {
        return 'The Verginals API did not answer through Tor before the request timed out. The public server may be syncing its inscription index, blocking Tor exits, or this owner lookup may be too slow on that server.'
      }

      return message
    }
  }
}
</script>

<style scoped>
.verginals-section {
  padding: 0;
}

.verginals-panel {
  padding: 1.25rem;
  border: 1px solid rgba(83, 243, 255, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(140deg, rgba(255, 87, 210, 0.14), transparent 48%),
    linear-gradient(180deg, rgba(9, 14, 32, 0.94), rgba(7, 10, 24, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 36px rgba(1, 4, 18, 0.18);
}

.verginals-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.verginals-title {
  margin-bottom: 0.75rem;
  color: var(--rv-text);
}

.verginals-copy {
  color: var(--rv-text-soft);
}

.verginals-controls {
  margin-bottom: 1rem;
}

.verginals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1rem;
}

.verginal-card {
  display: block;
  overflow: hidden;
  border: 1px solid rgba(83, 243, 255, 0.14);
  border-radius: 8px;
  background: rgba(5, 10, 26, 0.64);
  color: var(--rv-text);
}

.verginal-card:hover {
  border-color: rgba(83, 243, 255, 0.36);
}

.verginal-card-loading {
  padding: 0.75rem;
}

.verginal-media {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  background: rgba(83, 243, 255, 0.06);
}

.verginal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verginal-media-fallback {
  color: var(--rv-text-muted);
}

.verginal-body {
  padding: 0.75rem;
}

.verginal-title {
  overflow: hidden;
  margin-bottom: 0.35rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verginal-meta,
.verginal-txid {
  overflow: hidden;
  color: var(--rv-text-soft);
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verginals-empty {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  padding: 2rem;
  color: var(--rv-text-soft);
  text-align: center;
}

@media (max-width: 768px) {
  .verginals-header {
    flex-direction: column;
  }
}
</style>
