<template>
  <form @submit.prevent="confirm">

    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('send.send')"/>
      <p v-html="$i18n.t('send.formDescription')"/>
    </div>

    <div class="columns">
      <div class="column">

        <div class="box">
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label has-text-left has-text-grey" v-html="$i18n.t('send.recipient')"/>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
<!--                  <p class="control">-->
<!--                    <a class="button">-->
<!--                      <b-icon icon="address-book" size="is-small"/>-->
<!--                    </a>-->
<!--                  </p>-->
                  <p class="control is-expanded">
                    <input class="input" type="text" placeholder="Recipient XVG address" v-model="toAddress">
                  </p>
                </div>
                <div v-if="showHelp" class="help notification is-small" v-html="$i18n.t('send.recipientDetails')"/>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label has-text-left has-text-grey" v-html="$i18n.t('send.amount')"/>
            </div>
            <div class="field-body">
              <div class="field is-expanded ">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-static">
                      XVG
                    </a>
<!--                    <span class="select">-->
<!--                      <select>-->
<!--                        <option>XVG</option>-->
<!--                        <option>$</option>-->
<!--                        <option>£</option>-->
<!--                        <option>€</option>-->
<!--                      </select>-->
<!--                    </span>-->
                  </p>
                  <p class="control is-expanded">
                    <input class="input" type="text" placeholder="Amount you want to send" v-model="amount">
                  </p>
                  <p class="control">
                    <b-button :label="$i18n.t('send.sendMax')" @click="sendMax" :loading="loadingMax"/>
                  </p>
                </div>
                <div v-if="showHelp" class="help notification" v-html="$i18n.t('send.amountDetails')"/>
              </div>
            </div>
          </div>

          <div v-if="showMemo" class="field is-horizontal">
            <div class="field-label">
              <label class="label has-text-left has-text-grey" v-html="$i18n.t('send.internalMemo')"/>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <input class="input" type="text" placeholder="Gift to Swen" v-model="message">
                <div v-if="showHelp" class="help notification" v-html="$i18n.t('send.internalMemoDetails')"/>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="notification">
          <small class="has-text-grey" v-html="$i18n.t('send.transactionWarning')"/>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="buttons is-centered">
          <a class="button is-light" v-html="$i18n.t('send.reset')" @click="reset"/>
          <button type="submit" class="button is-primary" v-html="$i18n.t('send.confirm')"/>
        </div>
      </div>
    </div>

  </form>
</template>

<script>
import constants from '@/utils/constants'

export default {
  name: 'SendForm',
  props: {
    value: {
      type: Object,
      required: true
    },
    wallet: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showHelp: false,
      showMemo: false,
      loadingMax: false,
      toAddress: '',
      amount: '',
      message: ''
    }
  },
  created () {
    this.toAddress = this.value.toAddress
    this.amount = this.value.amount
    this.message = this.value.message
  },
  methods: {
    sendMax () {
      this.loadingMax = true

      this.wallet.getSendMaxInfo().then(info => {
        this.amount = info.amount / constants.satoshiDivider
        this.loadingMax = false
      })
    },

    confirm () {
      this.$emit('input', {
        ...this.value,
        toAddress: this.toAddress,
        amount: this.amount,
        message: this.message
      })
    },

    reset () {
      this.toAddress = ''
      this.amount = 0
      this.message = ''
    }
  }
}
</script>
