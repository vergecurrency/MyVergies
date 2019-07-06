<template>
  <div>
    <Transaction
      v-for="transaction in transactions"
      :key="transaction.txid"
      transaction="transaction"
    />
  </div>
</template>

<script>
  import Transaction from './Transaction'
  export default {
    name: 'Transactions',
    components: {Transaction},
    data () {
      return {
        transactions: [
          {
            txid: 123455,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          },
          {
            txid: 435545465,
            address: 'Dahkshh2h2eh9h4983h9dhd983h98h433',
            amount: 23443.443455
          }
        ]
      }
    }
  }
</script>
