<template>
  <section class="app-main">
    <router-view :key="key" />
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>

</style>
