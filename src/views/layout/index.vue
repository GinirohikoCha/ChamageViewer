<template>
  <el-empty v-if="empty" description="请选择图片" class="empty">
    <el-button type="primary" @click="onOpen">打开图片</el-button>
  </el-empty>

  <div class="app-wrapper">
    <app-main />
  </div>

  <bottom-bar
    @pre="emitEvent({event: 'pre'})"
    @next="emitEvent({event: 'next'})"
    @scale="emitEvent({event: 'scale'})"
    @scaleUp="emitEvent({event: 'scaleUp'})"
    @scaleDown="emitEvent({event: 'scaleDown'})"
    @rotateL="emitEvent({event: 'rotateL'})"
    @rotateR="emitEvent({event: 'rotateR'})"
    @delete="onDelete"/>

  <Header :title="title" :title-sub="titleSub"/>
</template>

<script>
import { AppMain, BottomBar, Header } from './components'
import { ipcRenderer } from 'electron'

export default {
  name: 'Layout',
  components: {
    BottomBar,
    AppMain,
    Header
  },
  data () {
    return {
      empty: true,
      title: '',
      titleSub: ''
    }
  },
  mounted () {
    ipcRenderer.on('layout', (e, msg) => {
      switch (msg.event) {
        case 'loaded':
          this.empty = false
          this.title = msg.data.name
          this.titleSub = msg.data.width + '×' + msg.data.height
          break
        case 'unloaded':
          this.empty = true
          this.title = ''
          this.titleSub = ''
          break
      }
    })
  },
  methods: {
    emitEvent (message) {
      ipcRenderer.send('layout', message)
    },
    onOpen () {
      this.emitEvent({ event: 'open' })
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
.empty {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  z-index: 1;
}
</style>
