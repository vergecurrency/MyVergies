<template>
  <div>
    <div class="block">
      <h3
        class="is-size-3 is-family-display create-flow-title"
        v-html="paperKeyTitle"
      />
      <p v-html="paperKeyDescription"/>
    </div>

    <div v-if="isElectrumxRestore" class="block">
      <b-field label="Recovery phrase">
        <b-input
          v-model="seedPhrase"
          type="textarea"
          placeholder="Enter your 12, 18, or 24 words separated by spaces"
          @blur="normalizeSeedPhrase"
        />
      </b-field>

      <b-field label="BIP39 seed passphrase (optional)">
        <b-input
          v-model="mnemonicPassphrase"
          type="password"
          password-reveal
          placeholder="Only fill this if your mobile wallet used an extra BIP39 passphrase"
        />
      </b-field>

      <p class="help is-info">
        Verge XVR-compatible restore uses BIP39 18-word seed phrases by default plus BIP44 coin type 77 over ElectrumX.
      </p>
    </div>

    <div v-else class="columns is-multiline">
      <div
        class="column is-one-third"
        v-for="(word, i) in words"
        :key="i+word"
      >
        <div class="tags are-medium has-addons word">
          <span class="tag is-success">{{ i+1 }}</span>
          <span v-if="restore" class="tag expand-word">
            <input v-model="paperkey[i]" class="word-input"/>
          </span>
          <span v-else class="tag word-tag is-family-code has-text-weight-semibold expand-word" v-html="word"/>
        </div>
      </div>
    </div>

    <div v-if="confirm && !isElectrumxRestore" class="columns">
      <div class="column">
        <div class="tags are-medium">
          <span
            v-for="(word, i) in randomWords" :key="i+word" v-html="word"
            class="tag selectable-word-tag is-family-code has-text-weight-semibold is-clickable"
            @click="selectedPaperkey.push(word)"
          />
        </div>
      </div>
    </div>

    <b-notification
      v-if="showInvalidPaperkeyError"
      type="is-danger"
    >
      {{ errorMessage }}
    </b-notification>

    <b-field grouped>
      <b-field v-if="showCopyButton" expanded>
        <b-button icon-left="copy" label="Copy seedphrase" @click="copySeedPhrase"/>
      </b-field>

      <b-field v-else-if="!isElectrumxRestore" expanded>
        <b-button v-show="confirm" label="Show paper key" @click="confirm = false"/>
      </b-field>

      <b-field v-if="!isElectrumxRestore" v-show="confirm && selectedPaperkey.length > 0">
        <b-button
          label="Reset"
          @click="resetSelectedPaperkey"
        />
      </b-field>

      <b-field>
        <b-button
          icon-left="edit"
          :label="isElectrumxRestore ? 'Verify recovery phrase' : $i18n.t('createWallet.confirmPaperKey')"
          type="is-primary"
          @click="confirmationHandler"
          :disabled="confirm && !isElectrumxRestore && selectedPaperkey.length < expectedPaperKeyLength"
        />
      </b-field>
    </b-field>
  </div>
</template>

<script>
import Constants from '@/utils/constants'
import Mnemonic from 'bitcore-mnemonic'

