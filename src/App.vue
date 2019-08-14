<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/empty'
import MainLayout from '@/layouts/main'

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout'
    }
  },
  components: {
    EmptyLayout,
    MainLayout
  }
}
</script>


<style>
@import '~materialize-css/dist/css/materialize.min.css';
@import 'assets/index.css';
</style>
