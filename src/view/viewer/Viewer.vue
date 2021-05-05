<template>
  <Context
    :config="config"
    @message="showMessage" />
</template>

<script>
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import Context from '@/view/viewer/components/Context'

export default {
  name: 'Viewer',
  components: {
    Context
  },
  data () {
    return {
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
            enable: true,
            mode: 0 // 0:缩放-1:翻页
          }
        }
      },
      // 消息提示框
      message: null
    }
  },
  mounted () {
    const that = this
    ipcRenderer.on('config-loaded', function (event, arg) {
      that.config = arg
      console.log('读取配置文件成功')
    })
    ipcRenderer.send('load-config')
    // alert(ipcRenderer.sendSync('test'))
  },
  methods: {
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
