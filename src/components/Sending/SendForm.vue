<template>
  <section class="section">

    <div class="field">
      <div class="field-label">
        <label class="label has-text-left" v-html="$i18n.t('send.recipient')"/>
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
          <p class="help" v-html="$i18n.t('send.recipientDetails')"/>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="field-label">
        <label class="label has-text-left" v-html="$i18n.t('send.amount')"/>
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
              <input class="input" type="text" placeholder="Amount you want to send" v-model="value.amount">
            </p>
            <p class="control">
              <a class="button" v-html="$i18n.t('send.sendMax')"/>
            </p>
          </div>
          <p class="help" v-html="$i18n.t('send.amountDetails')"/>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="field-label">
        <label class="label has-text-left" v-html="$i18n.t('send.internalMemo')"/>
      </div>
      <div class="field-body">
        <div class="field is-expanded">
          <input class="input" type="text" placeholder="Gift to Swen" v-model="value.memo">
          <p class="help" v-html="$i18n.t('send.internalMemoDetails')"/>
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

  </section>
</template>

<script>
export default {
  name: 'SendForm',
  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>
