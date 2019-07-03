<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-narrow">
          <div class="card" style="width: 300px;">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">Main wallet</p>
                  <p class="title is-primary is-5">343.554,554 XVG</p>
                  <p class="subtitle is-6">€ 2.332,44</p>
                </div>
              </div>
            </div>

            <footer class="card-footer">
              <a href="#" class="card-footer-item">Transactions</a>
              <a href="#" class="card-footer-item">Send</a>
              <a href="#" class="card-footer-item">Receive</a>
            </footer>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="card" style="width: 300px;">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content has-text-centered">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">Savings</p>
                  <p class="title is-primary is-5">1.343.554,554 XVG</p>
                  <p class="subtitle is-6">€ 142.332,44</p>
                </div>
              </div>
            </div>

            <footer class="card-footer">
              <a href="#" class="card-footer-item">Transactions</a>
              <a href="#" class="card-footer-item">Send</a>
              <a href="#" class="card-footer-item">Receive</a>
            </footer>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content has-text-centered">
              <p class="title is-4">Add wallet</p>
              <p class="subtitle">Add an extra wallet... Don't worry it's free!</p>
              <button class="button is-primary">Add Wallet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'landing-page'
  }
</script>

<style>

</style>
