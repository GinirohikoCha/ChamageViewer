<template>
  <el-tabs :tab-position="'left'" style="height: 400px;">
    <el-tab-pane label="常规设置"><Common :common="config.common" @update="updateCommon"/></el-tab-pane>
    <el-tab-pane label="习惯设置"><Habit :habit="config.habit" @update="updateHabit"/></el-tab-pane>
  </el-tabs>
</template>

<script>
import { ipcRenderer } from 'electron'
import Habit from '@/view/config/components/Habit'
import Common from '@/view/config/components/Common'

export default {
  name: 'Config',
  components: {
    Habit,
    Common
  },
  data () {
    return {
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
            mode: 0 // 0:缩放-1:翻页-2:长图浏览
          }
        }
      }
    }
  },
  mounted () {
    // console.log(ipcRenderer.sendSync('get-config'))
    this.config = ipcRenderer.sendSync('get-config')
  },
  methods: {
    updateHabit (habit) {
      this.config.habit = habit
      ipcRenderer.send('update-config', JSON.parse(JSON.stringify(this.config)))
    },
    updateCommon (common) {
      this.config.common = common
      ipcRenderer.send('update-config', JSON.parse(JSON.stringify(this.config)))
    }
  }
}
</script>

<style scoped>
/deep/ .el-tabs__content {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
