<template>
  <div class="app-header">
    <i class="el-icon-back header-back" @click="$emit('escape')"/>
  </div>

  <div class="viewer-context">
    <ComicDisplayer
      :image-list="imageList"
      :mode="mode"
      @fullscreen="$emit('fullscreen')"
      @escape="$emit('escape')"/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ComicDisplayer from '@/view/viewer/ComicDisplayer'

const TAG = '[ComicContext]'

export default {
  name: 'ComicContext',
  components: {
    ComicDisplayer
  },
  props: {
    config: Object,
    mode: Object
  },
  emits: {
    changeImage: null,
    message: null,
    fullscreen: null,
    config: null,
    escape: null
  },
  data () {
    return {
      imageList: {
        dir: '',
        index: 0,
        images: []
      }
    }
  },
  mounted () {
    this.imageList = ipcRenderer.sendSync('comic')
    console.log(TAG + 'mounted:正在加载漫画模式列表\n' + JSON.stringify(this.imageList))
  },
  methods: {
    showMessage (msg) {
      this.$emit('message', msg)
    }
  }
}
</script>

<style scoped>
.viewer-context {
  position: absolute;
  width: 100%;
  height: 100%;
}

.app-header {
  position: fixed;
  width: 100%;
  height: 30px;
  -webkit-app-region: drag;
  z-index: 100;
}

.header-back {
  position: fixed;
  left: 0;
  background: white;
  border-radius: 0 0 10px 0;
  padding: 5px 20px;
  line-height: 30px;
  font-size: 30px;
  cursor: pointer;
  opacity: 0.7;
  -webkit-app-region: no-drag;
}

.header-back:hover {
  opacity: 1;
}
</style>
