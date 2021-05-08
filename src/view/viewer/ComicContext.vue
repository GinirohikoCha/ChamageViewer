<template>
  <div class="viewer-context">
    <ComicDisplayer
      :image-list="imageList"
      :mode="mode"
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
</style>
