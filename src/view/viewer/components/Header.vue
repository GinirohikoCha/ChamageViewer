<template>
  <div class="app-header">
    <i class="el-icon-picture-outline-round app-header-icon"></i>
    <div class="app-header-title">
      {{ title }}
    </div>

    <div class="app-header-button-group">
      <i class="el-icon-cha-minimize app-header-button" @click="minimize"/>
      <i :class="maximized?'el-icon-cha-restore':'el-icon-cha-maximize'" class="app-header-button" @click="maximize" />
      <i class="el-icon-cha-close app-header-button app-header-close" @click="close"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Header',
  props: {
    title: String
  },
  data () {
    return {
      maximized: false
    }
  },
  methods: {
    minimize () {
      ipcRenderer.send('minimize-window')
    },
    maximize () {
      this.maximized = !this.maximized
      ipcRenderer.send('maximize-window')
    },
    close () {
      ipcRenderer.send('close-window')
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  width: 100%;
  height: 30px;
  -webkit-app-region: drag;
}

.app-header-icon {
  float: left;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: black;
}

.app-header-title {
  float: left;
  width: auto;
  line-height: 30px;
  font-size: 12px;
  font-family: 微软雅黑, serif;
  color: black;
}

.app-header-button-group {
  float: right;
  height: 30px;
  -webkit-app-region: no-drag;
}

.app-header-button-group .app-header-button {
  width: 46px;
  line-height: 30px;
  text-align: center;
  color: black;
}

.app-header-button:hover {
  background: whitesmoke;
}

.app-header-close:hover {
  background: red;
  color: white;
}
</style>
