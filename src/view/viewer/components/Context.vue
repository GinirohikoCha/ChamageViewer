<template>
  <Displayer
    :config="config"
    :image="image"
    :init-attr="attr"
    @init-image="initImg(image)"
    @open-image="openImg"
    @pre-image="preImg"
    @next-image="nextImg"
    @delete-image="deleteImg"
    @message="showMessage"/>
</template>

<script>
import { ipcRenderer } from 'electron'
import Displayer from '@/view/viewer/components/Displayer'

export default {
  name: 'Context',
  components: {
    Displayer
  },
  props: {
    config: Object
  },
  emits: {
    message: null
  },
  data () {
    return {
      image: {
        index: 0,
        total: 0,
        data: {
          url: '',
          type: 'jpg',
          originWidth: 0,
          originHeight: 0
        }
      },
      attr: {
        isLong: false,
        scale: 1,
        left: 0,
        top: 0
      }
    }
  },
  mounted () {
    this.initImg(ipcRenderer.sendSync('init-image'))
  },
  methods: {
    initImg (image) {
      if (image) {
        // 计算长宽比，初始化缩放图片
        const ratio = image.data.originWidth / image.data.originHeight
        const windowWidth = document.documentElement.clientWidth
        const windowHeight = document.documentElement.clientHeight

        let scale = 1
        let left = 0
        let top = 0
        let isLong = false
        if (ratio <= 0.4) {
          // 长图
          scale = (windowWidth * 0.6) / image.data.originWidth
          left = windowWidth * 0.2
          isLong = true
        } else {
          // 正常图片
          if (ratio >= windowWidth / windowHeight) {
            if (image.data.originWidth < windowWidth) {
              // 小图片不进行放大
              left = (windowWidth - image.data.originWidth) / 2
              top = (windowHeight - image.data.originHeight) / 2
            } else {
              // 大图片根据长边缩小
              scale = (windowWidth - 1) / image.data.originWidth
              top = (windowHeight - image.data.originHeight * scale) / 2
            }
          } else {
            if (image.data.originHeight < windowHeight) {
              // 小图片不进行放大
              left = (windowWidth - image.data.originWidth) / 2
              top = (windowHeight - image.data.originHeight) / 2
            } else {
              // 大图片根据宽边缩小
              scale = (windowHeight - 1) / image.data.originHeight
              left = (windowWidth - image.data.originWidth * scale) / 2
            }
          }
        }
        this.attr = {
          isLong: isLong,
          scale: scale,
          left: left,
          top: top
        }
        this.image = image
      } else {
        this.image = null
      }
    },
    openImg () {
      this.initImg(ipcRenderer.sendSync('open-image'))
    },
    preImg () {
      this.initImg(ipcRenderer.sendSync('pre-image'))
    },
    nextImg () {
      this.initImg(ipcRenderer.sendSync('next-image'))
    },
    deleteImg () {
      this.initImg(ipcRenderer.sendSync('delete-image'))
      this.$notify({
        title: '删除成功!',
        duration: 2000
      })
    },
    showMessage (msg) {
      this.$emit('message', msg)
    }
  }
}
</script>

<style scoped>

</style>
