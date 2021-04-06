<template>
  <Viewer/>
</template>

<script>
import Viewer from './view/Viewer.vue'

export default {
  name: 'App',
  components: {
    Viewer
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

*{
  user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
 }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
