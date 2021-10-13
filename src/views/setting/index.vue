<template>
  <div class="setting-wrapper">
    <el-row :gutter="20">
      <el-col :span="6">
        <SettingCard
          :title="'文件夹穿透'"
          :status="config.function.penetrate"
          @change="function (v) {
            config.function.penetrate = v
            saveChange()
          }"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import SettingCard from '@/views/setting/components/SettingCard'

export default {
  name: 'index',
  components: {
    SettingCard
  },
  data () {
    return {
      config: {
        common: {
          interface: {
            enableChangePageBtn: true,
            enableScaleInfo: true,
            enableBottomToolBar: true
          }
        },
        function: {
          penetrate: true
        }
      }
    }
  },
  mounted () {
    this.config = ipcRenderer.sendSync('setting', { event: 'load' })
  },
  methods: {
    saveChange () {
      ipcRenderer.send('setting', { event: 'save', config: JSON.stringify(this.config) })
    }
  }
}
</script>

<style scoped>
.setting-wrapper {
  width: 100%;
  padding: 20px;
}
</style>
