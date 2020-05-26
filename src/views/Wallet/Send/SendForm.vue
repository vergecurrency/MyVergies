<template>
  <div>

    <div class="block">
      <h3 class="is-size-3 is-family-handwritten" v-html="$i18n.t('send.send')"/>
      <p v-html="$i18n.t('send.formDescription')"/>
    </div>

    <div class="columns">
      <div class="column">

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label has-text-left has-text-grey" v-html="$i18n.t('send.recipient')"/>
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
                  <input class="input" type="text" placeholder="Recipient XVG address" v-model="value.recipient">
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
                  <input class="input" type="text" placeholder="Amount you want to send" v-model="value.amount">
                </p>
                <p class="control">
                  <a class="button" v-html="$i18n.t('send.sendMax')"/>
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
              <input class="input" type="text" placeholder="Gift to Swen" v-model="value.memo">
              <div v-if="showHelp" class="help notification" v-html="$i18n.t('send.internalMemoDetails')"/>
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
          <a class="button is-light" v-html="$i18n.t('send.reset')"/>
          <a class="button is-primary" @click="$emit('input', value)" v-html="$i18n.t('send.confirm')"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SendForm',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showHelp: false,
      showMemo: false
    }
  }
}
</script>
