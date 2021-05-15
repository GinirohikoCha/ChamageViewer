<template>
  <Context
    v-show="!mode.comic"
    :config="config"
    :mode="mode"
    @message="showMessage"
    @change-image="setTitle"
    @fullscreen="toggleFullScreen"
    @config="openConfig"
    @comic="toggleComic"/>
  <ComicContext
    v-if="mode.comic"
    :config="config"
    :mode="mode"
    @message="showMessage"
    @change-image="setTitle"
    @fullscreen="toggleFullScreen"
    @config="openConfig"
    @escape="toggleComic"/>

  <Header
    v-if="!mode.comic"
    :title="title"
    :mode="mode" />
</template>

<script>
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import Header from '@/view/viewer/components/Header'
import Context from '@/view/viewer/Context'
import ComicContext from '@/view/viewer/ComicContext'

export default {
  name: 'Viewer',
  components: {
    ComicContext,
    Header,
    Context
  },
  data () {
    return {
      title: 'ChamageViewer',
      // 默认设置
      config: {
        version: '0.0.0',
        common: {
          interface: {
            enableChangePageBtn: true,
            enableScaleInfo: true,
            enableBottomToolBar: true
          }
        },
        habit: {
          scroll: {
            mode: 0 // 0-翻页:1-缩放
          }
        }
      },
      // 模式状态
      mode: {
        fullscreen: false,
        comic: false
      },
      // 消息提示框
      message: null
    }
  },
  mounted () {
    const that = this
    ipcRenderer.on('config-loaded', function (event, config) {
      that.config = config
      console.log('读取配置文件成功')
    })
    ipcRenderer.send('load-config')
    // alert(ipcRenderer.sendSync('test'))
  },
  methods: {
    setTitle (image) {
      if (image) {
        this.title = image.name + ' - ' + image.data.width + '×' + image.data.height
      } else {
        this.title = 'ChamageViewer'
      }
    },
    toggleFullScreen () {
      this.mode.fullscreen = !this.mode.fullscreen
      ipcRenderer.send('fullscreen-window', this.mode.fullscreen, null)
    },
    toggleComic () {
      this.mode.comic = !this.mode.comic
    },
    openConfig () {
      ipcRenderer.send('open-config')
    },
    showMessage (msg) {
      if (this.message != null) {
        this.message.close()
      }
      this.message = ElMessage({
        message: msg,
        center: true,
        duration: 1500,
        offset: 1
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
