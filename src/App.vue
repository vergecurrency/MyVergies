<template>
  <div id="app" class="app-container is-unselectable">
    <NavBar/>
    <div class="columns is-gapless fill-height is-marginless">
      <SideMenu class="column is-one-quarter"/>
      <ContentContainer style="height: 100%;">
        <RouterView/>
      </ContentContainer>
    </div>
  </div>
</template>

<script>
import NavBar from './components/layout/NavBar'
import SideMenu from './components/layout/SideMenu'
import ContentContainer from './components/layout/ContentContainer'

export default {
  name: 'my-vergies',
  components: { ContentContainer, SideMenu, NavBar }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/overrides';

  .app-container {
    height: 100%;
    background: #ebebeb;
    cursor: default;
  }

  .fill-height {
    height: calc(100% - 52px);
  }

  @media (prefers-color-scheme: dark) {
    .app-container {
      color: white;
      background: #1f2123;
    }
  }
</style>
