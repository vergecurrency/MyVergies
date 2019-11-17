<template>
  <div>
    <navigation-header :back="{ name: 'wallets', params: { walletName: wallet.name, wallet }}" title="Send"/>

    <div class="box">

      <div class="notification">
        <div class="content is-small">
          <p class="has-text-weight-semibold">
            Sending XVG is easy! Fill in the form with a recipient address and an amount and confirm the transaction.
          </p>
          <p class="is-small">
            Additionally you can fill the memo field which will only visible by you.<br/>
            You could use it for example like a reminder what the transaction was about.
          </p>
        </div>
      </div>

      <div class="hero">
        <div class="hero-body">

          <div class="field">
            <div class="field-label">
              <label class="label has-text-left">Recipient</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button">
                      <b-icon icon="address-book" size="is-small"/>
                    </a>
                  </p>
                  <p class="control is-expanded">
                    <input class="input" type="text" placeholder="Recipient XVG address" v-model="transaction.recipient">
                  </p>
                </div>
                <p class="help">Select a valid XVG address, either stealth or not.</p>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="field-label">
              <label class="label has-text-left">Amount</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <div class="field has-addons">
                  <p class="control">
                  <span class="select">
                    <select>
                      <option>XVG</option>
                      <option>$</option>
                      <option>£</option>
                      <option>€</option>
                    </select>
                  </span>
                  </p>
                  <p class="control is-expanded">
                    <input class="input" type="text" placeholder="Amount you want to send" v-model="transaction.amount">
                  </p>
                  <p class="control">
                    <a class="button">
                      Send Max
                    </a>
                  </p>
                </div>
                <p class="help">Fillin the amount you want to send, transaction fee will be calculated automatically.</p>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="field-label">
              <label class="label has-text-left">Internal Memo</label>
            </div>
            <div class="field-body">
              <div class="field is-expanded">
                <input class="input" type="text" placeholder="Gift to Swen" v-model="transaction.memo">
                <p class="help">An optional internal memo.</p>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column"></div>
            <div class="column is-narrow">
              <div class="buttons">
                <a class="button">Reset</a>
                <a class="button is-primary">Confirm</a>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import NavigationHeader from '@/components/layout/NavigationHeader'
export default {
  name: 'send-view',
  components: { NavigationHeader },
  data () {
    return {
      transaction: {
        recipient: '',
        amount: 0,
        memo: ''
      }
    }
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>
