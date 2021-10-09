<template>
  <div v-if="!fullscreen" class="app-header">
    <i class="el-icon-picture-outline-round app-header-icon"></i>
    <div class="app-header-title">
      {{ displayTitle }}
    </div>

    <div class="app-header-button-group">
      <i class="el-icon-cha-minimize app-header-button" @click="minimize"/>
      <i :class="maximized?'el-icon-cha-restore':'el-icon-cha-maximize'" class="app-header-button" @click="maximize" />
      <i class="el-icon-cha-close app-header-button app-header-close" @click="close"/>
    </div>
  </div>

  <div v-if="fullscreen" class="app-header-dark">
    <div class="app-header-button-group">
      <i class="el-icon-cha-close app-header-button app-header-close" @click="close"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Header',
  props: {
    fullscreen: Boolean,
    title: String,
    titleSub: String
  },
  data () {
    return {
      maximized: false
    }
  },
  computed: {
    displayTitle: function () {
      if (this.title === '') {
        return '未选择图片'
      } else if (this.title.length <= 50) {
        return this.title + ' - ' + this.titleSub
      } else {
        return this.title.substring(0, 50) + '... - ' + this.titleSub
      }
    }
  },
  methods: {
    minimize () {
      ipcRenderer.send('window', { event: 'minimize' })
    },
    maximize () {
      ipcRenderer.send('window', { event: 'maximize', data: this.maximized })
      this.maximized = !this.maximized
    },
    close () {
      ipcRenderer.send('window', { event: 'close', data: this.maximized })
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  width: 100%;
  height: 30px;
  background: white;
  -webkit-app-region: drag;
}

.app-header .app-header-icon {
  position: absolute;
  left: 0;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: black;
  z-index: 10;
}

.app-header .app-header-title {
  position: absolute;
  left: 30px;
  width: auto;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  font-family: 微软雅黑, serif;
  color: black;
  white-space: nowrap;
  z-index: 10;
}

.app-header .app-header-button-group {
  position: absolute;
  right: 0;
  height: 30px;
  -webkit-app-region: no-drag;
  white-space: nowrap;
  z-index: 100;
}

.app-header .app-header-button-group .app-header-button {
  width: 46px;
  line-height: 30px;
  text-align: center;
  color: black;
}

.app-header .app-header-button:hover {
  background: lightgray;
}

.app-header .app-header-close:hover {
  background: red;
  color: white;
}

.app-header-dark {
  position: fixed;
  width: 100%;
  height: 40px;
}

.app-header-dark .app-header-icon {
  float: left;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
}

.app-header-dark .app-header-title {
  float: left;
  width: auto;
  line-height: 40px;
  font-size: 12px;
  font-family: 微软雅黑, serif;
  color: white;
}

.app-header-dark .app-header-button-group {
  position: absolute;
  right: 0;
  height: 30px;
  -webkit-app-region: no-drag;
  white-space: nowrap;
  z-index: 100;
}

.app-header-dark .app-header-close{
  position: fixed;
  right: 0;
  line-height: 40px;
  text-align: center;
  font-size: 40px;
  color: white;
}

.app-header-dark .app-header-close:hover{
  color: black;
  background: white;
}
</style>
