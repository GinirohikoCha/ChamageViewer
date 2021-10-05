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
    @rotateR="emitEvent({'event': 'rotateR'})"/>
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
    }
  }
}
</script>

<style scoped>
</style>
