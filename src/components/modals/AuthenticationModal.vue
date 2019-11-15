<template>
  <div class="modal-card is-modal-auth">
    <div class="modal-content">
      <div class="box">

        <h4 class="title is-4">Unlock your wallet</h4>

        <div class="field">
          <div class="field-body">
            <div class="field is-expanded">
              <div class="field has-addons">
                <p class="control is-expanded has-icons-left">
                  <input class="input is-large" type="password" placeholder="Password" @keyup.enter="$parent.close()">
                  <span class="icon is-medium is-left">
                    <fa-icon icon="lock"/>
                  </span>
                </p>
                <p class="control">
                  <a class="button is-large" @click="$parent.close()">
                    <fa-icon icon="angle-right"/>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <p class="control">
            <a class="button is-text">I forgot my unlock password</a>
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
  }
</style>
