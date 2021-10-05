<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  overflow: hidden;
}

*{
  user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
}
</style>
