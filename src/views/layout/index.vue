<template>
  <div class="app-wrapper">
    <app-main />
  </div>

  <bottom-bar
    @pre="emitEvent({'event': 'pre'})"
    @next="emitEvent({'event': 'next'})"
    @scale="emitEvent({'event': 'scale'})"
    @scaleUp="emitEvent({'event': 'scaleUp'})"
    @scaleDown="emitEvent({'event': 'scaleDown'})"
    @rotateL="emitEvent({'event': 'rotateL'})"
    @rotateR="emitEvent({'event': 'rotateR'})"
    @delete="onDelete"/>
</template>

<script>
import { AppMain, BottomBar } from './components'
import { ipcRenderer } from 'electron'

export default {
  name: 'Layout',
  components: {
    BottomBar,
    AppMain
  },
  methods: {
    emitEvent (message) {
      ipcRenderer.send('viewer', message)
    },
    onDelete () {
      this.$confirm('此操作将永久删除该图片, 是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.emitEvent({ event: 'delete' })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
</style>
