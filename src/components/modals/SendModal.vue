<template>
  <div class="modal-card has-shadow-dark">

    <header class="modal-card-head">
      <p class="modal-card-title has-text-weight-bold">Send</p>
      <button class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body">

      <div class="field">
        <div class="field-label">
          <label class="label has-text-left">Recipient</label>
        </div>
        <div class="field-body">
          <div class="field is-expanded">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <FaIcon icon="cog"/>
                </a>
              </p>
              <p class="control has-icons-left is-expanded">
                <input class="input" type="text" placeholder="Recipient XVG address">
                <span class="icon is-small is-left">
                    <FaIcon icon="cog" />
                  </span>
              </p>
            </div>
            <p class="help">Do not enter the first zero</p>
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
                <a class="button is-static">
                  <FaIcon icon="cog"/>
                </a>
              </p>
              <p class="control has-icons-left is-expanded">
                <input class="input" type="text" placeholder="Amount you want to send">
                <span class="icon is-small is-left">
                    <FaIcon icon="cog" />
                  </span>
              </p>
            </div>
            <p class="help">Do not enter the first zero</p>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="field-label">
          <label class="label has-text-left">Internal Memo (optional)</label>
        </div>
        <div class="field-body">
          <div class="field is-expanded">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <FaIcon icon="cog"/>
                </a>
              </p>
              <p class="control has-icons-left is-expanded">
                <input class="input" type="text" placeholder="Gift to Swen">
                <span class="icon is-small is-left">
                    <FaIcon icon="cog" />
                  </span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>

    <footer class="modal-card-foot">
      <button class="button">Cancel</button>
      <button class="button is-primary">Confirm</button>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'send-modal',
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
