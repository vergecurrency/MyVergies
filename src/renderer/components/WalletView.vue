<template>
  <div>
    <div class="box">
      <div class="columns">
        <div class="column">
          <p class="is-uppercase is-size-5 has-text-weight-semibold">Main Account</p>
          <p class="is-size-3 has-text-weight-bold">1.434.534,53 XVG</p>
          <p class="is-size-6">€ 10.323,43</p>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <div class="columns">
              <div class="column">
                <div class="buttons is-right">
                  <a class="button is-light is-rounded">
                    <span class="icon has-text-grey-dark">
                      <FaIcon icon="edit" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <a class="button is-primary">
                  <span class="icon">
                      <FaIcon icon="credit-card" />
                  </span>
                  <span>
                    Send
                  </span>
                </a>
                <a class="button is-primary">
                  <span class="icon">
                      <FaIcon icon="hand-holding-usd" />
                  </span>
                  <span>
                    Receive
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box is-paddingless is-clipped">
      <TransactionRow
        v-for="transaction in transactions"
        :key="transaction.txid"
        transaction="transaction"
      />
    </div>
  </div>
</template>

<script>
  import TransactionRow from './TransactionRow'

  export default {
    name: 'WalletView',
    components: {TransactionRow},
    data () {
      return {
        transactions: [
          {
            txid: 123455324,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 43554546565,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 12345576,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435545465345,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 123456455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435575645465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 12344555,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 43554645465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 123475655,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435545234465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 1232342455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 43552345465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 123455435,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435546455465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 12323455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435523445465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 123453534454455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 46565435545465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 645123455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 446535545465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 12345465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435545645465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 123453455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 32423543534,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
