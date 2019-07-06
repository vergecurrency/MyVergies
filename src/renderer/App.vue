<template>
  <div id="app" class="app-container">
    <NavBar/>
    <div class="columns is-gapless fill-height small-margin-bottom">
      <SideMenu class="column is-one-quarter"/>
      <ContentContainer style="height: 100%;">
        <RouterView/>
      </ContentContainer>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
  import NavBar from './components/layout/NavBar'
  import SideMenu from './components/layout/SideMenu'
  import AppFooter from './components/layout/AppFooter'
  import ContentContainer from './components/layout/ContentContainer'

  export default {
    name: 'when-wallet',
    components: {ContentContainer, AppFooter, SideMenu, NavBar}
  }
</script>

<style lang="scss">
  @import '~@/assets/scss/overrides';

  .app-container {
    height: 100%;
    /*background-color: #f8f7f7;*/
    background: linear-gradient(145deg, rgb(255, 255, 255) 0%, rgb(248, 247, 247) 100%);
  }

  .fill-height {
    height: calc(100% - 100px);
  }
  .small-margin-bottom {
    margin-bottom: calc(1.5rem - 0.75rem)!important;
  }
</style>
