<template>
  <div class="transaction-container">
    <div class="transaction-icon">
      <img src="~@/assets/icons/received.svg"/>
    </div>
    <div class="transaction-content">
      <div class="transaction-label">
        Received
      </div>
      <div class="transaction-timestamp">
        Jun 15, 2019 at 2:09 PM
      </div>
    </div>
    <div class="transaction-amount">
      + 5.454,2354 XVG
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Transaction'
  }
</script>

<style scoped>
  .transaction-container {
    display: flex;
    padding: 1em;
    border-bottom: 1px solid #e8e8e8;
    align-items: center;
    background-color: white;
    transition: background-color 0.5s ease;
    cursor: pointer;
  }

  .transaction-container:hover {
    background-color: #f6f6f6;
  }

  .transaction-icon > img {
    /*background-color: green;*/
    /*border-radius: 50%;*/
    width: 15px;
    height: 15px;
  }

  .transaction-content {
    margin: 0 1em;
    flex-grow: 1;
  }

  .transaction-label {
    font-weight: 600;
    color: #9f9f9f;
  }

  .transaction-timestamp {
    font-size: 0.75em;
    font-weight: 500;
    color: grey;
  }

  .transaction-amount {
    font-weight: 500;
    color: #008570;
  }
</style>
