<template>
  <content-view title="Verginals">
    <template slot="section">
      <section class="section verginals-section">
        <div class="verginals-panel">
          <h3 class="is-size-4 is-family-display verginals-title">Verginals</h3>
          <p class="verginals-copy">Collections support is coming here.</p>
        </div>
      </section>
    </template>
  </content-view>
</template>

<script>
import ContentView from '@/components/layout/ContentView'

export default {
  name: 'VerginalsView',
  components: { ContentView }
}
</script>

<style scoped>
.verginals-section {
  padding: 0;
}

.verginals-panel {
  padding: 1.25rem;
  border: 1px solid rgba(83, 243, 255, 0.16);
  border-radius: 18px;
  background:
    linear-gradient(140deg, rgba(255, 87, 210, 0.14), transparent 48%),
    linear-gradient(180deg, rgba(9, 14, 32, 0.94), rgba(7, 10, 24, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 36px rgba(1, 4, 18, 0.18);
}

.verginals-title {
  margin-bottom: 0.75rem;
  color: var(--rv-text);
}

.verginals-copy {
  color: var(--rv-text-soft);
}
</style>
