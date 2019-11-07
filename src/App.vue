<template>
  <div id="app" class="app-container is-unselectable">
    <NavBar/>
    <div class="columns is-gapless app-content-container is-marginless">
      <MainMenu class="column is-one-quarter"/>
      <ContentContainer>
        <RouterView/>
      </ContentContainer>
    </div>
  </div>
</template>

<script>
import NavBar from './components/layout/NavBar'
import MainMenu from './components/layout/MainMenu'
import ContentContainer from './components/layout/ContentContainer'

export default {
  name: 'my-vergies',
  components: { ContentContainer, MainMenu, NavBar }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/overrides';

  .app-container {
    height: 100%;
    background: #ebebeb;
    cursor: default;
  }

  .app-content-container {
    height: calc(100% - 52px);
  }

  @media (prefers-color-scheme: dark) {
    .app-container {
      color: white;
      background: #1f2123;
    }
  }
</style>