export default {
  name: 'PaperKey',
  props: {
    value: {
      type: Object,
      required: true
    },
    restore: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirm: false,
      showInvalidPaperkeyError: false,
      errorMessage: '',
      selectedPaperkey: [],
      paperkey: [],
      seedPhrase: '',
      mnemonicPassphrase: ''
    }
  },

  mounted () {
    this.generatePaperkey()
  },

  computed: {
    isElectrumxRestore () {
      return this.restore && this.value && this.value.backend === 'electrumx'
    },
    isElectrumxCreate () {
      return !this.restore && this.value && this.value.backend === 'electrumx'
    },
    showCopyButton () {
      return !this.restore && this.paperkey.length > 0
    },
    expectedPaperKeyLength () {
      if (this.isElectrumxCreate) {
        return 18
      }

      return Constants.paperKeyLength
    },
    paperKeyTitle () {
      return this.$i18n.t(this.restore ? 'createWallet.fillInYourPaperKey' : 'createWallet.aPaperKey')
    },
    paperKeyDescription () {
      if (this.isElectrumxCreate) {
        return 'This ElectrumX wallet uses an 18-word BIP39 recovery phrase, compatible with Verge XVR/Android. Write down every word in order and keep it offline.'
      }

      return this.$i18n.t(this.restore ? 'createWallet.fillInYourPaperKeyDesc' : 'createWallet.aPaperKeyDescription')
    },
    selectedPaperkeyWithPlaceholders () {
      const placeholders = Array(this.expectedPaperKeyLength).fill('', 0, this.expectedPaperKeyLength)

      this.selectedPaperkey.forEach(function (value, key) {
        placeholders[key] = value
      })

      return placeholders
    },

    words () {
      if (this.restore) {
        return Array(Constants.paperKeyLength).fill('', 0, Constants.paperKeyLength)
      }

      return this.confirm ? this.selectedPaperkeyWithPlaceholders : this.paperkey
    },

    randomWords () {
      const words = this.paperkey.filter(word => {
        return !this.selectedPaperkey.includes(word)
      })

      return this.shuffleWords(words)
    },

    paperkeyCheckupIsValid () {
      return this.paperkey.join('') === this.selectedPaperkey.join('')
    },
    normalizedSeedWords () {
      return this.seedPhrase.trim().toLowerCase().split(/\s+/).filter(Boolean)
    }
  },

  methods: {
    copySeedPhrase () {
      const words = this.paperkey.join(' ').trim()

      if (!words) {
        return
      }

      this.$electron.clipboard.writeText(words, 'selection')
      this.$buefy.toast.open({
        message: this.$i18n.t('main.copiedSuccessfully'),
        type: 'is-success'
      })
    },

    generatePaperkey () {
      if (this.isElectrumxRestore) {
        this.seedPhrase = this.value.paperkey || ''
        this.mnemonicPassphrase = this.value.mnemonicPassphrase || ''
        return
      }

      if (this.restore) {
        this.paperkey = Array(Constants.paperKeyLength).fill(undefined, 0, Constants.paperKeyLength)
        return
      }

      let mnemonic = this.isElectrumxCreate
        ? new Mnemonic(32 * 6, Mnemonic.Words.ENGLISH)
        : new Mnemonic(Mnemonic.Words.ENGLISH)

      while (!Mnemonic.isValid(mnemonic.toString())) {
        mnemonic = this.isElectrumxCreate
          ? new Mnemonic(32 * 6, Mnemonic.Words.ENGLISH)
          : new Mnemonic(Mnemonic.Words.ENGLISH)
      }

      this.paperkey = mnemonic.toString().split(' ')
    },

    normalizeSeedPhrase () {
      this.seedPhrase = this.normalizedSeedWords.join(' ')
    },

    shuffleWords (words) {
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]]
      }

      return words
    },

    confirmationHandler () {
      this.showInvalidPaperkeyError = false
      this.errorMessage = ''

      if (this.isElectrumxRestore) {
        this.normalizeSeedPhrase()

        if (![12, 18, 24].includes(this.normalizedSeedWords.length)) {
          this.errorMessage = 'Enter a valid 12, 18, or 24 word BIP39 recovery phrase.'
          this.showInvalidPaperkeyError = true
          return
        }

        if (!Mnemonic.isValid(this.seedPhrase)) {
          this.errorMessage = 'The recovery phrase is not a valid BIP39 mnemonic.'
          this.showInvalidPaperkeyError = true
          return
        }

        this.$emit('input', {
          ...this.value,
          paperkey: this.seedPhrase,
          mnemonicPassphrase: this.mnemonicPassphrase
        })
        this.$emit('next')
        return
      }

      if (!this.restore && !this.confirm) {
        this.confirm = true

        return
      }

      if (!this.restore && !this.paperkeyCheckupIsValid) {
        this.errorMessage = this.$i18n.t('createWallet.invalidPaperkeySelected')
        this.showInvalidPaperkeyError = true

        return
      }

      if (this.restore && (this.paperkey.includes(undefined) || this.paperkey.includes(''))) {
        this.errorMessage = this.$i18n.t('createWallet.invalidPaperkeySelected')
        this.showInvalidPaperkeyError = true

        return
      }

      this.$emit('input', {
        ...this.value,
        paperkey: this.paperkey.join(' ')
      })
      return this.$emit('next')
    },

    resetSelectedPaperkey () {
      this.selectedPaperkey = []
      this.showInvalidPaperkeyError = false
    }
  }
}
</script>

<style>
.create-flow-title {
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rv-text);
  text-shadow:
    0 0 10px rgba(124, 255, 242, 0.18),
    0 0 24px rgba(50, 239, 222, 0.24);
}

input.word-input {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--rv-text);
  font-family: monospace;
  font-weight: 600;
  font-size: 1rem;
  height: 100%;
  width: 100%;
  outline: none;
}

.word {
  flex-wrap: nowrap;
}

.word-input input:focus {
  border: none;
  box-shadow: none;
}

.expand-word {
  flex-grow: 1;
}

.word .tag {
  border: 1px solid var(--rv-border);
}

.word .tag.is-success,
.word-tag,
.selectable-word-tag {
  background: linear-gradient(180deg, rgba(16, 23, 53, 0.94), rgba(10, 16, 38, 0.9)) !important;
  color: var(--rv-text) !important;
  box-shadow: var(--rv-shadow-soft);
}

.word .tag.is-success {
  background: linear-gradient(135deg, rgba(255, 87, 210, 0.82), rgba(83, 243, 255, 0.72)) !important;
  color: var(--rv-text) !important;
}

.selectable-word-tag {
  border: 1px solid var(--rv-border);
}

@media (prefers-color-scheme: dark) {
  input.word-input,
  .word-tag,
  .selectable-word-tag {
    color: var(--rv-text) !important;
  }
}
</style>
