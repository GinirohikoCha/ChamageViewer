<template>
  <div>
    <el-empty description="请选择图片" v-show="!curImage" class="empty">
      <el-button type="primary" v-on:click="openImg">打开图片</el-button>
    </el-empty>

    <div v-show="curImage" class="viewer-context">
      <Displayer
        :config="config"
        :image="image"
        :mode="mode"
        @resize="refreshCurImage"
        @pre-image="changeImage(-1)"
        @nxt-image="changeImage(1)"
        @delete-image="deleteImage"
        @fullscreen="$emit('fullscreen')"
        @comic="$emit('comic')"
        @config="$emit('config')"
        @message="showMessage"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Displayer from '@/view/viewer/Displayer'

const TAG = '[Context]'

export default {
  name: 'Context',
  components: {
    Displayer
  },
  props: {
    config: Object,
    mode: Object
  },
  emits: {
    changeImage: null,
    message: null,
    fullscreen: null,
    comic: null,
    config: null
  },
  data () {
    return {
      image: null,
      imageList: {
        dir: '',
        index: 0,
        images: []
      }
    }
  },
  computed: {
    total: function () {
      return this.imageList.images.length
    },
    // 当前图片
    curImage: function () {
      return this.total === 0 ? null : this.imageList.images[this.imageList.index]
    }
  },
  mounted () {
    this.imageList = ipcRenderer.sendSync('init-image')
    console.log(TAG + 'mounted:')
    console.log(this.imageList)
    this.refreshCurImage()
  },
  methods: {
    openImg () {
      this.imageList = ipcRenderer.sendSync('open-image')
      this.refreshCurImage()
    },
    initImg (image) {
      console.log(TAG + 'initImg:开始初始化图片')
      if (image) {
        // 计算长宽比，初始化缩放图片
        const ratio = image.data.width / image.data.height
        const windowWidth = document.documentElement.clientWidth
        const windowHeight = document.documentElement.clientHeight

        let scale = 1
        let left = 0
        let top = 0
        if (image.attr.long) { // 长图
          scale = (windowWidth * 0.6) / image.data.width
          left = windowWidth * 0.2
        } else { // 正常图片
          if (ratio >= windowWidth / windowHeight) {
            if (image.data.width < windowWidth) {
              // 小图片不进行放大
              left = (windowWidth - image.data.width) / 2
              top = (windowHeight - image.data.height) / 2
            } else {
              // 大图片根据长边缩小
              scale = (windowWidth - 1) / image.data.width
              top = (windowHeight - image.data.height * scale) / 2
            }
          } else {
            if (image.data.height < windowHeight) {
              // 小图片不进行放大
              left = (windowWidth - image.data.width) / 2
              top = (windowHeight - image.data.height) / 2
            } else {
              // 大图片根据宽边缩小
              scale = (windowHeight - 1) / image.data.height
              left = (windowWidth - image.data.width * scale) / 2
            }
          }
        }
        image.attr.initScale = scale
        image.attr.initLeft = left
        image.attr.initTop = top
        console.log(TAG + 'initImg:初始化完毕\n' + JSON.stringify(image))
        return JSON.parse(JSON.stringify(image))
      } else {
        return null
      }
    },
    changeImage (step) {
      this.imageList.index += step
      if (this.imageList.index < 0) {
        this.showMessage('正在浏览最后一张图片')
        this.imageList.index = this.total - 1
      } else if (this.imageList.index >= this.total) {
        this.showMessage('正在浏览第一张图片')
        this.imageList.index = 0
      }
      // 是否已经加载
      if (this.curImage.name) {
        this.refreshCurImage()
      } else {
        const url = this.imageList.dir + this.curImage
        this.imageList.images[this.imageList.index] = ipcRenderer.sendSync('load-image', url, this.curImage, this.imageList.index)
        this.refreshCurImage()
      }
      ipcRenderer.send('change-image', this.imageList.index)
    },
    deleteImage () {
      this.imageList = ipcRenderer.sendSync('delete-image')
      this.refreshCurImage()
    },
    refreshCurImage () {
      this.image = this.initImg(this.curImage)
      this.$emit('changeImage', this.image)
    },
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
