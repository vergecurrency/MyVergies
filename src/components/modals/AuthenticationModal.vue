<template>
  <div class="modal-card is-modal-auth">
    <div class="modal-content">
      <div class="columns has-text-centered">
        <div class="column">
          <b-icon icon="id-card" custom-size="6x"/>
          <h1 class="is-size-1 has-text-grey is-family-handwritten" v-html="$i18n.t('unlock.unlockYourWallet')"/>
        </div>
      </div>
      <div class="box">
        <div class="field">
          <div class="field-body">
            <div class="field is-expanded">
              <div class="field has-addons">
                <p class="control is-expanded has-icons-left">
                  <input
                    class="input is-large"
                    type="password"
                    :placeholder="$i18n.t('unlock.password')"
                    @keyup.enter="$parent.close()"
                  >
                  <span class="icon is-medium is-left">
                    <b-icon icon="lock" size="is-small"/>
                  </span>
                </p>
                <p class="control">
                  <a class="button is-large" @click="$parent.close()">
                    <b-icon icon="angle-right" size="is-small"/>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <p class="control">
            <a class="button is-text" v-html="$i18n.t('unlock.forgotPassword')"/>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authentication-modal'
}
</script>

<style>
  .is-modal-auth > .modal-content {
    overflow: visible;
    max-width: 600px;
  }

  .modal.is-full-screen > .animation-content > .modal-card.is-modal-auth {
    display: flex;
    justify-content: center;
    width: auto;
  }

  @media (prefers-color-scheme: dark) {
    .modal.is-full-screen > .animation-content > .modal-card.is-modal-auth {
      background-color: #2c2e30;
    }

    .is-modal-auth .box {
      background: #262729;
    }
  }
</style>
