<template>
  <div>
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
              <input class="input" type="text" placeholder="Recipient XVG address" v-model="value.recipient">
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
              <input class="input" type="text" placeholder="Amount you want to send" v-model="value.amount">
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
          <input class="input" type="text" placeholder="Gift to Swen" v-model="value.memo">
          <p class="help">An optional internal memo.</p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column"></div>
      <div class="column is-narrow">
        <div class="buttons">
          <a class="button">Reset</a>
          <a class="button is-primary" @click="$emit('input', value)">Confirm</a>
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
  }
}
</script>
